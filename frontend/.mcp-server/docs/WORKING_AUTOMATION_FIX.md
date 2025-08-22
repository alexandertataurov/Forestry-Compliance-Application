# Working Automation Fix for WSL/X11

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
