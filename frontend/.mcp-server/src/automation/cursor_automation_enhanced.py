#!/usr/bin/env python3
"""
Enhanced Cursor Chat Automation System
Automates chat creation, prompt injection, and loop detection with comprehensive logging.
"""

import json
import logging
import os
import shutil
import subprocess
import tempfile
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Callable
from uuid import uuid4

# Configure comprehensive logging
def setup_logging():
    """Setup comprehensive logging system."""
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure root logger with rotation and UTF-8
    from logging.handlers import RotatingFileHandler
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    # Avoid duplicating handlers if called twice
    root_logger.handlers = []
    root_logger.addHandler(RotatingFileHandler(log_dir / 'cursor_automation.log', maxBytes=2_000_000, backupCount=3, encoding='utf-8'))
    root_logger.addHandler(logging.StreamHandler())
    
    # Create specialized loggers
    automation_logger = logging.getLogger('automation')
    clipboard_logger = logging.getLogger('clipboard')
    session_logger = logging.getLogger('sessions')
    mcp_logger = logging.getLogger('mcp')
    
    # File handlers for specialized logs
    automation_logger.handlers = [RotatingFileHandler(log_dir / 'automation.log', maxBytes=1_000_000, backupCount=3, encoding='utf-8')]
    clipboard_logger.handlers = [RotatingFileHandler(log_dir / 'clipboard.log', maxBytes=1_000_000, backupCount=3, encoding='utf-8')]
    session_logger.handlers = [RotatingFileHandler(log_dir / 'sessions.log', maxBytes=1_000_000, backupCount=3, encoding='utf-8')]
    mcp_logger.handlers = [RotatingFileHandler(log_dir / 'mcp.log', maxBytes=1_000_000, backupCount=3, encoding='utf-8')]
    for lg in (automation_logger, clipboard_logger, session_logger, mcp_logger):
        lg.propagate = False
    
    return {
        'main': logging.getLogger(__name__),
        'automation': automation_logger,
        'clipboard': clipboard_logger,
        'sessions': session_logger,
        'mcp': mcp_logger
    }

# Initialize logging
loggers = setup_logging()
logger = loggers['main']


@dataclass
class ChatSession:
    """Represents an automated chat session."""
    id: str
    role: str  # architect, executor, reviewer
    prompt_template: str
    started_at: float
    last_activity: float
    message_count: int = 0
    last_offsets: Dict[str, int] = field(default_factory=dict)
    loop_detected: bool = False
    status: str = "running"  # running, completed, failed, looped, timeout
    error_count: int = 0
    last_error: Optional[str] = None


@dataclass
class AutomationConfig:
    """Configuration for chat automation."""
    max_iterations: int = 30
    loop_detection_threshold: int = 3
    inactivity_timeout: int = 300  # 5 minutes
    check_interval: int = 10  # seconds
    cursor_workspace: Optional[str] = None
    enable_gui_automation: bool = True
    log_level: str = "INFO"


class EnhancedCursorAutomation:
    """Enhanced automation system with comprehensive logging and error handling."""
    
    def __init__(self, config: AutomationConfig):
        self.config = config
        self.sessions: Dict[str, ChatSession] = {}
        self.mcp_bus = None
        self.running = False
        self._lock = threading.RLock()
        self._cursor_cmd_cache: Optional[str] = None
        self._setup_environment()
        
        logger.info("🚀 Enhanced Cursor Automation System initialized")
        logger.info(f"Configuration: {self.config}")
        
    def _setup_environment(self):
        """Setup and validate environment."""
        env_info = {
            'os': os.name,
            'display': os.environ.get('DISPLAY', 'None'),
            'wsl': self._is_wsl_environment(),
            'xauthority': os.environ.get('XAUTHORITY', 'None'),
            'cursor_cmd': self._find_cursor_command()
        }
        
        logger.info(f"Environment info: {env_info}")
        loggers['automation'].info(f"Environment setup: {json.dumps(env_info, indent=2)}")
        
    def _is_wsl_environment(self) -> bool:
        """Detect if running in WSL."""
        try:
            with open('/proc/version', 'r') as f:
                content = f.read().lower()
                is_wsl = 'microsoft' in content or 'wsl' in content
                logger.debug(f"WSL detection: {is_wsl}")
                return is_wsl
        except Exception as e:
            logger.debug(f"WSL detection failed: {e}")
            return False
    
    def connect_to_mcp(self, bus_instance):
        """Connect to MCP message bus for coordination."""
        self.mcp_bus = bus_instance
        loggers['mcp'].info("Connected to MCP message bus")
        
    def create_chat_session(self, role: str, prompt_template: str) -> str:
        """Create a new automated chat session with logging."""
        session_id = f"{role}_{uuid4().hex[:8]}_{int(time.time())}"
        
        session = ChatSession(
            id=session_id,
            role=role,
            prompt_template=prompt_template,
            started_at=time.time(),
            last_activity=time.time()
        )
        
        with self._lock:
            self.sessions[session_id] = session
            
        loggers['sessions'].info(f"📝 Created session: {session_id}")
        loggers['sessions'].debug(f"Session details: role={role}, prompt_length={len(prompt_template)}")
        logger.info(f"✅ Session created: {session_id} ({role})")
            
        return session_id
    
    def launch_cursor_with_prompt(self, session_id: str) -> bool:
        """Launch Cursor IDE with comprehensive error handling and logging."""
        if session_id not in self.sessions:
            logger.error(f"❌ Session {session_id} not found")
            return False
            
        session = self.sessions[session_id]
        loggers['automation'].info(f"🚀 Launching Cursor for {session_id} ({session.role})")
        
        success = False
        
        try:
            # Step 1: Find and validate Cursor command
            cursor_cmd = self._find_cursor_command()
            if not cursor_cmd:
                loggers['automation'].warning("⚠️ Cursor command not found in PATH")
                self._log_cursor_installation_help()
                return False
                
            loggers['automation'].info(f"✅ Cursor command: {cursor_cmd}")
            
            # Step 2: Launch Cursor application
            success = self._launch_cursor_application(cursor_cmd, session)
            
            if success:
                # Step 3: Inject prompt
                time.sleep(2)  # Wait for Cursor to load
                self._inject_prompt_with_fallbacks(session)
                
                # Step 4: Update session
                session.last_activity = time.time()
                loggers['sessions'].info(f"✅ Session {session_id} launched successfully")
                
        except Exception as e:
            logger.error(f"❌ Failed to launch Cursor for {session_id}: {e}")
            loggers['automation'].error(f"Launch error details: {e}", exc_info=True)
            session.error_count += 1
            session.last_error = str(e)
            success = False
            
        return success
    
    def _find_cursor_command(self) -> Optional[str]:
        """Find Cursor command with caching and safe checks."""
        if self._cursor_cmd_cache and os.path.exists(os.path.expandvars(self._cursor_cmd_cache)):
            return self._cursor_cmd_cache

        possible_commands = [
            'cursor',
            'code-cursor', 
            '/usr/local/bin/cursor',
            '/opt/cursor/cursor',
            '/snap/bin/cursor',
            'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\cursor\\Cursor.exe',
            '/Applications/Cursor.app/Contents/MacOS/Cursor'
        ]
        # Prefer PATH lookup without executing
        import shutil as _sh
        for cmd in possible_commands:
            expanded = os.path.expandvars(cmd)
            path = _sh.which(expanded) or expanded
            if os.path.isfile(path) and os.access(path, os.X_OK):
                self._cursor_cmd_cache = path
                loggers['automation'].debug(f"Found Cursor command: {path}")
                return path
        return None
    
    def _log_cursor_installation_help(self):
        """Log help for Cursor installation."""
        help_text = """
        Cursor IDE not found. Install from:
        
        🌐 Download: https://cursor.com
        
        📦 Installation methods:
        - Linux: Download AppImage or use package manager
        - Windows: Download installer from website  
        - macOS: Download DMG from website
        
        🔧 Manual PATH setup:
        - Add cursor command to your PATH
        - Or use full path to executable
        """
        
        loggers['automation'].info(help_text)
        logger.warning("⚠️ Cursor IDE installation required - see logs for details")
    
    def _launch_cursor_application(self, cursor_cmd: str, session: ChatSession) -> bool:
        """Launch Cursor application with workspace."""
        try:
            # Special handling for WSL: try Windows Cursor.exe via PowerShell, fallback to native
            if self._is_wsl_environment():
                # Try PowerShell method first (if available)
                pwsh_cmd = shutil.which('powershell.exe')
                # Fallback to Windows path when interop PATH doesn't expose powershell.exe
                if not pwsh_cmd and os.path.exists('/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe'):
                    pwsh_cmd = '/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe'
                if pwsh_cmd:
                    win_workspace = ""
                    if self.config.cursor_workspace and os.path.exists(self.config.cursor_workspace):
                        try:
                            conv = subprocess.run(['wslpath', '-w', self.config.cursor_workspace], capture_output=True, text=True, timeout=5)
                            if conv.returncode == 0:
                                win_workspace = conv.stdout.strip()
                                loggers['automation'].info(f"📁 Opening workspace (Windows path): {win_workspace}")
                        except Exception as e:
                            loggers['automation'].debug(f"wslpath failed: {e}")

                    ps = r"""
$ErrorActionPreference = 'Stop'
$cursorExe1 = Join-Path $env:LOCALAPPDATA 'Programs\Cursor\Cursor.exe'
$cursorExe2 = Join-Path $env:ProgramFiles 'Cursor\Cursor.exe'
if (Test-Path $cursorExe1) { $cursorExe = $cursorExe1 }
elseif (Test-Path $cursorExe2) { $cursorExe = $cursorExe2 }
else { throw 'Cursor.exe not found' }
$args = @()
if ($env:CURSOR_WORKSPACE -and (Test-Path $env:CURSOR_WORKSPACE)) { $args += $env:CURSOR_WORKSPACE }
Start-Process -FilePath $cursorExe -ArgumentList $args | Out-Null
"""
                    env = os.environ.copy()
                    if win_workspace:
                        env['CURSOR_WORKSPACE'] = win_workspace
                    
                    try:
                        result = subprocess.run([pwsh_cmd, '-NoProfile', '-Command', ps], env=env, capture_output=True, text=True, timeout=15)
                        if result.returncode == 0:
                            loggers['automation'].info("✅ Cursor launched via PowerShell")
                            return True
                        else:
                            loggers['automation'].debug(f"PowerShell launch stderr: {result.stderr}")
                    except Exception as e:
                        loggers['automation'].debug(f"PowerShell launch failed: {e}")
                
                # Fallback to native cursor command in WSL
                loggers['automation'].info("⚡ PowerShell not available, using native cursor command")
                cmd_args = [cursor_cmd, '--new-window']  # Force new window
                if self.config.cursor_workspace and os.path.exists(self.config.cursor_workspace):
                    cmd_args.append(self.config.cursor_workspace)
                    loggers['automation'].info(f"📁 Opening workspace: {self.config.cursor_workspace}")
                
                try:
                    # Run in background to allow multiple instances
                    subprocess.Popen(cmd_args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    loggers['automation'].info("✅ Cursor launched natively in WSL (new window)")
                    return True
                except Exception as e:
                    loggers['automation'].error(f"Native cursor launch failed: {e}")
                    return False

            # Non-WSL: use native cursor command non-blocking
            cmd_args = [cursor_cmd]

            if self.config.cursor_workspace and os.path.exists(self.config.cursor_workspace):
                cmd_args.append(self.config.cursor_workspace)
                loggers['automation'].info(f"📁 Opening workspace: {self.config.cursor_workspace}")
            else:
                loggers['automation'].info("📁 Opening Cursor without specific workspace")

            try:
                subprocess.Popen(cmd_args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                loggers['automation'].info("✅ Cursor launch initiated (non-blocking)")
                return True
            except Exception as e:
                loggers['automation'].error(f"Failed to spawn Cursor: {e}")
                return False
            
        except subprocess.TimeoutExpired:
            loggers['automation'].warning("⚠️ Cursor launch timed out (15s)")
            return True  # Assume success, Cursor might be starting in background
        except Exception as e:
            loggers['automation'].error(f"Failed to launch Cursor: {e}")
            return False
    
    def _inject_prompt_with_fallbacks(self, session: ChatSession):
        """Inject prompt using multiple fallback methods."""
        loggers['clipboard'].info(f"💉 Injecting prompt for {session.id} ({len(session.prompt_template)} chars)")
        
        methods = [
            ("clipboard_linux", self._inject_via_clipboard_linux),
            ("clipboard_windows", self._inject_via_clipboard_windows), 
            ("file_fallback", self._inject_via_file_fallback),
            ("direct_input", self._inject_via_direct_input)
        ]
        
        for method_name, method_func in methods:
            try:
                loggers['clipboard'].debug(f"Trying method: {method_name}")
                
                if method_func(session.prompt_template):
                    loggers['clipboard'].info(f"✅ Success with method: {method_name}")
                    # If we used file fallback, also create a local instruction file for convenience
                    if method_name == "file_fallback":
                        try:
                            self._create_manual_instruction_file(session)
                        except Exception as e:
                            loggers['clipboard'].debug(f"Manual instruction file note failed: {e}")
                    return
                    
            except Exception as e:
                loggers['clipboard'].warning(f"Method {method_name} failed: {e}")
                continue
        
        loggers['clipboard'].error("❌ All injection methods failed")
        self._create_manual_instruction_file(session)
    
    def _inject_via_clipboard_linux(self, prompt: str) -> bool:
        """Linux clipboard injection with multiple tools."""
        if os.name != 'posix':
            return False
            
        # If running under WSL, prefer Windows clipboard + Windows key injection
        if self._is_wsl_environment():
            # Resolve clip.exe path for WSL interop
            clip_cmd = 'clip.exe'
            try:
                import shutil as _sh
                found = _sh.which('clip.exe')
                if not found and os.path.exists('/mnt/c/Windows/System32/clip.exe'):
                    clip_cmd = '/mnt/c/Windows/System32/clip.exe'
            except Exception:
                if os.path.exists('/mnt/c/Windows/System32/clip.exe'):
                    clip_cmd = '/mnt/c/Windows/System32/clip.exe'

            if self._try_clipboard_tool([clip_cmd], prompt):
                # Attempt to open chat and paste via Windows automation
                if self._simulate_paste_wsl_windows():
                    return True
            # If Windows automation fails, fall back to file-based approach handled elsewhere
            return False

        # Native Linux path: try xclip/xsel then simulate via xdotool/pyautogui
        tools = []
        if os.environ.get('WAYLAND_DISPLAY'):
            tools.append(['wl-copy'])
        tools.extend([
            ['xclip', '-selection', 'clipboard'],
            ['xsel', '--clipboard', '--input'],
        ])
        for tool in tools:
            if self._try_clipboard_tool(tool, prompt):
                return self._simulate_paste_linux()
        return False
    
    def _try_clipboard_tool(self, tool_cmd: List[str], prompt: str) -> bool:
        """Try a specific clipboard tool."""
        try:
            env = os.environ.copy()
            # Remove problematic XAUTHORITY if file doesn't exist
            xauth = env.get('XAUTHORITY')
            if xauth and not os.path.exists(xauth):
                env.pop('XAUTHORITY', None)
                loggers['clipboard'].debug(f"Removed invalid XAUTHORITY: {xauth}")
            
            process = subprocess.run(
                tool_cmd,
                input=prompt,
                text=True,
                env=env,
                capture_output=True,
                timeout=10
            )
            
            success = process.returncode == 0
            
            loggers['clipboard'].debug(f"Tool {tool_cmd[0]}: return_code={process.returncode}")
            if process.stderr:
                loggers['clipboard'].debug(f"Tool stderr: {process.stderr}")
                
            return success
            
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError) as e:
            loggers['clipboard'].debug(f"Tool {tool_cmd[0]} error: {e}")
            return False
    
    def _simulate_paste_linux(self) -> bool:
        """Simulate paste operation on Linux."""
        if not self.config.enable_gui_automation:
            loggers['clipboard'].info("GUI automation disabled - manual paste required")
            return True
            
        try:
            # Wayland: try wtype first
            if os.environ.get('WAYLAND_DISPLAY') and self._try_wtype_paste():
                return True
            # X11: try xdotool
            if self._try_xdotool_paste():
                return True
                
            # Fall back to pyautogui
            return self._try_pyautogui_paste()
            
        except Exception as e:
            loggers['clipboard'].warning(f"Paste simulation failed: {e}")
            return False

    def _try_wtype_paste(self) -> bool:
        """Try pasting with wtype on Wayland."""
        try:
            # Send chat hotkeys then paste
            hotkeys = os.environ.get('CURSOR_CHAT_HOTKEYS', 'ctrl+l,ctrl+k').split(',')
            for hk in hotkeys:
                subprocess.run(['wtype', f'--keys={hk}'], timeout=2)
                time.sleep(0.3)
            subprocess.run(['wtype', '--keys=ctrl+v'], timeout=2)
            time.sleep(0.3)
            subprocess.run(['wtype', '--keys=enter'], timeout=2)
            loggers['clipboard'].info("✅ wtype paste completed")
            return True
        except (FileNotFoundError, subprocess.TimeoutExpired) as e:
            loggers['clipboard'].debug(f"wtype paste failed: {e}")
            return False
    
    def _try_xdotool_paste(self) -> bool:
        """Try pasting with xdotool."""
        try:
            # Find Cursor window
            result = subprocess.run(
                ['xdotool', 'search', '--name', 'Cursor'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if not result.stdout.strip():
                loggers['clipboard'].debug("No Cursor window found with xdotool")
                return False
                
            window_id = result.stdout.strip().split('\\n')[0]
            loggers['clipboard'].debug(f"Found Cursor window: {window_id}")
            
            # Activate and paste
            subprocess.run(['xdotool', 'windowactivate', window_id], timeout=2)
            time.sleep(0.5)
            hotkeys = os.environ.get('CURSOR_CHAT_HOTKEYS', 'ctrl+l,ctrl+k').split(',')
            for hk in hotkeys:
                subprocess.run(['xdotool', 'key', hk], timeout=2)
                time.sleep(0.3)
            time.sleep(0.5)
            subprocess.run(['xdotool', 'key', 'ctrl+v'], timeout=2)  # Paste
            time.sleep(0.5)
            subprocess.run(['xdotool', 'key', 'Return'], timeout=2)  # Send
            
            loggers['clipboard'].info("✅ xdotool paste completed")
            return True
            
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            loggers['clipboard'].debug(f"xdotool paste failed: {e}")
            return False
    
    def _try_pyautogui_paste(self) -> bool:
        """Try pasting with pyautogui."""
        try:
            import pyautogui
            
            loggers['clipboard'].debug("Using pyautogui for paste simulation")
            time.sleep(1)
            hotkeys = os.environ.get('CURSOR_CHAT_HOTKEYS', 'ctrl+l,ctrl+k').split(',')
            for hk in hotkeys:
                pyautogui.hotkey(*hk.split('+'))
                time.sleep(0.3)
            time.sleep(0.5)
            pyautogui.hotkey('ctrl', 'v')  # Paste
            time.sleep(0.5)
            pyautogui.press('enter')  # Send
            
            loggers['clipboard'].info("✅ pyautogui paste completed")
            return True
            
        except ImportError:
            loggers['clipboard'].debug("pyautogui not available")
            return False
        except Exception as e:
            loggers['clipboard'].debug(f"pyautogui paste failed: {e}")
            return False

    def _simulate_paste_wsl_windows(self) -> bool:
        """Simulate paste on Windows from WSL using PowerShell SendKeys."""
        # Check if PowerShell is available
        if not shutil.which('powershell.exe'):
            loggers['clipboard'].debug("PowerShell not available for paste simulation")
            return False
            
        try:
            pwsh_cmd = shutil.which('powershell.exe')
            if not pwsh_cmd and os.path.exists('/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe'):
                pwsh_cmd = '/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe'
            if not pwsh_cmd:
                loggers['clipboard'].debug("PowerShell path not found for SendKeys")
                return False
            window_title = os.environ.get('CURSOR_WINDOW_TITLE', 'Cursor')
            ps_script = r"""
$ErrorActionPreference = 'Stop'
$wshell = New-Object -ComObject wscript.shell
Start-Sleep -Milliseconds 300
# Try to focus Cursor window by title
$null = $wshell.AppActivate('""" + window_title + r"""')
Start-Sleep -Milliseconds 300
$wshell.SendKeys('^l')
Start-Sleep -Milliseconds 200
$wshell.SendKeys('^v')
Start-Sleep -Milliseconds 200
$wshell.SendKeys('{ENTER}')
"""
            result = subprocess.run(
                [pwsh_cmd, '-NoProfile', '-Command', ps_script],
                capture_output=True,
                text=True,
                timeout=8
            )
            if result.returncode == 0:
                loggers['clipboard'].info("✅ Sent paste+enter to Cursor via PowerShell SendKeys")
                return True
            else:
                loggers['clipboard'].debug(f"PowerShell SendKeys rc={result.returncode} stderr={result.stderr}")
                return False
        except Exception as e:
            loggers['clipboard'].debug(f"WSL Windows paste simulation failed: {e}")
            return False
    
    def _inject_via_clipboard_windows(self, prompt: str) -> bool:
        """Windows clipboard injection."""
        if os.name != 'nt':
            return False
            
        try:
            # Try pyperclip first
            try:
                import pyperclip
                pyperclip.copy(prompt)
                loggers['clipboard'].info("✅ Windows clipboard set via pyperclip")
            except ImportError:
                # Fall back to clip.exe
                process = subprocess.run(
                    ['clip'],
                    input=prompt,
                    text=True,
                    timeout=5
                )
                if process.returncode != 0:
                    return False
                loggers['clipboard'].info("✅ Windows clipboard set via clip.exe")
            
            # Simulate paste
            return self._simulate_paste_windows()
            
        except Exception as e:
            loggers['clipboard'].error(f"Windows clipboard injection failed: {e}")
            return False
    
    def _simulate_paste_windows(self) -> bool:
        """Simulate paste on Windows."""
        if not self.config.enable_gui_automation:
            return True
            
        try:
            import pyautogui
            import pygetwindow as gw
            
            # Find Cursor window
            cursor_windows = [w for w in gw.getAllWindows() 
                            if 'cursor' in w.title.lower()]
            
            if cursor_windows:
                window = cursor_windows[0]
                window.activate()
                time.sleep(1)
                
                # Paste sequence
                pyautogui.hotkey('ctrl', 'l')
                time.sleep(0.5)
                pyautogui.hotkey('ctrl', 'v')
                time.sleep(0.5)
                pyautogui.press('enter')
                
                loggers['clipboard'].info("✅ Windows paste simulation completed")
                return True
                
        except ImportError:
            loggers['clipboard'].debug("Windows GUI automation libraries not available")
        except Exception as e:
            loggers['clipboard'].debug(f"Windows paste simulation failed: {e}")

        # Fallback to PowerShell SendKeys if pyautogui/gw fails
        try:
            pwsh = shutil.which('powershell.exe') or 'powershell.exe'
            window_title = os.environ.get('CURSOR_WINDOW_TITLE', 'Cursor')
            ps_script = f"$ws = New-Object -ComObject wscript.shell; Start-Sleep -Milliseconds 300; $null = $ws.AppActivate('{window_title}'); Start-Sleep -Milliseconds 300; $ws.SendKeys('^l'); Start-Sleep -Milliseconds 150; $ws.SendKeys('^v'); Start-Sleep -Milliseconds 150; $ws.SendKeys('{ENTER}')"
            r = subprocess.run([pwsh, '-NoProfile', '-Command', ps_script], capture_output=True, text=True, timeout=8)
            if r.returncode == 0:
                loggers['clipboard'].info("✅ Windows SendKeys fallback completed")
                return True
        except Exception as e:
            loggers['clipboard'].debug(f"PowerShell SendKeys fallback failed: {e}")

        return False
    
    def _inject_via_file_fallback(self, prompt: str) -> bool:
        """File-based fallback method with enhanced automation attempts."""
        try:
            prompt_file = Path(tempfile.gettempdir()) / f"cursor_prompt_{int(time.time())}.txt"
            prompt_file.write_text(prompt, encoding='utf-8')
            
            loggers['clipboard'].info(f"📄 Prompt saved to file: {prompt_file}")
            
            # Try multiple automation approaches
            automation_success = False
            
            # Method 1: Try Linux clipboard + automation (for native Linux Cursor)
            if self._try_native_linux_automation(prompt):
                automation_success = True
                loggers['clipboard'].info("✅ Native Linux automation successful")
            
            # Method 2: Try WSL clipboard + attempt paste via SendKeys
            elif self._try_wsl_clipboard_automation(prompt):
                # Attempt to paste with SendKeys as part of WSL flow
                if self._simulate_paste_wsl_windows():
                    automation_success = True
                    loggers['clipboard'].info("✅ WSL clipboard automation successful via SendKeys")
                else:
                    automation_success = True
                    loggers['clipboard'].info("✅ WSL clipboard set; manual paste may be required")
            
            # Method 3: Pure file-based fallback with enhanced instructions
            if not automation_success:
                logger.info(f"💡 Quick Setup Instructions:")
                logger.info(f"   1. Look for new Cursor window that should have opened")
                logger.info(f"   2. In Cursor, click the chat icon or press Ctrl+L")
                logger.info(f"   3. The prompt is already copied to your clipboard - just paste (Ctrl+V)")
                logger.info(f"   4. Press Enter to start the agent")
                logger.info(f"")
                logger.info(f"🔧 If no window opened, manually open Cursor and paste from: {prompt_file}")
                
                # Try to make a system notification
                self._show_desktop_notification(f"Cursor Agent Setup", 
                    f"New agent ready! Paste clipboard content in Cursor chat.")
            
            return automation_success
            
        except Exception as e:
            loggers['clipboard'].error(f"File fallback failed: {e}")
            return False
    
    def _try_native_linux_automation(self, prompt: str) -> bool:
        """Try native Linux automation with clipboard and xdotool."""
        try:
            # First, try to copy to Linux clipboard
            if self._try_clipboard_tool(['xclip', '-selection', 'clipboard'], prompt):
                # Then try to find and interact with Cursor windows
                result = subprocess.run(['xdotool', 'search', '--name', 'Cursor'], 
                                      capture_output=True, text=True, timeout=3)
                
                if result.stdout.strip():
                    window_ids = result.stdout.strip().split('\n')
                    # Try to paste in the first Cursor window found
                    subprocess.run(['xdotool', 'windowfocus', window_ids[0]], timeout=2)
                    time.sleep(0.5)
                    subprocess.run(['xdotool', 'key', 'ctrl+l'], timeout=2)  # Focus chat input
                    time.sleep(0.5)
                    subprocess.run(['xdotool', 'key', 'ctrl+v'], timeout=2)  # Paste
                    time.sleep(0.5)
                    subprocess.run(['xdotool', 'key', 'Return'], timeout=2)  # Send
                    return True
                    
        except Exception as e:
            loggers['clipboard'].debug(f"Native Linux automation failed: {e}")
        
        return False
    
    def _try_wsl_clipboard_automation(self, prompt: str) -> bool:
        """Try WSL clipboard automation with notification."""
        try:
            # Try to use Windows clipboard if available
            clip_cmd = shutil.which('clip.exe')
            if not clip_cmd and os.path.exists('/mnt/c/Windows/System32/clip.exe'):
                clip_cmd = '/mnt/c/Windows/System32/clip.exe'
            if not clip_cmd:
                loggers['clipboard'].debug('clip.exe not found in WSL')
                return False
            proc = subprocess.run([clip_cmd], input=prompt, text=True, timeout=5)
            if proc.returncode == 0:
                loggers['clipboard'].info("📋 Prompt copied to Windows clipboard")
                loggers['clipboard'].info("🎯 Next steps: Switch to Cursor, create new chat, and paste (Ctrl+V)")
                
                # Try to create a desktop notification if possible
                try:
                    subprocess.run(['notify-send', 'Cursor Automation', 
                                   'Prompt copied to clipboard. Switch to Cursor and paste!'], 
                                   timeout=2)
                except:
                    pass
                
                return True
        except Exception as e:
            loggers['clipboard'].debug(f"WSL clipboard automation failed: {e}")
        
        return False

    def _show_desktop_notification(self, title: str, message: str):
        """Show desktop notification if possible."""
        try:
            # Try notify-send (Linux)
            subprocess.run(['notify-send', title, message], timeout=2, capture_output=True)
        except:
            try:
                # Try Windows toast notification
                subprocess.run(['powershell.exe', '-Command', 
                               f'[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null; '
                               f'[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null; '
                               f'$template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02); '
                               f'$template.SelectSingleNode("//text[@id=1]").InnerText = "{title}"; '
                               f'$template.SelectSingleNode("//text[@id=2]").InnerText = "{message}"; '
                               f'$toast = [Windows.UI.Notifications.ToastNotification]::new($template); '
                               f'[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("Cursor Automation").Show($toast)'], 
                               timeout=3, capture_output=True)
            except:
                pass  # Notifications not available, continue silently

    def _inject_via_direct_input(self, prompt: str) -> bool:
        """Direct input simulation (if possible)."""
        loggers['clipboard'].debug("Direct input method not implemented")
        return False
    
    def _create_manual_instruction_file(self, session: ChatSession):
        """Create manual instruction file."""
        try:
            instructions = f"""
# Manual Setup Instructions for {session.id}

## Session Details
- ID: {session.id}
- Role: {session.role}
- Created: {time.ctime(session.started_at)}

## Steps
1. Open Cursor IDE
2. Create a new chat
3. Copy and paste the prompt below:

---
{session.prompt_template}
---

## Expected Behavior
The agent should register with MCP and begin coordination.

Generated at: {time.ctime()}
"""
            
            instruction_file = Path(f"manual_setup_{session.id}.txt")
            instruction_file.write_text(instructions)
            
            logger.warning(f"⚠️ Manual setup required - see: {instruction_file}")
            loggers['automation'].info(f"Manual instruction file created: {instruction_file}")
            
        except Exception as e:
            logger.error(f"Failed to create instruction file: {e}")
    
    def monitor_sessions(self):
        """Enhanced session monitoring with detailed logging."""
        self.running = True
        loggers['sessions'].info("🔍 Starting enhanced session monitoring...")
        
        monitoring_stats = {
            'cycles': 0,
            'active_sessions': 0,
            'completed_sessions': 0,
            'failed_sessions': 0
        }
        
        while self.running:
            try:
                current_time = time.time()
                active_sessions = []
                
                with self._lock:
                    for session_id, session in list(self.sessions.items()):
                        if session.status == "running":
                            active_sessions.append(session)
                            self._monitor_single_session(session, current_time)
                        
                monitoring_stats['cycles'] += 1
                monitoring_stats['active_sessions'] = len(active_sessions)
                
                # Log monitoring status every 5 minutes
                if monitoring_stats['cycles'] % 30 == 0:  # Every 5 minutes (10s * 30)
                    loggers['sessions'].info(f"📊 Monitoring stats: {monitoring_stats}")
                    
                    for session in active_sessions:
                        runtime = current_time - session.started_at
                        inactive = current_time - session.last_activity
                        loggers['sessions'].info(
                            f"Session {session.id}: runtime={runtime:.1f}s, "
                            f"inactive={inactive:.1f}s, errors={session.error_count}"
                        )
                
                time.sleep(self.config.check_interval)
                
            except KeyboardInterrupt:
                loggers['sessions'].info("Received interrupt - stopping monitoring...")
                self.stop_monitoring()
                break
            except Exception as e:
                loggers['sessions'].error(f"Monitoring error: {e}", exc_info=True)
                time.sleep(5)
        
        loggers['sessions'].info("🛑 Session monitoring stopped")
    
    def _monitor_single_session(self, session: ChatSession, current_time: float):
        """Monitor a single session."""
        runtime = current_time - session.started_at
        inactive_time = current_time - session.last_activity
        
        # Check for timeout
        if inactive_time > self.config.inactivity_timeout:
            session.status = "timeout"
            loggers['sessions'].warning(
                f"⏰ Session {session.id} timed out (inactive: {inactive_time:.1f}s)"
            )
            self._handle_session_timeout(session)
            return
        
        # Check for loops (if MCP available)
        if self.mcp_bus and self._detect_loop(session):
            session.loop_detected = True
            session.status = "looped"
            loggers['sessions'].warning(f"🔄 Loop detected in {session.id}")
            self._handle_loop_detection(session)
            return
        
        # Check for completion
        if self._check_completion(session):
            session.status = "completed"
            loggers['sessions'].info(f"✅ Session {session.id} completed")
            self._handle_session_completion(session)
            return
    
    def _detect_loop(self, session: ChatSession) -> bool:
        """Enhanced loop detection."""
        try:
            channel = f"{session.role}_messages"
            since = session.last_offsets.get(channel, 0)
            messages = self.mcp_bus.pull(channel, since=since, limit=5)
            
            items = messages.get('items', [])
            # Update counters/offsets
            session.message_count += len(items)
            if 'next' in messages:
                session.last_offsets[channel] = messages['next']
            elif items:
                session.last_offsets[channel] = since + len(items)
            if len(items) >= self.config.loop_detection_threshold:
                # Simple similarity check
                recent_bodies = [str(item.get('body', '')) for item in items[-3:]]
                unique_messages = len(set(recent_bodies))
                
                is_loop = unique_messages <= 1
                
                if is_loop:
                    loggers['sessions'].debug(f"Loop detected in {session.id}: {recent_bodies}")
                    
                return is_loop
                
        except Exception as e:
            loggers['mcp'].error(f"Loop detection error: {e}")
            
        return False
    
    def _check_completion(self, session: ChatSession) -> bool:
        """Check for session completion signals."""
        try:
            channel = f"{session.role}_status"
            since = session.last_offsets.get(channel, 0)
            messages = self.mcp_bus.pull(channel, since=since, limit=5)
            
            items = messages.get('items', [])
            # Update offsets
            session.message_count += len(items)
            if 'next' in messages:
                session.last_offsets[channel] = messages['next']
            elif items:
                session.last_offsets[channel] = since + len(items)

            for item in items:
                body = item.get('body', {})
                if isinstance(body, dict) and body.get('done') is True:
                    return True
                    
        except Exception as e:
            loggers['mcp'].error(f"Completion check error: {e}")
            
        return False
    
    def _handle_session_timeout(self, session: ChatSession):
        """Handle session timeout with detailed logging."""
        runtime = time.time() - session.started_at
        loggers['sessions'].info(
            f"⏰ Session {session.id} timeout - Runtime: {runtime:.1f}s, "
            f"Messages: {session.message_count}, Errors: {session.error_count}"
        )
        
        self._save_session_summary(session, "timeout")
    
    def _handle_loop_detection(self, session: ChatSession):
        """Handle loop detection with intervention."""
        loggers['sessions'].warning(f"🔄 Handling loop in {session.id}")
        
        # Create enhanced loop breaker
        loop_breaker = self._create_loop_breaker_prompt(session)
        
        try:
            self._inject_prompt_with_fallbacks_simple(loop_breaker)
            session.last_activity = time.time()
            session.error_count += 1
            session.last_error = "Loop detected and intervention applied"
            
        except Exception as e:
            loggers['sessions'].error(f"Failed to inject loop breaker: {e}")
    
    def _create_loop_breaker_prompt(self, session: ChatSession) -> str:
        """Create contextual loop breaker prompt."""
        runtime = time.time() - session.started_at
        
        return f"""
🔄 LOOP DETECTION ALERT - Session: {session.id}

Current Status Analysis:
- Role: {session.role}
- Runtime: {runtime:.1f} seconds ({runtime/60:.1f} minutes)
- Message Count: {session.message_count}
- Error Count: {session.error_count}
- Last Activity: {time.time() - session.last_activity:.1f} seconds ago

REQUIRED IMMEDIATE ACTIONS:
1. **STOP** current approach - it's not working
2. **SUMMARIZE** what you've tried so far
3. **IDENTIFY** the specific blocking issue
4. **PROPOSE** a completely different strategy
5. **If genuinely stuck**: Respond with [[NEEDS-HUMAN-REVIEW]]

Break this loop by changing your strategy NOW!
"""
    
    def _inject_prompt_with_fallbacks_simple(self, prompt: str):
        """Simplified prompt injection for loop breaking."""
        # Try clipboard methods only
        if os.name == 'posix':
            self._inject_via_clipboard_linux(prompt)
        elif os.name == 'nt':
            self._inject_via_clipboard_windows(prompt)
        else:
            self._inject_via_file_fallback(prompt)
    
    def _handle_session_completion(self, session: ChatSession):
        """Handle successful session completion."""
        runtime = time.time() - session.started_at
        loggers['sessions'].info(
            f"🎉 Session {session.id} completed successfully! "
            f"Runtime: {runtime:.1f}s, Messages: {session.message_count}"
        )
        
        self._save_session_summary(session, "completed")
    
    def _save_session_summary(self, session: ChatSession, final_status: str):
        """Save comprehensive session summary."""
        try:
            summary = {
                'session_id': session.id,
                'role': session.role,
                'status': final_status,
                'started_at': session.started_at,
                'ended_at': time.time(),
                'runtime_seconds': time.time() - session.started_at,
                'last_activity': session.last_activity,
                'message_count': session.message_count,
                'loop_detected': session.loop_detected,
                'error_count': session.error_count,
                'last_error': session.last_error,
                'prompt_length': len(session.prompt_template)
            }
            
            summary_file = Path(f"session_summary_{session.id}_{final_status}.json")
            summary_file.write_text(json.dumps(summary, indent=2))
            
            loggers['sessions'].info(f"💾 Session summary saved: {summary_file}")
            
        except Exception as e:
            loggers['sessions'].error(f"Failed to save session summary: {e}")
    
    def stop_monitoring(self):
        """Stop monitoring with cleanup."""
        self.running = False
        loggers['sessions'].info("Stopping monitoring and cleaning up...")
        
        # Save all active session summaries
        with self._lock:
            for session in self.sessions.values():
                if session.status == "running":
                    session.status = "interrupted"
                    self._save_session_summary(session, "interrupted")
    
    def get_detailed_status(self) -> Dict:
        """Get comprehensive status report."""
        current_time = time.time()
        
        status = {
            'automation_system': {
                'running': self.running,
                'config': self.config.__dict__,
                'session_count': len(self.sessions)
            },
            'sessions': {},
            'environment': {
                'os': os.name,
                'wsl': self._is_wsl_environment(),
                'display': os.environ.get('DISPLAY'),
                'cursor_found': (self._cursor_cmd_cache is not None) or (self._find_cursor_command() is not None)
            }
        }
        with self._lock:
            sessions_copy = dict(self.sessions)
        for session_id, session in sessions_copy.items():
            status['sessions'][session_id] = {
                'id': session.id,
                'role': session.role,
                'status': session.status,
                'runtime': current_time - session.started_at,
                'inactive_time': current_time - session.last_activity,
                'message_count': session.message_count,
                'error_count': session.error_count,
                'loop_detected': session.loop_detected
            }
        
        return status


if __name__ == "__main__":
    # Example usage with comprehensive logging
    config = AutomationConfig(
        cursor_workspace="/home/alex/projects/fin-model",
        enable_gui_automation=True,
        log_level="DEBUG"
    )
    
    automation = EnhancedCursorAutomation(config)
    
    # Test session creation
    test_session = automation.create_chat_session(
        "test_agent",
        "Test prompt for logging validation"
    )
    
    print("Enhanced automation system ready!")
    print("Check logs/ directory for detailed logging output.")
    print(f"Test session created: {test_session}")
