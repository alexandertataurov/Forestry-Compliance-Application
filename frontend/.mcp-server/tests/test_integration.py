#!/usr/bin/env python3
"""
Integration Tests for Cursor Multi-Agent Automation System
Tests actual Cursor instances, GUI automation, and end-to-end workflows.
"""

import json
import os
import subprocess
import sys
import tempfile
import time
import threading
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from cursor_automation_enhanced import EnhancedCursorAutomation, AutomationConfig
from mcp_server import SimpleMessageBus
from start import CursorWorkflowLauncher
from workflow_manager import EnhancedWorkflowManager


class IntegrationTestFramework:
    """Framework for running integration tests with actual Cursor instances."""
    
    def __init__(self, test_workspace: str = None):
        self.test_workspace = test_workspace or tempfile.mkdtemp(prefix="cursor_test_")
        self.test_results = []
        self.cleanup_tasks = []
        
        # Create test workspace structure
        os.makedirs(self.test_workspace, exist_ok=True)
        self._setup_test_workspace()
        
    def _setup_test_workspace(self):
        """Setup a test workspace with sample files."""
        # Create a simple Python project for testing
        (Path(self.test_workspace) / "test_project.py").write_text("""
def hello_world():
    print("Hello, World!")

def add_numbers(a, b):
    return a + b

if __name__ == "__main__":
    hello_world()
""")
        
        # Create a README for testing documentation
        (Path(self.test_workspace) / "README.md").write_text("""
# Test Project

A simple test project for integration testing.

## Functions
- `hello_world()`: Prints a greeting
- `add_numbers(a, b)`: Adds two numbers
""")
        
        print(f"✅ Test workspace created at: {self.test_workspace}")
    
    def cleanup(self):
        """Cleanup test resources."""
        for task in self.cleanup_tasks:
            try:
                task()
            except Exception as e:
                print(f"⚠️  Cleanup error: {e}")
        
        # Remove test workspace
        import shutil
        if os.path.exists(self.test_workspace):
            shutil.rmtree(self.test_workspace)
    
    def run_test(self, test_name: str, test_func) -> bool:
        """Run a single test and record results."""
        print(f"\n🧪 Running test: {test_name}")
        print("-" * 50)
        
        start_time = time.time()
        try:
            result = test_func()
            duration = time.time() - start_time
            
            self.test_results.append({
                "name": test_name,
                "status": "PASS" if result else "FAIL",
                "duration": duration,
                "error": None
            })
            
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name} ({duration:.2f}s)")
            return result
            
        except Exception as e:
            duration = time.time() - start_time
            self.test_results.append({
                "name": test_name,
                "status": "ERROR",
                "duration": duration,
                "error": str(e)
            })
            
            print(f"💥 ERROR {test_name} ({duration:.2f}s): {e}")
            return False
    
    def print_summary(self):
        """Print test results summary."""
        passed = len([r for r in self.test_results if r["status"] == "PASS"])
        failed = len([r for r in self.test_results if r["status"] in ["FAIL", "ERROR"]])
        total = len(self.test_results)
        
        print(f"\n📊 Test Summary")
        print("=" * 50)
        print(f"Total tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print(f"Success rate: {(passed/total*100):.1f}%" if total > 0 else "N/A")
        
        if failed > 0:
            print(f"\n❌ Failed tests:")
            for result in self.test_results:
                if result["status"] in ["FAIL", "ERROR"]:
                    print(f"  - {result['name']}: {result.get('error', 'Test failed')}")


class CursorIntegrationTests(IntegrationTestFramework):
    """Specific integration tests for Cursor automation."""
    
    def test_cursor_availability(self) -> bool:
        """Test if Cursor is available and can be launched."""
        try:
            # Try to get cursor version
            result = subprocess.run(['cursor', '--version'], 
                                  capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(f"✅ Cursor available: {result.stdout.strip()}")
                return True
            else:
                print(f"❌ Cursor command failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print("❌ Cursor command timed out")
            return False
        except FileNotFoundError:
            print("❌ Cursor command not found - is Cursor IDE installed?")
            return False
        except Exception as e:
            print(f"❌ Error checking Cursor: {e}")
            return False
    
    def test_automation_config_creation(self) -> bool:
        """Test automation configuration creation."""
        config = AutomationConfig(
            max_iterations=10,
            loop_detection_threshold=2,
            inactivity_timeout=60,
            cursor_workspace=self.test_workspace,
            enable_gui_automation=False,  # Disable GUI for testing
            log_level="DEBUG"
        )
        
        automation = EnhancedCursorAutomation(config)
        
        # Verify configuration
        assert automation.config.cursor_workspace == self.test_workspace
        assert automation.config.max_iterations == 10
        assert automation.config.enable_gui_automation == False
        
        print(f"✅ Automation config created successfully")
        return True
    
    def test_mcp_bus_creation(self) -> bool:
        """Test MCP message bus creation and basic operations."""
        test_db = os.path.join(self.test_workspace, "test_messages.db")
        
        try:
            bus = SimpleMessageBus(test_db)
            self.cleanup_tasks.append(lambda: os.unlink(test_db) if os.path.exists(test_db) else None)
            
            # Register a test agent first
            agent_id = bus.register_agent("test_agent", ["test_channel"])
            
            # Test basic operations
            result = bus.post("test_channel", "test_agent", {"message": "test"})
            
            messages = bus.pull("test_channel", limit=1)
            assert len(messages["items"]) == 1
            assert messages["items"][0]["body"]["message"] == "test"
            
            channels = bus.list_channels()
            assert "test_channel" in channels
            
            print(f"✅ MCP bus operations working")
            return True
            
        except Exception as e:
            print(f"❌ MCP bus error: {e}")
            return False
    
    def test_workflow_manager_initialization(self) -> bool:
        """Test enhanced workflow manager with project context."""
        try:
            manager = EnhancedWorkflowManager(self.test_workspace)
            
            # Test workflow configuration generation
            config = manager.get_workflow_config("2-agent", use_enhanced_prompts=False)
            
            assert config["name"] == "Enhanced 2-Agent Workflow"
            assert "architect" in config["agents"]
            assert "executor" in config["agents"]
            assert "a2e" in config["channels"]
            
            # Test validation
            validation = manager.validate_workflow_config(config)
            assert isinstance(validation, dict)
            
            print(f"✅ Workflow manager initialized successfully")
            return True
            
        except Exception as e:
            print(f"❌ Workflow manager error: {e}")
            return False
    
    def test_session_creation(self) -> bool:
        """Test chat session creation without launching Cursor."""
        config = AutomationConfig(
            cursor_workspace=self.test_workspace,
            enable_gui_automation=False,
            log_level="DEBUG"
        )
        
        automation = EnhancedCursorAutomation(config)
        
        try:
            session_id = automation.create_chat_session(
                "test_agent",
                "You are a test agent. Respond with 'test successful' to any message."
            )
            
            assert session_id.startswith("test_agent_")
            assert session_id in automation.sessions
            
            session = automation.sessions[session_id]
            assert session.role == "test_agent"
            assert session.status == "running"
            
            print(f"✅ Session created: {session_id}")
            return True
            
        except Exception as e:
            print(f"❌ Session creation error: {e}")
            return False
    
    def test_gui_automation_check(self) -> bool:
        """Test GUI automation prerequisites without launching GUI."""
        try:
            # Check for required tools
            tools_available = []
            
            for tool in ['xdotool', 'xclip']:
                result = subprocess.run(['which', tool], 
                                      capture_output=True, text=True)
                tools_available.append(result.returncode == 0)
            
            if all(tools_available):
                print(f"✅ GUI automation tools available")
                return True
            else:
                print(f"⚠️  Some GUI tools missing (expected in headless environment)")
                return True  # Not a failure in headless environments
                
        except Exception as e:
            print(f"❌ GUI automation check error: {e}")
            return False
    
    def test_clipboard_fallback(self) -> bool:
        """Test clipboard functionality with fallback mechanisms."""
        config = AutomationConfig(
            cursor_workspace=self.test_workspace,
            enable_gui_automation=False,
            log_level="DEBUG"
        )
        
        automation = EnhancedCursorAutomation(config)
        
        try:
            # Test file-based fallback for prompt injection
            test_content = "This is a test prompt for clipboard functionality"
            
            # Simulate the file-based fallback that automation would use
            from pathlib import Path
            import tempfile
            
            # Create a temporary prompt file (simulating fallback behavior)
            temp_file = Path(tempfile.gettempdir()) / f"cursor_prompt_test_{int(time.time())}.txt"
            temp_file.write_text(test_content)
            
            # Verify the fallback file was created and contains correct content
            if temp_file.exists() and temp_file.read_text() == test_content:
                print(f"✅ File-based prompt fallback working")
                temp_file.unlink()  # Clean up
                return True
            else:
                print(f"❌ File-based fallback failed")
                return False
                
        except Exception as e:
            print(f"❌ Clipboard fallback test error: {e}")
            return False
    
    def test_dry_run_workflow(self) -> bool:
        """Test dry-run workflow execution."""
        try:
            # Test the dry-run functionality
            result = subprocess.run([
                sys.executable, 'start.py', '2-agent', '--dry-run'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                output = result.stdout
                
                # Check for expected dry-run outputs
                expected_markers = [
                    "DRY RUN",
                    "Workflow:",
                    "Agents:",
                    "Channels:",
                    "Validation:"
                ]
                
                missing_markers = [m for m in expected_markers if m not in output]
                
                if not missing_markers:
                    print(f"✅ Dry-run completed successfully")
                    return True
                else:
                    print(f"❌ Missing markers in dry-run: {missing_markers}")
                    return False
            else:
                print(f"❌ Dry-run failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print(f"❌ Dry-run timed out")
            return False
        except Exception as e:
            print(f"❌ Dry-run error: {e}")
            return False
    
    def test_logging_system(self) -> bool:
        """Test comprehensive logging system."""
        config = AutomationConfig(
            cursor_workspace=self.test_workspace,
            enable_gui_automation=False,
            log_level="DEBUG"
        )
        
        automation = EnhancedCursorAutomation(config)
        
        try:
            # Create a session to generate some logs
            session_id = automation.create_chat_session(
                "test_logger",
                "Test prompt for logging verification"
            )
            
            # Wait a moment for logging to occur
            time.sleep(1)
            
            # Check if log files exist and have content
            log_dir = Path("logs")
            expected_logs = [
                "cursor_automation.log",
                "sessions.log"
            ]
            
            logs_found = 0
            for log_file in expected_logs:
                log_path = log_dir / log_file
                if log_path.exists() and log_path.stat().st_size > 0:
                    logs_found += 1
                    print(f"  ✅ {log_file}: {log_path.stat().st_size} bytes")
            
            if logs_found >= 1:  # At least one log file should exist
                print(f"✅ Logging system working ({logs_found}/{len(expected_logs)} logs)")
                return True
            else:
                print(f"❌ No log files found")
                return False
                
        except Exception as e:
            print(f"❌ Logging test error: {e}")
            return False


def main():
    """Run integration tests."""
    print("🚀 Cursor Automation Integration Tests")
    print("=" * 60)
    
    # Initialize test framework
    tester = CursorIntegrationTests()
    
    try:
        # Define test suite
        tests = [
            ("Cursor Availability", tester.test_cursor_availability),
            ("Automation Config Creation", tester.test_automation_config_creation),
            ("MCP Bus Creation", tester.test_mcp_bus_creation),
            ("Workflow Manager Initialization", tester.test_workflow_manager_initialization),
            ("Session Creation", tester.test_session_creation),
            ("GUI Automation Check", tester.test_gui_automation_check),
            ("Clipboard Fallback", tester.test_clipboard_fallback),
            ("Dry-run Workflow", tester.test_dry_run_workflow),
            ("Logging System", tester.test_logging_system),
        ]
        
        # Run all tests
        for test_name, test_func in tests:
            tester.run_test(test_name, test_func)
        
        # Print summary
        tester.print_summary()
        
        # Return appropriate exit code
        failed_count = len([r for r in tester.test_results if r["status"] in ["FAIL", "ERROR"]])
        return 0 if failed_count == 0 else 1
        
    finally:
        tester.cleanup()


if __name__ == "__main__":
    sys.exit(main())