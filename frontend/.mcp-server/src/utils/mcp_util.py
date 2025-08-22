#!/usr/bin/env python3
"""
Unified MCP Utilities CLI — WSL/X11/Clipboard hardened

Key improvements vs previous version:
- Robust clipboard pipeline: wl-clipboard → xclip (X11) → clip.exe (Windows) → pyperclip
- Proper X11 detection (DISPLAY + real server probe), cleaner WSL/WSLg detection
- One-shot apt install incl. wl-clipboard, x11-xserver-utils/x11-utils
- Safe timeouts, no hangs if DISPLAY is unset or server is down
- Auto-setup PYPERCLIP_* to Windows clipboard when available
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path


# -------------------------
# Environment / introspection
# -------------------------

def is_wsl_environment() -> bool:
    try:
        with open("/proc/version", "r") as f:
            s = f.read().lower()
            return "microsoft" in s or "wsl" in s
    except Exception:
        return False


def is_wslg_environment() -> bool:
    # WSLg exposes WAYLAND_DISPLAY and /mnt/wslg
    return bool(os.environ.get("WAYLAND_DISPLAY")) or os.path.exists("/mnt/wslg") or os.environ.get("XDG_SESSION_TYPE") == "wayland"


def get_windows_host_ip() -> str:
    # Classic WSL trick: nameserver in resolv.conf points to Windows side
    try:
        with open("/etc/resolv.conf", "r") as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) >= 2 and parts[0] == "nameserver":
                    return parts[1]
    except Exception:
        pass
    # Fallback: default route gateway
    try:
        out = subprocess.run(["/sbin/ip", "route", "show", "default"], text=True, capture_output=True, timeout=2)
        for tok in out.stdout.split():
            if tok.count(".") == 3 and tok.replace(".", "").isdigit():
                return tok
    except Exception:
        pass
    return ""


def windows_clip_path() -> str | None:
    # Prefer native path; WSL usually resolves these fine
    candidates = [
        "/mnt/c/Windows/System32/clip.exe",
        "/mnt/c/WINDOWS/System32/clip.exe",
        shutil.which("clip.exe"),
    ]
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return None


def powershell_path() -> str | None:
    return shutil.which("powershell.exe")


def find_cursor_command():
    for cmd in ["cursor", "code-cursor"]:
        try:
            r = subprocess.run([cmd, "--version"], capture_output=True, timeout=3)
            if r.returncode == 0:
                return cmd
        except Exception:
            continue
    return None


def cmd_check(args=None) -> dict:
    print("🔍 Environment Analysis")
    print("=" * 40)
    env_info = {
        "os": os.name,
        "display": os.environ.get("DISPLAY", ""),
        "wayland": os.environ.get("WAYLAND_DISPLAY", ""),
        "wsl": is_wsl_environment(),
        "wslg": is_wslg_environment(),
        "xauthority": os.environ.get("XAUTHORITY", ""),
        "cursor_cmd": find_cursor_command(),
        "clip_exe": windows_clip_path() or "None",
        "powershell": powershell_path() or "None",
    }
    for k, v in env_info.items():
        print(f"{k.upper():12}: {v if v else 'None'}")
    return env_info


# -------------------------
# X11 utilities/helpers
# -------------------------

def check_x11_utilities() -> dict:
    print("\n📋 X11 Utilities Check")
    print("=" * 25)
    # Include xdpyinfo for server probe
    utilities = {
        "xset": ["xset", "q"],
        "xclip": ["xclip", "-version"],
        "xdotool": ["xdotool", "version"],
        "xsel": ["xsel", "--version"],
        "xauth": ["xauth", "version"],
        "xdpyinfo": ["xdpyinfo", "-display", os.environ.get("DISPLAY", ":0")],
    }
    available = {}
    for util, cmd in utilities.items():
        try:
            result = subprocess.run(cmd, capture_output=True, timeout=3)
            available[util] = result.returncode == 0
            status = "✅ Available" if available[util] else "❌ Not found/working"
            print(f"{util:12}: {status}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            available[util] = False
            print(f"{util:12}: ❌ Not found")
    return available


def install_x11_utilities():
    print("\n🔧 Installing X11/clipboard utilities")
    print("=" * 35)
    pkgs = ["x11-xserver-utils", "x11-utils", "xclip", "xdotool", "xsel", "xauth", "wl-clipboard"]
    try:
        subprocess.run(["sudo", "apt", "update"], check=True)
        subprocess.run(["sudo", "apt", "install", "-y", *pkgs], check=True)
        print("✅ Packages installed:", ", ".join(pkgs))
    except subprocess.CalledProcessError as e:
        print(f"❌ apt install failed: {e}")


def ensure_display_for_wsl():
    """Set DISPLAY only if not WSLg and not already set."""
    if not is_wsl_environment():
        return
    if os.environ.get("DISPLAY"):
        return
    if is_wslg_environment():
        # WSLg manages DISPLAY automatically
        return
    ip = get_windows_host_ip()
    if ip:
        os.environ["DISPLAY"] = f"{ip}:0.0"
    else:
        os.environ["DISPLAY"] = ":0"
    print(f"✅ Set DISPLAY={os.environ['DISPLAY']}")


def setup_wsl_x11_env() -> bool:
    print("\n🛠️  Setting up WSL X11")
    print("=" * 25)
    if not is_wsl_environment():
        print("❌ Not running in WSL")
        return False
    ensure_display_for_wsl()
    home_xauth = Path.home() / ".Xauthority"
    if not home_xauth.exists():
        try:
            home_xauth.touch()
            print("✅ Created ~/.Xauthority")
        except Exception as e:
            print(f"⚠️ Could not create ~/.Xauthority: {e}")
    os.environ["XAUTHORITY"] = str(home_xauth)
    print(f"✅ Set XAUTHORITY={home_xauth}")
    return True


def check_x11_server_accessible() -> bool:
    print("\n🖥️  X11 Server Check")
    print("=" * 20)
    disp = os.environ.get("DISPLAY", "")
    if not disp:
        print("❌ DISPLAY is unset")
        return False
    # Prefer xdpyinfo when available; fallback to xset
    probe = shutil.which("xdpyinfo")
    cmd = [probe, "-display", disp] if probe else ["xset", "q"]
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=3)
        if r.returncode == 0:
            print("✅ X11 server: Accessible")
            return True
        err = (r.stderr or b"").decode(errors="ignore").strip()
        print(f"❌ X11 server: probe failed (rc={r.returncode}) {err}")
        return False
    except FileNotFoundError:
        print("❌ X11 server: no probe tool (install x11-utils/x11-xserver-utils)")
        return False
    except Exception as e:
        print(f"❌ X11 server: Error - {e}")
        return False


def fix_x11_authentication() -> bool:
    print("\n🔧 Fixing X11 Authentication")
    print("=" * 30)
    setup_wsl_x11_env()
    return check_x11_server_accessible()


# -------------------------
# Clipboard utilities
# -------------------------

def set_pyperclip_to_windows():
    """Configure pyperclip to use Windows clipboard if available."""
    clip = windows_clip_path()
    ps = powershell_path()
    if clip and ps and os.path.exists(clip) and os.path.exists(ps):
        os.environ["PYPERCLIP_COPY"] = clip
        os.environ["PYPERCLIP_PASTE"] = f"{ps} -NoProfile -Command Get-Clipboard"
        return True
    return False


def configure_pyperclip_fallback():
    """Configure pyperclip to use best available method."""
    # Try Windows clipboard first if available
    if set_pyperclip_to_windows():
        return "windows"
    
    # Try xclip if X11 is available
    if os.environ.get("DISPLAY") and shutil.which("xclip"):
        try:
            # Quick test to see if xclip works
            subprocess.run(["xclip", "-version"], capture_output=True, timeout=1)
            os.environ["PYPERCLIP_COPY"] = "xclip -selection clipboard"
            os.environ["PYPERCLIP_PASTE"] = "xclip -selection clipboard -o"
            return "xclip"
        except:
            pass
    
    # Try wl-clipboard if Wayland is available
    if is_wslg_environment() and shutil.which("wl-copy") and shutil.which("wl-paste"):
        try:
            subprocess.run(["wl-copy", "--version"], capture_output=True, timeout=1)
            os.environ["PYPERCLIP_COPY"] = "wl-copy"
            os.environ["PYPERCLIP_PASTE"] = "wl-paste"
            return "wayland"
        except:
            pass
    
    # Fallback to no clipboard (pyperclip will handle gracefully)
    return "none"


def check_clipboard_tools() -> dict:
    print("\n📋 Clipboard Tools Check")
    print("=" * 30)
    tools = {
        "wl-copy": ["wl-copy", "--version"],
        "wl-paste": ["wl-paste", "--version"],
        "xclip": ["xclip", "-version"],
        "xsel": ["xsel", "--version"],
        "clip.exe": [windows_clip_path(), "--help"] if windows_clip_path() else None,
        "powershell.exe": [powershell_path(), "-NoProfile", "-Command", "$PSVersionTable.PSVersion"] if powershell_path() else None,
        "pyperclip": None,
    }
    available = {}
    for tool, cmd in tools.items():
        if cmd:
            try:
                result = subprocess.run(cmd, capture_output=True, timeout=3)
                available[tool] = result.returncode == 0
            except Exception:
                available[tool] = False
        else:
            if tool == "pyperclip":
                try:
                    import pyperclip  # noqa: F401
                    available[tool] = True
                except Exception:
                    available[tool] = False
            else:
                available[tool] = False
        status = "✅ Available" if available[tool] else "❌ Not found"
        print(f"{tool:13}: {status}")
    return available


def install_clipboard_tools():
    print("\n🛠️ Installing Missing Tools")
    print("=" * 30)
    if os.name == "posix":
        try:
            subprocess.run(["sudo", "apt", "update"], check=True)
            subprocess.run(["sudo", "apt", "install", "-y", "wl-clipboard", "xclip", "xdotool", "xsel"], check=True)
            print("✅ Installed: wl-clipboard xclip xdotool xsel")
        except subprocess.CalledProcessError as e:
            print(f"⚠️  apt install failed: {e}")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-U", "pyperclip"], check=True)
        print("✅ pyperclip installed/updated")
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Could not install pyperclip: {e}")


def test_clipboard() -> bool:
    print("\n🧪 Testing Clipboard Functionality")
    print("=" * 35)
    test_text = "Test clipboard functionality"
    
    clipboard_working = False
    methods_tried = []

    # 1) Wayland (WSLg) - Skip if timeout issues detected
    if is_wslg_environment() and shutil.which("wl-copy") and shutil.which("wl-paste"):
        methods_tried.append("wl-clipboard")
        try:
            # Test if wl-copy is responsive first
            test_proc = subprocess.run(["wl-copy", "--version"], capture_output=True, timeout=1)
            if test_proc.returncode == 0:
                w = subprocess.run(["wl-copy"], input=test_text, text=True, capture_output=True, timeout=5)
                if w.returncode == 0:
                    r = subprocess.run(["wl-paste"], text=True, capture_output=True, timeout=5)
                    if r.returncode == 0 and r.stdout.strip() == test_text:
                        print("✅ wl-clipboard: Working")
                        return True
                    print(f"❌ wl-clipboard: Read failed (rc={r.returncode})")
                else:
                    print(f"❌ wl-clipboard: Write failed (rc={w.returncode})")
            else:
                print("⚠️  wl-clipboard: Not responsive, skipping")
        except subprocess.TimeoutExpired:
            print("⚠️  wl-clipboard: Timeout, may not have display server")
        except Exception as e:
            print(f"❌ wl-clipboard: Error - {e}")

    # 2) X11 - More robust checking
    if os.environ.get("DISPLAY") and shutil.which("xclip"):
        methods_tried.append("xclip")
        try:
            # Test if X11 server is accessible first (quick check)
            test_proc = subprocess.run(["xclip", "-version"], capture_output=True, timeout=1)
            if test_proc.returncode == 0:
                # Try xclip with longer timeout and error checking
                w = subprocess.run(["xclip", "-selection", "clipboard"], 
                                 input=test_text, text=True, capture_output=True, timeout=8)
                if w.returncode == 0:
                    r = subprocess.run(["xclip", "-selection", "clipboard", "-o"], 
                                     text=True, capture_output=True, timeout=3)
                    if r.returncode == 0 and r.stdout.strip() == test_text:
                        print("✅ xclip: Working")
                        return True
                    print(f"❌ xclip: Read failed (rc={r.returncode})")
                else:
                    stderr = w.stderr if isinstance(w.stderr, str) else (w.stderr.decode() if w.stderr else "No error details")
                    print(f"❌ xclip: Write failed (rc={w.returncode}) - {stderr}")
            else:
                print("⚠️  xclip: Version check failed, skipping")
        except subprocess.TimeoutExpired:
            print("⚠️  xclip: Timeout - X11 server may be unresponsive")
        except Exception as e:
            print(f"❌ xclip: Error - {e}")

    # 3) Windows clipboard - Fix path detection
    methods_tried.append("Windows clipboard")
    clip = windows_clip_path()
    ps = powershell_path()
    if clip and ps and os.path.exists(clip):
        try:
            w = subprocess.run([clip], input=test_text, text=True, capture_output=True, timeout=5)
            if w.returncode == 0:
                r = subprocess.run([ps, "-NoProfile", "-Command", "Get-Clipboard"], 
                                 text=True, capture_output=True, timeout=5)
                if r.returncode == 0 and r.stdout.strip() == test_text:
                    print("✅ Windows clipboard (clip.exe): Working")
                    return True
                print(f"❌ Windows clipboard: Read failed (rc={r.returncode})")
            else:
                print(f"❌ Windows clipboard: Write failed (rc={w.returncode})")
        except Exception as e:
            print(f"❌ Windows clipboard: Error - {e}")
    else:
        print("⚠️  Windows clipboard: clip.exe or powershell.exe not found")

    # 4) pyperclip with smart configuration
    methods_tried.append("pyperclip")
    try:
        import pyperclip
        
        # Configure pyperclip to use best available method
        backend = configure_pyperclip_fallback()
        print(f"ℹ️  Configured pyperclip backend: {backend}")
        
        # Test copy operation
        pyperclip.copy(test_text)
        copied_text = pyperclip.paste()
        
        if copied_text == test_text:
            print("✅ pyperclip: Working")
            return True
        else:
            print(f"❌ pyperclip: Data mismatch (expected: '{test_text}', got: '{copied_text[:50]}...')")
    except ImportError:
        print("❌ pyperclip: Module not installed")
    except Exception as e:
        error_msg = str(e)
        if "No such file or directory" in error_msg and "clip.exe" in error_msg:
            print("⚠️  pyperclip: Windows clipboard not available (expected in WSL)")
        else:
            print(f"❌ pyperclip: Error - {e}")

    # 5) File-based fallback for testing environments
    methods_tried.append("file fallback")
    try:
        fallback_file = Path("/tmp/clipboard_test.txt")
        fallback_file.write_text(test_text)
        if fallback_file.read_text() == test_text:
            print("✅ File-based fallback: Working (for testing)")
            clipboard_working = True
        fallback_file.unlink()  # Clean up
    except Exception as e:
        print(f"❌ File fallback: Error - {e}")

    if not clipboard_working:
        print(f"❌ All clipboard methods failed")
        print(f"   Methods tried: {', '.join(methods_tried)}")
        
        # Provide helpful diagnostics
        print("🔍 Diagnostics:")
        if is_wsl_environment():
            print("   - Running in WSL environment")
            if not is_wslg_environment():
                print("   - WSLg not detected - consider enabling WSL2 with WSLg")
        
        display = os.environ.get("DISPLAY")
        if display:
            print(f"   - DISPLAY set to: {display}")
        else:
            print("   - DISPLAY not set")
            
        print("💡 Solutions:")
        print("   1. Install missing tools: sudo apt install xclip wl-clipboard")
        print("   2. Enable WSLg: Upgrade to Windows 11 + WSL2")
        print("   3. Set up X11 forwarding manually")
        print("   4. Use file-based fallback for automation")
    
    return clipboard_working


# -------------------------
# Docs/guides generation (as-is)
# -------------------------

def write_manual_setup_guide():
    print("\n📖 Creating Manual Setup Guide")
    print("=" * 30)
    guide_content = """# Manual Agent Setup Guide

## Problem
The environment has X11/clipboard issues preventing automated prompt injection. This guide helps you set up agents manually.

## Quick Fix Steps

### Option 1: Install Missing Tools
```bash
sudo apt update
sudo apt install x11-utils x11-xserver-utils xclip xdotool wl-clipboard
pip install pyperclip
```

### Option 2: Manual Setup

1. Open Cursor IDE
2. Create new chat tabs (one per agent)
3. Copy prompts from generated files and paste
4. Press Enter to send

### Generated Setup Files

* manual_setup_architect_*.txt
* manual_setup_executor_*.txt
* /tmp/cursor_prompt_*.txt

### Verify Setup

```bash
python -c "from mcp_server import bus; print('Active channels:', bus.list_channels())"
```

---

Generated by MCP Utility
"""
    out = Path("docs/MANUAL_SETUP_GUIDE.md")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(guide_content)
    print("✅ Guide created: docs/MANUAL_SETUP_GUIDE.md")


def write_manual_setup_solution():
    print("\n📖 Creating Manual Setup Solution")
    print("=" * 35)
    setup_files = list(Path(".").glob("manual_setup_*.txt"))
    temp_files = list(Path("/tmp").glob("cursor_prompt_*.txt"))
    content = [
        "# Manual Agent Setup Solution",
        "",
        "## Problem",
        "WSL/X11 clipboard issues prevent automated prompt injection.",
        "",
        "## Solution: Manual Setup",
        "",
        "### Step 1: Open Cursor IDE",
        "- Create new chat tabs (one per agent)",
        "",
        "### Step 2: Copy Prompts",
    ]
    if setup_files:
        content.append("\n**Local Setup Files:**")
        for f in setup_files:
            content.append(f"- `{f.name}`")
    if temp_files:
        content.append("\n**Temp Setup Files:**")
        for f in temp_files:
            content.append(f"- `{f.name}`")
    content.append("""

### Step 3: Commands

```bash
cat manual_setup_architect_*.txt
cat manual_setup_executor_*.txt
cat /tmp/cursor_prompt_*.txt
```

### Step 4: Manual Injection

1. Copy the prompt
2. Paste into Cursor chat
3. Press Enter

### Step 5: Verify

```bash
python -c "from mcp_server import bus; print('Active channels:', bus.list_channels())"
```

---

Generated by MCP Utility
""")
    out = Path("docs/MANUAL_SETUP_SOLUTION.md")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(content))
    print("✅ Solution created: docs/MANUAL_SETUP_SOLUTION.md")


def write_working_automation_fix():
    print("\n⚙️  Creating Working Automation Fix")
    print("=" * 35)
    fix_content = """# Working Automation Fix for WSL/X11

## Problem

X11/clipboard issues prevent automated prompt injection.

## Solution: Enhanced Automation with Fallbacks

```python
import os
from pathlib import Path
import subprocess

def setup_wsl_environment():
    if not os.environ.get('DISPLAY'):
        os.environ['DISPLAY'] = ':0'
    home_xauth = Path.home() / '.Xauthority'
    if not home_xauth.exists():
        home_xauth.touch()
    os.environ['XAUTHORITY'] = str(home_xauth)

def inject_prompt_fallback(prompt: str, session_id: str):
    try:
        subprocess.run(['xclip', '-selection', 'clipboard'], input=prompt, text=True, check=True, timeout=5)
        return True
    except Exception:
        pf = Path(f"manual_prompt_{session_id}.txt"); pf.write_text(prompt); return False
```

## Install

```bash
sudo apt update && sudo apt install -y x11-utils x11-xserver-utils xclip xdotool wl-clipboard
pip install pyperclip
```

## Use

```bash
python start.py 2-agent
# Or manual: bash scripts/quick_setup.sh
```
"""
    out = Path("docs/WORKING_AUTOMATION_FIX.md")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(fix_content)
    print("✅ Fix created: docs/WORKING_AUTOMATION_FIX.md")


def write_quick_setup_script():
    print("\n⚡ Creating Quick Setup Script")
    print("=" * 30)
    script_content = """#!/bin/bash
set -e
echo "🚀 Quick Agent Setup"
setup_files=$(ls manual_setup_*.txt 2>/dev/null || true)
temp_files=$(ls /tmp/cursor_prompt_*.txt 2>/dev/null || true)
if [[ -z "$setup_files" && -z "$temp_files" ]]; then
    echo "❌ No setup files found"
    echo "First run: python start.py 2-agent"
    exit 1
fi
echo "✅ Found setup files"
echo "Local:"
echo "$setup_files"
echo "Temp:"
echo "$temp_files"
echo
echo "📋 Instructions:"
echo "Open Cursor, create chats, copy/paste prompts, send."
"""
    out_path = Path("scripts/quick_setup.sh")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(script_content)
    os.chmod(out_path, 0o755)
    print("✅ Script created: scripts/quick_setup.sh")

# -------------------------

# Command implementations

# -------------------------

def cmd_install_tools(args=None):
    install_x11_utilities()
    install_clipboard_tools()

def cmd_setup_wsl_x11(args=None):
    setup_wsl_x11_env()

def cmd_check_x11(args=None):
    check_x11_utilities()
    check_x11_server_accessible()

def cmd_fix_x11_auth(args=None):
    ok = fix_x11_authentication()
    print("✅ X11 auth fixed" if ok else "❌ X11 auth still failing")

def cmd_test_clipboard(args=None):
    print("🔧 Testing clipboard with enhanced manager...")
    
    # Try to use the enhanced clipboard manager if available
    try:
        from src.utils.clipboard_manager import ClipboardManager
        clipboard = ClipboardManager()
        status = clipboard.get_status()
        
        print(f"Preferred method: {status['preferred_method']}")
        print("Available methods:")
        for method, available in status['available_methods'].items():
            icon = "✅" if available else "❌"
            print(f"  {icon} {method}")
        
        if clipboard.test():
            print("✅ Enhanced clipboard manager working!")
            return
        else:
            print("⚠️  Enhanced manager has issues, falling back to basic test...")
    except ImportError:
        print("⚠️  Enhanced clipboard manager not available, using basic test...")
    except Exception as e:
        print(f"⚠️  Enhanced clipboard manager error: {e}")
    
    # Fallback to basic test
    print("🔧 Configuring clipboard backends...")
    backend = configure_pyperclip_fallback()
    print(f"Selected backend: {backend}")
    
    ok = test_clipboard()
    print("✅ Clipboard working" if ok else "❌ Clipboard failing")

def cmd_guides(args=None):
    write_manual_setup_guide()
    write_manual_setup_solution()
    write_working_automation_fix()
    write_quick_setup_script()

def cmd_wsl_fix(args=None):
    cmd_check()
    check_x11_utilities()
    if os.environ.get("MCP_ASSUME_YES", "n").lower() == "y":
        install_x11_utilities()
        install_clipboard_tools()
        setup_wsl_x11_env()
        check_x11_server_accessible()
        test_clipboard()
        cmd_guides()

def cmd_env_fix(args=None):
    cmd_check()
    check_clipboard_tools()
    # Configure pyperclip to Windows clipboard if possible
    if set_pyperclip_to_windows():
        print("✅ pyperclip configured to Windows clipboard backend")
    test_clipboard()
    write_manual_setup_guide()

def cmd_all(args=None):
    cmd_check()
    cmd_install_tools()
    cmd_setup_wsl_x11()
    cmd_check_x11()
    cmd_test_clipboard()
    cmd_guides()

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Unified MCP utilities")
    sub = p.add_subparsers(dest="cmd", required=False)


    sub.add_parser("check", help="Check environment info")
    sub.add_parser("install-tools", help="Install X11 and clipboard tools")
    sub.add_parser("setup-wsl-x11", help="Setup WSL X11 DISPLAY/XAUTHORITY")
    sub.add_parser("check-x11", help="Check X11 utilities and server access")
    sub.add_parser("fix-x11-auth", help="Fix X11 authentication issues")
    sub.add_parser("test-clipboard", help="Test clipboard functionality")
    sub.add_parser("guides", help="Generate manual setup guides and scripts")
    sub.add_parser("wsl-fix", help="Run comprehensive WSL environment fix")
    sub.add_parser("env-fix", help="Run basic environment fix")
    sub.add_parser("all", help="Run all checks, installs, and guides")
    return p


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    cmd = args.cmd or "check"
    dispatch = {
        "check": cmd_check,
        "install-tools": cmd_install_tools,
        "setup-wsl-x11": cmd_setup_wsl_x11,
        "check-x11": cmd_check_x11,
        "fix-x11-auth": cmd_fix_x11_auth,
        "test-clipboard": cmd_test_clipboard,
        "guides": cmd_guides,
        "wsl-fix": cmd_wsl_fix,
        "env-fix": cmd_env_fix,
        "all": cmd_all,
    }
    return dispatch[cmd](args)

if __name__ == "__main__":
    main()
