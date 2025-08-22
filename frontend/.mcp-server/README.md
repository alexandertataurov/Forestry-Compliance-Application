# One-Command Cursor Automation

Start multi-agent workflows with a single command. Choose from pre-configured setups or create custom workflows.

## 🚀 Quick Start

```bash
# Default 2-agent workflow (architect + executor)
python start.py

# 3-agent workflow (+ reviewer)
python start.py 3-agent

# Full 4-agent workflow (+ GitHub PR automation)  
python start.py 4-agent

# Enterprise 6-agent workflow (+ Security + Performance)
python start.py 6-agent

# Custom timeout and workspace
python start.py 3-agent --workspace /path/to/project --timeout 900
```

## 📋 Available Workflows

### 2-Agent Workflow (Default)
- **Architect**: Plans and breaks down tasks into micro-tasks
- **Executor**: Implements tasks safely with testing and validation
- **Channels**: `a2e` (architect→executor), `e2a` (executor→architect)
- **Use case**: Basic development tasks, feature implementation

### 3-Agent Workflow  
- **Architect**: Strategic planning and coordination
- **Executor**: Safe implementation with testing
- **Reviewer**: Code quality assurance and validation
- **Channels**: `a2e`, `e2a`, `e2r`, `r2a`, `status`
- **Use case**: Quality-focused development with peer review

### 4-Agent Workflow
- **Architect**: Task planning and coordination
- **Executor**: Implementation and testing
- **Reviewer**: Quality assurance and approval
- **GitHub**: Branch management, commits, PR creation
- **Channels**: `a2e`, `e2a`, `e2r`, `r2a`, `r2g`, `g2a`, `status`
- **Use case**: Full development lifecycle with Git integration

### 6-Agent Workflow
- Adds two specialists to the 4-agent setup
- **Security**: Vulnerability assessment, authn/authz, OWASP focus
- **Performance**: Profiling, caching, scalability improvements
- **Channels**: adds `r2s/s2a` and `r2p/p2a` for reviewer↔specialists
- **Use case**: Enterprise-grade quality gates for security and performance

## ⚙️ Configuration Options

```bash
# Workspace and timing
--workspace /path/to/project     # Set project workspace (default: current dir)
--timeout 1800                   # Session timeout in seconds (default: 1800)
--max-iterations 100             # Max iterations per session (default: 100)
--loop-threshold 5               # Loop detection sensitivity (default: 5)

# Automation control
--no-gui                         # Disable GUI automation (headless mode)
--log-level DEBUG                # Logging level: DEBUG, INFO, WARNING, ERROR

# GitHub integration (4-agent workflow)
--repo                           # Enable GitHub features

# Testing
--dry-run                        # Test configuration without launching
```

## 📁 Project Structure

```
.mcp-server/
├── start.py                     # 🚀 One-command launcher
├── config.yml                   # ⚙️  Workflow configurations  
├── mcp_server.py                # 📡 Message bus coordination
├── cursor_automation_enhanced.py # 🤖 Automation engine
├── logs/                        # 📝 Detailed logging output
└── README_START.md              # 📖 This guide
```

## 💡 Usage Examples

### Basic Development Task
```bash
# Start 2-agent workflow for simple feature development
python start.py

# In architect chat: "Create a user authentication module with login/logout"
# Architect will plan, executor will implement, both coordinate automatically
```

### Quality-Focused Development
```bash  
# Start 3-agent workflow with code review
python start.py 3-agent --timeout 900

# In architect chat: "Refactor the payment processing system for better error handling"
# Full workflow: plan → implement → review → iterate until approved
```

### Full Development Lifecycle
```bash
# Start 4-agent workflow with GitHub integration
python start.py 4-agent --repo --workspace /path/to/repo

# In architect chat: "Add API rate limiting with Redis backend" 
# Complete flow: plan → implement → review → GitHub PR creation
```

### Headless/CI Mode
```bash
# For CI/CD or headless environments
python start.py 3-agent --no-gui --log-level DEBUG

# Agents use file-based communication, detailed logging available
```

## 🔍 Monitoring & Status

The launcher provides real-time monitoring:

```
[14:23:45] Workflow Status (cycle 12):
  🔄 architect     : running      ( 125.3s,  8 msgs)
  ✅ executor      : completed    ( 98.7s,  12 msgs) 
  🔄 reviewer      : running      ( 45.2s,  3 msgs)
  📡 Active channels: 5
    📨 e2r: 1 recent
    📨 status: 2 recent
```

**Status Icons:**
- 🔄 `running` - Agent actively working
- ✅ `completed` - Task finished successfully  
- ❌ `failed` - Error occurred
- ⏰ `timeout` - Inactive too long
- 🛑 `interrupted` - Manually stopped

## 📊 Advanced Features

### Loop Detection & Intervention
Automatically detects when agents get stuck in conversation loops and intervenes with context-aware prompts to break the cycle.

### Session Persistence  
All sessions are saved with detailed summaries:
```json
{
  "session_id": "architect_1755853038",
  "status": "completed", 
  "runtime_seconds": 342.1,
  "message_count": 15,
  "error_count": 0
}
```

### Comprehensive Logging
Specialized logs for different components:
- `cursor_automation.log` - Main system events
- `automation.log` - Cursor launch and GUI events  
- `clipboard.log` - Prompt injection attempts
- `sessions.log` - Session lifecycle tracking
- `mcp.log` - Message bus coordination

### Environment Detection
Automatically adapts to:
- WSL environments with special handling
- Headless systems with file-based fallbacks
- GUI availability and clipboard tool selection

## 🛠️ Troubleshooting

### Common Issues

**Cursor not found:**
```bash
# Install Cursor IDE from https://cursor.com
# Or specify full path in config.yml
```

**GUI automation fails:**
```bash
# Install dependencies
sudo apt install xdotool xclip    # Linux
pip install pyautogui pyperclip   # GUI libraries

# Or use headless mode
python start.py --no-gui
```

**Sessions timeout quickly:**
```bash
# Increase timeout for complex tasks
python start.py 3-agent --timeout 1800  # 30 minutes
```

**Loop detection too sensitive:**
```bash
# Adjust threshold
python start.py --loop-threshold 5  # Allow more repetition
```

### Log Analysis
Check `logs/` directory for detailed debugging:
```bash
# Recent errors
grep ERROR logs/*.log

# Session activity  
tail -f logs/sessions.log

# Clipboard issues
cat logs/clipboard.log
```

## 🎯 Best Practices

1. **Start Small**: Begin with 2-agent workflow, add agents as needed
2. **Set Appropriate Timeouts**: Simple tasks (5min), complex tasks (30min+)
3. **Monitor Actively**: Watch for loops, timeouts, and error patterns
4. **Use Dry Run**: Test configurations before full deployment
5. **Check Logs**: Review logs for optimization opportunities

## 🔧 Customization

Edit `config.yml` for:
- Default timeouts and thresholds
- Custom agent configurations  
- Environment-specific settings
- Integration configurations (GitHub, Slack, Jira)

The system is designed to be **flexible, monitorable, and production-ready** for any development workflow!

## 🧰 MCP Utilities CLI

Use the unified helper CLI for environment checks and fixes:

```bash
# Show available commands
python mcp_util.py -h

# Common tasks
python mcp_util.py check            # Env summary
python mcp_util.py install-tools    # Install X11/clipboard tools
python mcp_util.py setup-wsl-x11    # Configure DISPLAY/XAUTHORITY
python mcp_util.py fix-x11-auth     # Fix X11 auth issues
python mcp_util.py test-clipboard   # Validate clipboard
python mcp_util.py guides           # Generate setup guides/scripts
```

Note: Legacy fix_* scripts were removed; use `mcp_util.py` instead. The quick manual setup script is now at `scripts/quick_setup.sh`.
