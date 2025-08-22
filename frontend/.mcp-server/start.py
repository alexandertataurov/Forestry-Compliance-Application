#!/usr/bin/env python3
"""
Cursor Automation - One Command Starter
Usage: python start.py [workflow] [options]

Workflows:
  2-agent    - Architect + Executor (default)
  3-agent    - Architect + Executor + Reviewer  
  4-agent    - Architect + Executor + Reviewer + GitHub PR
  6-agent    - 4-agent + Security + Performance specialists
  custom     - Load custom workflow configuration

Examples:
  python start.py                    # 2-agent workflow
  python start.py 3-agent           # 3-agent with reviewer
  python start.py 4-agent --repo    # 4-agent with GitHub integration
  python start.py custom config.yml # Custom workflow
"""

import argparse
import json
import os
import sys
import threading
import time
from pathlib import Path
from typing import Dict, List, Optional

# Import our modules (avoid hard dependency on mcp for dry-run)
try:
    from src.automation.cursor_automation_enhanced import EnhancedCursorAutomation, AutomationConfig
    from src.core.workflow_manager import EnhancedWorkflowManager
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're in the .mcp-server directory")
    sys.exit(1)


class WorkflowConfig:
    """Configuration for different agent workflows."""
    
    @staticmethod
    def get_2_agent_config() -> Dict:
        """2-Agent: Architect + Executor workflow."""
        return {
            "name": "2-Agent Workflow",
            "description": "Architect plans tasks, Executor implements them",
            "channels": ["a2e", "e2a", "status"],
            "agents": {
                "architect": {
                    "role": "architect",
                    "channels": ["a2e", "e2a", "status"],
                    "prompt": """ROLE: Architect Agent - Strategic task planning and coordination

SETUP:
- Register: register_agent(name="architect", channels=["a2e", "e2a", "status"])
- Primary channel: post to "a2e", pull from "e2a"
- Status updates: post to "status" channel

WORKFLOW:
1. Break down user requests into specific micro-tasks
2. Post task envelopes to "a2e" channel  
3. Monitor "e2a" for executor responses
4. Review results and plan next steps
5. Mark completion with status update

ENVELOPE FORMAT:
{
  "from": "architect",
  "task_id": "TASK-001",
  "intent": "plan|review|question|finalize",
  "micro_task": "specific actionable step",
  "acceptance_criteria": "measurable success criteria",
  "priority": "high|medium|low",
  "estimated_time": "time estimate"
}

GUIDELINES:
- Keep tasks small and focused (15-30 min each)
- Provide clear acceptance criteria
- End messages with [[END-OF-TURN]]
- Post status updates for major milestones"""
                },
                "executor": {
                    "role": "executor", 
                    "channels": ["a2e", "e2a", "status"],
                    "prompt": """ROLE: Executor Agent - Safe task implementation and reporting

SETUP:
- Register: register_agent(name="executor", channels=["a2e", "e2a", "status"])
- Primary channel: pull from "a2e", post to "e2a" 
- Status updates: post to "status" channel

WORKFLOW:
1. Pull tasks from "a2e" channel
2. Implement micro-tasks safely with verification
3. Run tests and validation where applicable
4. Post detailed results to "e2a" channel
5. Update status on completion

RESPONSE FORMAT:
{
  "from": "executor",
  "task_id": "TASK-001", 
  "status": "success|partial|failed",
  "summary": "what was accomplished",
  "changes_made": "files modified/created",
  "commands_run": ["cmd1", "cmd2"],
  "test_results": {"passed": 0, "failed": 0},
  "next_suggestion": "recommended next step",
  "blockers": "any blocking issues",
  "done": true/false
}

SAFETY RULES:
- Always backup before major changes
- Run tests after code modifications  
- Never commit secrets or sensitive data
- End messages with [[END-OF-TURN]]"""
                }
            }
        }
    
    @staticmethod
    def get_3_agent_config() -> Dict:
        """3-Agent: Architect + Executor + Reviewer workflow."""
        config_2 = WorkflowConfig.get_2_agent_config()
        config_2.update({
            "name": "3-Agent Workflow",
            "description": "Architect plans, Executor implements, Reviewer validates",
            "channels": ["a2e", "e2a", "e2r", "r2a", "status"],
        })
        
        config_2["agents"]["architect"]["channels"] = ["a2e", "e2a", "r2a", "status"]
        config_2["agents"]["executor"]["channels"] = ["a2e", "e2a", "e2r", "status"]
        
        config_2["agents"]["reviewer"] = {
            "role": "reviewer",
            "channels": ["e2r", "r2a", "status"], 
            "prompt": """ROLE: Reviewer Agent - Quality assurance and validation

SETUP:
- Register: register_agent(name="reviewer", channels=["e2r", "r2a", "status"])
- Primary channel: pull from "e2r", post to "r2a"
- Status updates: post to "status" channel

WORKFLOW:
1. Pull completed work from "e2r" channel
2. Review code quality, tests, and documentation
3. Verify acceptance criteria are met
4. Check for security issues and best practices
5. Post review results to "r2a" channel

REVIEW CRITERIA:
- Code quality and readability
- Test coverage and passing tests
- Security best practices
- Performance considerations
- Documentation completeness
- Acceptance criteria fulfillment

REVIEW FORMAT:
{
  "from": "reviewer",
  "task_id": "TASK-001",
  "review_status": "approved|rejected|needs_revision",
  "code_quality": {"score": 8, "issues": []},
  "test_coverage": {"percentage": 85, "missing": []},
  "security_issues": [],
  "performance_notes": [],
  "documentation": "complete|incomplete",
  "recommendations": ["improvement suggestions"],
  "approved": true/false
}

GUIDELINES:
- Be thorough but constructive
- Focus on critical issues first
- Provide specific improvement suggestions
- End messages with [[END-OF-TURN]]"""
        }
        
        return config_2
    
    @staticmethod
    def get_4_agent_config() -> Dict:
        """4-Agent: Architect + Executor + Reviewer + GitHub PR workflow."""
        config_3 = WorkflowConfig.get_3_agent_config()
        config_3.update({
            "name": "4-Agent Workflow", 
            "description": "Full development lifecycle with GitHub integration",
            "channels": ["a2e", "e2a", "e2r", "r2a", "r2g", "g2a", "status"],
        })
        
        config_3["agents"]["architect"]["channels"] = ["a2e", "e2a", "r2a", "g2a", "status"]
        config_3["agents"]["reviewer"]["channels"] = ["e2r", "r2a", "r2g", "status"]
        
        config_3["agents"]["github"] = {
            "role": "github",
            "channels": ["r2g", "g2a", "status"],
            "prompt": """ROLE: GitHub Agent - Repository management and PR creation

SETUP:
- Register: register_agent(name="github", channels=["r2g", "g2a", "status"])
- Primary channel: pull from "r2g", post to "g2a"
- Status updates: post to "status" channel

WORKFLOW:
1. Pull approved changes from "r2g" channel
2. Create feature branches for changes
3. Commit changes with proper messages
4. Create pull requests with descriptions
5. Monitor PR status and handle feedback

RESPONSIBILITIES:
- Git branch management
- Commit message formatting
- PR creation and management
- CI/CD pipeline monitoring
- Merge conflict resolution

COMMIT FORMAT:
{
  "from": "github",
  "task_id": "TASK-001",
  "action": "commit|pr|merge|status",
  "branch": "feature/task-001-description",
  "commit_message": "feat: add new functionality\\n\\nDetailed description",
  "pr_url": "https://github.com/user/repo/pull/123",
  "ci_status": "pending|success|failed",
  "merge_ready": true/false
}

GIT BEST PRACTICES:
- Conventional commit messages
- Atomic commits per logical change
- Descriptive PR titles and descriptions
- Proper branch naming conventions
- End messages with [[END-OF-TURN]]"""
        }
        
        return config_3


class CursorWorkflowLauncher:
    """Main launcher for different workflow configurations."""
    
    def __init__(self):
        self.automation = None
        self.bus = None
        self.sessions = {}
        
    def start_workflow(self, workflow_type: str, options: Dict):
        """Start the specified workflow."""
        
        print(f"🚀 Starting {workflow_type.upper()} Cursor Automation Workflow")
        print("=" * 60)
        
        # Get workflow configuration
        config = self._get_workflow_config(workflow_type)
        if not config:
            print(f"❌ Unknown workflow type: {workflow_type}")
            return False
            
        print(f"📋 Workflow: {config['name']}")
        print(f"📖 Description: {config['description']}")
        print(f"👥 Agents: {', '.join(config['agents'].keys())}")
        print(f"📡 Channels: {', '.join(config['channels'])}")
        
        # Setup automation system
        automation_config = AutomationConfig(
            max_iterations=options.get('max_iterations', 50),
            loop_detection_threshold=options.get('loop_threshold', 3),
            inactivity_timeout=options.get('timeout', 600),  # 10 minutes
            cursor_workspace=options.get('workspace', os.getcwd()),
            enable_gui_automation=options.get('gui', True),
            log_level=options.get('log_level', 'INFO')
        )
        
        self.automation = EnhancedCursorAutomation(automation_config)
        # Lazy-import MCP bus to avoid hard dependency when unavailable
        try:
            from src.core.mcp_server import SimpleMessageBus  # type: ignore
            # Use project-root relative DB path via SimpleMessageBus resolver
            self.bus = SimpleMessageBus("data/db/workflow_messages.db")
            self.automation.connect_to_mcp(self.bus)
        except Exception as e:
            print(f'⚠️  MCP bus unavailable ({e}); continuing without MCP integration')
            self.bus = None

        
        print(f"✅ Automation system initialized")
        print(f"📁 Workspace: {automation_config.cursor_workspace}")
        print(f"⚙️  Configuration: {automation_config.max_iterations} iterations, {automation_config.inactivity_timeout}s timeout")
        
        # Create and launch agent sessions
        print(f"\n👥 Creating agent sessions...")
        for agent_name, agent_config in config['agents'].items():
            session_id = self.automation.create_chat_session(
                agent_config['role'], 
                agent_config['prompt']
            )
            self.sessions[agent_name] = session_id
            print(f"  ✅ {agent_name}: {session_id}")
        
        # Launch Cursor instances
        print(f"\n🔄 Launching Cursor instances...")
        for agent_name, session_id in self.sessions.items():
            print(f"  → Launching {agent_name}...")
            success = self.automation.launch_cursor_with_prompt(session_id)
            status = "✅ Success" if success else "⚠️  Manual setup required"
            print(f"    {status}")
            time.sleep(2)  # Stagger launches
        
        # Start monitoring
        print(f"\n👁️  Starting workflow monitoring...")
        monitor_thread = threading.Thread(target=self.automation.monitor_sessions)
        monitor_thread.daemon = True
        monitor_thread.start()
        
        # Show startup instructions
        self._show_startup_instructions(config, options)
        
        # Enter monitoring loop
        try:
            self._run_monitoring_loop(config)
        except KeyboardInterrupt:
            print(f"\n🛑 Shutting down workflow...")
            self.automation.stop_monitoring()
            print("✅ Workflow stopped cleanly")
            
        return True
    
    def _get_workflow_config(self, workflow_type: str) -> Optional[Dict]:
        """Get configuration for specified workflow type using enhanced workflow manager."""
        try:
            # Initialize enhanced workflow manager with project context
            workflow_manager = EnhancedWorkflowManager()
            
            # Show project context summary
            print(f"\n📋 Project Context Loaded:")
            print(workflow_manager.get_project_summary())
            
            # Get workflow configuration with enhanced prompts
            config = workflow_manager.get_workflow_config(workflow_type, use_enhanced_prompts=True)
            
            # Validate configuration
            validation = workflow_manager.validate_workflow_config(config)
            passed_checks = sum(validation.values())
            total_checks = len(validation)
            
            print(f"\n🔍 Workflow Validation: {passed_checks}/{total_checks} checks passed")
            if passed_checks < total_checks:
                print("⚠️  Some validation checks failed - workflow may use fallback prompts")
                for check, status in validation.items():
                    if not status:
                        print(f"  ❌ {check}")
            
            return config
            
        except Exception as e:
            print(f"⚠️  Error loading enhanced workflow: {e}")
            print("🔄 Falling back to basic workflow configuration...")
            
            # Fallback to basic configuration
            workflows = {
                '2-agent': WorkflowConfig.get_2_agent_config,
                '3-agent': WorkflowConfig.get_3_agent_config, 
                '4-agent': WorkflowConfig.get_4_agent_config
            }
            
            if workflow_type in workflows:
                return workflows[workflow_type]()
            elif workflow_type == '6-agent':
                # Build a minimal 6-agent config by extending 4-agent
                base = WorkflowConfig.get_4_agent_config()
                base.update({
                    'name': '6-Agent Workflow',
                    'description': '4-agent workflow plus security and performance specialists',
                    'channels': [
                        'a2e', 'e2a', 'e2r', 'r2a', 'r2g', 'g2a',
                        'r2s', 's2a', 'r2p', 'p2a', 'status'
                    ]
                })
                # Update reviewer and architect channels to include specialists
                base['agents']['architect']['channels'] = ['a2e', 'e2a', 'r2a', 'g2a', 's2a', 'p2a', 'status']
                base['agents']['reviewer']['channels'] = ['e2r', 'r2a', 'r2g', 'r2s', 'r2p', 'status']
                # Add simple prompts for specialists
                base['agents']['security'] = {
                    'role': 'security',
                    'channels': ['r2s', 's2a', 'status'],
                    'prompt': """ROLE: Security Specialist - Vulnerability assessment\n\nSETUP:\n- Register: register_agent(name=\"security\", channels=[\"r2s\", \"s2a\", \"status\"])\n\nFocus on OWASP Top 10, input validation, authentication, and authorization.\n\nAlways end messages with [[END-OF-TURN]]"""
                }
                base['agents']['performance'] = {
                    'role': 'performance',
                    'channels': ['r2p', 'p2a', 'status'],
                    'prompt': """ROLE: Performance Optimizer - Performance analysis\n\nSETUP:\n- Register: register_agent(name=\"performance\", channels=[\"r2p\", \"p2a\", \"status\"])\n\nFocus on database optimization, caching, and scalability.\n\nAlways end messages with [[END-OF-TURN]]"""
                }
                return base
            elif workflow_type == 'custom':
                return WorkflowConfig.get_2_agent_config()
            else:
                return None
    
    def _show_startup_instructions(self, config: Dict, options: Dict):
        """Show instructions for getting started."""
        print(f"\n💡 Getting Started:")
        print(f"  1. Cursor instances should be launching automatically")
        
        agent_list = list(config['agents'].keys())
        if len(agent_list) >= 2:
            print(f"  2. In {agent_list[0]} chat: Start with your request/task")
            print(f"  3. {agent_list[0].capitalize()} will plan and coordinate")
            
            if len(agent_list) >= 3:
                print(f"  4. {agent_list[2].capitalize()} will validate completed work")
            if len(agent_list) >= 4:
                print(f"  5. {agent_list[3].capitalize()} will handle Git operations")
        
        print(f"\n📊 Monitor workflow progress below:")
        print(f"-" * 50)
    
    def _run_monitoring_loop(self, config: Dict):
        """Run the main monitoring and status loop."""
        cycle = 0
        
        while True:
            time.sleep(15)  # Update every 15 seconds
            cycle += 1
            
            # Get current status
            status = self.automation.get_detailed_status()
            active_sessions = [s for s in status['sessions'].values() if s['status'] == 'running']
            
            # Show periodic status updates
            timestamp = time.strftime('%H:%M:%S')
            print(f"\n[{timestamp}] Workflow Status (cycle {cycle}):")
            
            if not active_sessions:
                print("  🎉 All agents completed or stopped")
                break
                
            for agent_name, session_id in self.sessions.items():
                if session_id in status['sessions']:
                    s = status['sessions'][session_id]
                    status_icon = {
                        'running': '🔄',
                        'completed': '✅', 
                        'failed': '❌',
                        'looped': '🔄',
                        'timeout': '⏰',
                        'interrupted': '🛑'
                    }.get(s['status'], '❓')
                    
                    print(f"  {status_icon} {agent_name:12}: {s['status']:12} "
                          f"({s['runtime']:6.1f}s, {s['message_count']:2} msgs)")
                          
                    if s['error_count'] > 0:
                        print(f"    ⚠️  Errors: {s['error_count']}")
                    if s['loop_detected']:
                        print(f"    🔄 Loop intervention applied")
            
            # Show recent MCP activity
            try:
                channels = self.bus.list_channels()
                if channels:
                    print(f"  📡 Active channels: {len(channels)}")
                    for channel in channels[-3:]:  # Show last 3 channels
                        recent = self.bus.pull(channel, since=max(0, cycle-2), limit=1)
                        if recent['items']:
                            print(f"    📨 {channel}: {len(recent['items'])} recent")
            except Exception as e:
                pass  # Ignore MCP errors in monitoring
                
            # Show completion status for different workflow types
            if config['name'] == '4-Agent Workflow' and cycle % 4 == 0:  # Every minute
                print(f"  🔍 Checking for GitHub activity...")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Cursor Automation Workflow Launcher',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python start.py                           # Default 2-agent workflow
  python start.py 3-agent                  # Add reviewer agent
  python start.py 4-agent --repo           # Full GitHub integration
  python start.py 2-agent --timeout 300    # Custom 5-minute timeout
  python start.py 3-agent --no-gui         # Disable GUI automation
        """
    )
    
    parser.add_argument(
        'workflow', 
        nargs='?', 
        default='2-agent',
        choices=['2-agent', '3-agent', '4-agent', '6-agent', 'custom'],
        help='Workflow type (default: 2-agent)'
    )
    
    parser.add_argument('--workspace', '-w', 
                       default=os.getcwd(),
                       help='Cursor workspace path')
    
    parser.add_argument('--timeout', '-t', 
                       type=int, default=1800,
                       help='Session timeout in seconds (default: 1800)')
    
    parser.add_argument('--max-iterations', '-i',
                       type=int, default=100, 
                       help='Maximum iterations per session (default: 100)')
    
    parser.add_argument('--loop-threshold', '-l',
                       type=int, default=5,
                       help='Loop detection threshold (default: 5)')
    
    parser.add_argument('--no-gui', action='store_true',
                       help='Disable GUI automation')
    
    parser.add_argument('--log-level', 
                       choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                       default='INFO',
                       help='Logging level (default: INFO)')
    
    parser.add_argument('--repo', action='store_true',
                       help='Enable GitHub repository features')
    
    parser.add_argument('--dry-run', action='store_true',
                       help='Test configuration without launching')
    
    args = parser.parse_args()
    
    # Build options
    options = {
        'workspace': args.workspace,
        'timeout': args.timeout,
        'max_iterations': args.max_iterations,
        'loop_threshold': args.loop_threshold,
        'gui': not args.no_gui,
        'log_level': args.log_level,
        'repo': args.repo,
        'dry_run': args.dry_run
    }
    
    if args.dry_run:
        print("🧪 DRY RUN - Configuration Test")
        try:
            workflow_manager = EnhancedWorkflowManager()
            config = workflow_manager.get_workflow_config(args.workflow, use_enhanced_prompts=True)
            
            print(f"✅ Workflow: {config['name']}")
            print(f"✅ Agents: {list(config['agents'].keys())}")
            print(f"✅ Channels: {config['channels']}")
            print(f"✅ Enhanced Prompts: {'Yes' if config['agents']['architect'].get('enhanced', False) else 'No'}")
            print(f"✅ Project Context: {'Yes' if 'project_context' in config else 'No'}")
            print(f"✅ Options: {options}")
            
            # Show validation results
            validation = workflow_manager.validate_workflow_config(config)
            passed = sum(validation.values())
            total = len(validation)
            print(f"✅ Validation: {passed}/{total} checks passed")
            
        except Exception as e:
            print(f"❌ Enhanced configuration error: {e}")
            print("🔄 Falling back to basic configuration...")
            config = WorkflowConfig.get_2_agent_config() if args.workflow == '2-agent' else \
                     WorkflowConfig.get_3_agent_config() if args.workflow == '3-agent' else \
                     WorkflowConfig.get_4_agent_config()
            
            print(f"✅ Workflow: {config['name']} (basic)")
            print(f"✅ Agents: {list(config['agents'].keys())}")
            print(f"✅ Channels: {config['channels']}")
        
        return
    
    # Check dependencies
    if not _check_dependencies():
        return
    
    # Start workflow
    launcher = CursorWorkflowLauncher()
    launcher.start_workflow(args.workflow, options)


def _check_dependencies():
    """Check required dependencies."""
    try:
        import sqlite3
        print("✅ SQLite available")
    except ImportError:
        print("❌ SQLite not available")
        return False
    
    # Check MCP server files
    required_files = ['src/core/mcp_server.py', 'src/automation/cursor_automation_enhanced.py']
    for file in required_files:
        if not Path(file).exists():
            print(f"❌ Required file missing: {file}")
            return False
    
    print("✅ All dependencies available")
    return True


if __name__ == "__main__":
    main()
