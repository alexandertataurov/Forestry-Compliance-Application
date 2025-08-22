#!/usr/bin/env python3
"""
Simple utility to show clipboard content from file-based fallback.
Useful when GUI clipboard is not working.
"""

import sys
from pathlib import Path


def show_clipboard():
    """Show the current clipboard content from file fallback."""
    clipboard_dir = Path("/tmp/cursor_clipboard")
    latest_file = clipboard_dir / "latest.txt"
    
    if not latest_file.exists():
        print("❌ No clipboard content found")
        print(f"   Looking for: {latest_file}")
        print("   Make sure to copy something first using the clipboard manager")
        return False
    
    try:
        content = latest_file.read_text()
        print("📋 Current Clipboard Content:")
        print("-" * 40)
        print(content)
        print("-" * 40)
        print(f"📁 Source: {latest_file}")
        return True
    except Exception as e:
        print(f"❌ Error reading clipboard: {e}")
        return False


def list_clipboard_files():
    """List all clipboard files in the fallback directory."""
    clipboard_dir = Path("/tmp/cursor_clipboard")
    
    if not clipboard_dir.exists():
        print("❌ Clipboard directory not found")
        return
    
    files = list(clipboard_dir.glob("*.txt"))
    if not files:
        print("❌ No clipboard files found")
        return
    
    print(f"📁 Clipboard Files ({len(files)} found):")
    for file in sorted(files, key=lambda f: f.stat().st_mtime, reverse=True):
        mtime = file.stat().st_mtime
        import time
        time_str = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(mtime))
        size = file.stat().st_size
        print(f"  📄 {file.name} ({size} bytes) - {time_str}")


def main():
    """Main entry point."""
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        list_clipboard_files()
    else:
        show_clipboard()


if __name__ == "__main__":
    main()