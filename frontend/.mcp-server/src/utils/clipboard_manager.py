#!/usr/bin/env python3
"""
Enhanced Clipboard Manager for WSL/Linux Environments
Provides robust clipboard functionality with multiple fallback methods.
"""

import os
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from typing import Optional, Tuple


class ClipboardManager:
    """Robust clipboard manager with multiple fallback methods."""
    
    def __init__(self):
        self.preferred_method = self._detect_best_method()
        self.fallback_dir = Path(tempfile.gettempdir()) / "cursor_clipboard"
        self.fallback_dir.mkdir(exist_ok=True)
    
    def _detect_best_method(self) -> str:
        """Detect the best available clipboard method."""
        methods = []
        
        # Test Wayland (WSLg)
        if self._is_wslg() and self._test_wayland():
            methods.append("wayland")
        
        # Test X11
        if self._has_display() and self._test_x11():
            methods.append("x11")
        
        # Test Windows clipboard
        if self._test_windows():
            methods.append("windows")
        
        # Always have file fallback
        methods.append("file")
        
        return methods[0] if methods else "file"
    
    def _is_wslg(self) -> bool:
        """Check if running in WSLg environment."""
        return (bool(os.environ.get("WAYLAND_DISPLAY")) or 
                os.path.exists("/mnt/wslg") or 
                os.environ.get("XDG_SESSION_TYPE") == "wayland")
    
    def _has_display(self) -> bool:
        """Check if X11 display is available."""
        return bool(os.environ.get("DISPLAY"))
    
    def _test_wayland(self) -> bool:
        """Test if Wayland clipboard works."""
        if not shutil.which("wl-copy") or not shutil.which("wl-paste"):
            return False
        try:
            # Quick version check
            result = subprocess.run(["wl-copy", "--version"], 
                                  capture_output=True, timeout=1)
            return result.returncode == 0
        except:
            return False
    
    def _test_x11(self) -> bool:
        """Test if X11 clipboard works."""
        if not shutil.which("xclip"):
            return False
        try:
            # Quick version check
            result = subprocess.run(["xclip", "-version"], 
                                  capture_output=True, timeout=1)
            return result.returncode == 0
        except:
            return False
    
    def _test_windows(self) -> bool:
        """Test if Windows clipboard is available."""
        clip_path = self._get_clip_exe()
        ps_path = shutil.which("powershell.exe")
        return clip_path and ps_path and os.path.exists(clip_path)
    
    def _get_clip_exe(self) -> Optional[str]:
        """Get path to clip.exe."""
        candidates = [
            "/mnt/c/Windows/System32/clip.exe",
            "/mnt/c/WINDOWS/System32/clip.exe",
            shutil.which("clip.exe")
        ]
        for candidate in candidates:
            if candidate and os.path.exists(candidate):
                return candidate
        return None
    
    def copy(self, text: str) -> bool:
        """Copy text to clipboard using best available method."""
        methods_to_try = [self.preferred_method]
        if self.preferred_method != "file":
            methods_to_try.append("file")
        
        for method in methods_to_try:
            try:
                if self._copy_with_method(text, method):
                    return True
            except Exception as e:
                print(f"Clipboard copy failed with {method}: {e}")
                continue
        
        return False
    
    def _copy_with_method(self, text: str, method: str) -> bool:
        """Copy text using specific method."""
        if method == "wayland":
            return self._copy_wayland(text)
        elif method == "x11":
            return self._copy_x11(text)
        elif method == "windows":
            return self._copy_windows(text)
        elif method == "file":
            return self._copy_file(text)
        return False
    
    def _copy_wayland(self, text: str) -> bool:
        """Copy using wl-clipboard."""
        result = subprocess.run(["wl-copy"], input=text, text=True, 
                              capture_output=True, timeout=3)
        return result.returncode == 0
    
    def _copy_x11(self, text: str) -> bool:
        """Copy using xclip."""
        result = subprocess.run(["xclip", "-selection", "clipboard"], 
                              input=text, text=True, capture_output=True, timeout=5)
        return result.returncode == 0
    
    def _copy_windows(self, text: str) -> bool:
        """Copy using Windows clipboard."""
        clip_exe = self._get_clip_exe()
        if not clip_exe:
            return False
        
        result = subprocess.run([clip_exe], input=text, text=True,
                              capture_output=True, timeout=3)
        return result.returncode == 0
    
    def _copy_file(self, text: str) -> bool:
        """Copy using file-based fallback."""
        try:
            clipboard_file = self.fallback_dir / f"clipboard_{int(time.time())}.txt"
            clipboard_file.write_text(text)
            
            # Create a 'latest' symlink for easy access
            latest_link = self.fallback_dir / "latest.txt"
            if latest_link.exists():
                latest_link.unlink()
            latest_link.write_text(text)
            
            print(f"📄 Clipboard content saved to: {latest_link}")
            return True
        except Exception:
            return False
    
    def paste(self) -> Tuple[bool, str]:
        """Paste from clipboard, returns (success, content)."""
        methods_to_try = [self.preferred_method]
        if self.preferred_method != "file":
            methods_to_try.append("file")
        
        for method in methods_to_try:
            try:
                success, content = self._paste_with_method(method)
                if success:
                    return True, content
            except Exception as e:
                print(f"Clipboard paste failed with {method}: {e}")
                continue
        
        return False, ""
    
    def _paste_with_method(self, method: str) -> Tuple[bool, str]:
        """Paste using specific method."""
        if method == "wayland":
            return self._paste_wayland()
        elif method == "x11":
            return self._paste_x11()
        elif method == "windows":
            return self._paste_windows()
        elif method == "file":
            return self._paste_file()
        return False, ""
    
    def _paste_wayland(self) -> Tuple[bool, str]:
        """Paste using wl-clipboard."""
        result = subprocess.run(["wl-paste"], text=True, 
                              capture_output=True, timeout=3)
        if result.returncode == 0:
            return True, result.stdout
        return False, ""
    
    def _paste_x11(self) -> Tuple[bool, str]:
        """Paste using xclip."""
        result = subprocess.run(["xclip", "-selection", "clipboard", "-o"], 
                              text=True, capture_output=True, timeout=3)
        if result.returncode == 0:
            return True, result.stdout
        return False, ""
    
    def _paste_windows(self) -> Tuple[bool, str]:
        """Paste using Windows clipboard."""
        ps_path = shutil.which("powershell.exe")
        if not ps_path:
            return False, ""
        
        result = subprocess.run([ps_path, "-NoProfile", "-Command", "Get-Clipboard"],
                              text=True, capture_output=True, timeout=3)
        if result.returncode == 0:
            return True, result.stdout.strip()
        return False, ""
    
    def _paste_file(self) -> Tuple[bool, str]:
        """Paste using file-based fallback."""
        try:
            latest_file = self.fallback_dir / "latest.txt"
            if latest_file.exists():
                content = latest_file.read_text()
                return True, content
        except Exception:
            pass
        return False, ""
    
    def test(self) -> bool:
        """Test clipboard functionality."""
        test_text = f"Clipboard test {int(time.time())}"
        
        print(f"🧪 Testing clipboard with preferred method: {self.preferred_method}")
        
        # Test copy
        if not self.copy(test_text):
            print("❌ Copy failed")
            return False
        
        print("✅ Copy successful")
        
        # Test paste
        success, pasted_text = self.paste()
        if not success:
            print("❌ Paste failed")
            return False
        
        if pasted_text.strip() == test_text:
            print("✅ Paste successful - content matches")
            return True
        else:
            print(f"❌ Paste content mismatch")
            print(f"   Expected: {test_text}")
            print(f"   Got: {pasted_text.strip()}")
            return False
    
    def get_status(self) -> dict:
        """Get clipboard manager status."""
        return {
            "preferred_method": self.preferred_method,
            "available_methods": {
                "wayland": self._test_wayland(),
                "x11": self._test_x11(),
                "windows": self._test_windows(),
                "file": True  # Always available
            },
            "fallback_dir": str(self.fallback_dir),
            "environment": {
                "wslg": self._is_wslg(),
                "display": os.environ.get("DISPLAY", "Not set"),
                "wayland_display": os.environ.get("WAYLAND_DISPLAY", "Not set")
            }
        }


def main():
    """Test the clipboard manager."""
    print("🗃️  Enhanced Clipboard Manager Test")
    print("=" * 40)
    
    clipboard = ClipboardManager()
    
    # Show status
    status = clipboard.get_status()
    print(f"Preferred method: {status['preferred_method']}")
    print(f"Available methods:")
    for method, available in status['available_methods'].items():
        icon = "✅" if available else "❌"
        print(f"  {icon} {method}")
    
    print(f"\nEnvironment:")
    for key, value in status['environment'].items():
        print(f"  {key}: {value}")
    
    print(f"\nFallback directory: {status['fallback_dir']}")
    
    # Run test
    print(f"\n" + "=" * 40)
    if clipboard.test():
        print("🎉 Clipboard manager working correctly!")
    else:
        print("⚠️  Clipboard manager has issues but file fallback should work")
    
    return clipboard


if __name__ == "__main__":
    main()