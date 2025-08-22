#!/usr/bin/env python3
"""
Real Workflow Integration Test
Simulates an actual 2-agent workflow with message passing and coordination.
"""

import json
import os
import sys
import tempfile
import threading
import time
from pathlib import Path
from typing import Dict, Any

# Add parent directory to path for imports  
sys.path.insert(0, str(Path(__file__).parent.parent))

from cursor_automation_enhanced import EnhancedCursorAutomation, AutomationConfig
from mcp_server import SimpleMessageBus
from workflow_manager import EnhancedWorkflowManager


class MockCursorWorkflow:
    """Mock workflow that simulates architect and executor interaction."""
    
    def __init__(self, test_workspace: str):
        self.test_workspace = test_workspace
        self.bus = SimpleMessageBus(os.path.join(test_workspace, "workflow_test.db"))
        self.automation = None
        self.results = {
            "messages_exchanged": 0,
            "tasks_completed": 0,
            "errors": [],
            "timeline": []
        }
        
    def setup_automation(self):
        """Setup automation system for testing."""
        config = AutomationConfig(
            max_iterations=20,
            loop_detection_threshold=5,
            inactivity_timeout=120,
            cursor_workspace=self.test_workspace,
            enable_gui_automation=False,  # Disable GUI for testing
            log_level="DEBUG"
        )
        
        self.automation = EnhancedCursorAutomation(config)
        self.automation.connect_to_mcp(self.bus)
        
    def simulate_architect_behavior(self, task_request: str) -> bool:
        """Simulate architect planning and task creation."""
        try:
            self.results["timeline"].append(f"Architect: Received task '{task_request}'")
            
            # Create architect session
            architect_id = self.automation.create_chat_session(
                "architect",
                "You are an architect agent. Plan tasks and coordinate with executor."
            )
            
            # Simulate architect posting a task to a2e channel
            task_envelope = {
                "from": "architect",
                "task_id": "TASK-001",
                "intent": "plan",
                "micro_task": task_request,
                "acceptance_criteria": "Task completed successfully with validation",
                "priority": "high",
                "estimated_time": "15 minutes"
            }
            
            # Register architect agent first
            architect_agent_id = self.bus.register_agent("architect", ["a2e", "e2a", "status"])
            self.bus.post("a2e", "architect", task_envelope)
            self.results["messages_exchanged"] += 1
            self.results["timeline"].append("Architect: Posted task to a2e channel")
            
            return True
            
        except Exception as e:
            self.results["errors"].append(f"Architect error: {e}")
            return False
    
    def simulate_executor_behavior(self) -> bool:
        """Simulate executor receiving and processing tasks."""
        try:
            self.results["timeline"].append("Executor: Checking for tasks")
            
            # Create executor session
            executor_id = self.automation.create_chat_session(
                "executor", 
                "You are an executor agent. Implement tasks safely and report results."
            )
            
            # Register executor agent
            executor_agent_id = self.bus.register_agent("executor", ["a2e", "e2a", "e2r", "status"])
            
            # Pull task from a2e channel
            messages = self.bus.pull("a2e", limit=1)
            
            if messages["items"]:
                task = messages["items"][0]["body"]
                self.results["timeline"].append(f"Executor: Received task {task['task_id']}")
                
                # Simulate task execution
                time.sleep(0.5)  # Simulate work
                
                # Post response to e2a channel
                response = {
                    "from": "executor",
                    "task_id": task["task_id"],
                    "status": "success",
                    "summary": f"Completed: {task['micro_task']}",
                    "changes_made": "Created test file with requested functionality",
                    "commands_run": ["python test_script.py", "pytest test_module.py"],
                    "test_results": {"passed": 3, "failed": 0},
                    "next_suggestion": "Ready for code review",
                    "blockers": None,
                    "done": True
                }
                
                self.bus.post("e2a", "executor", response)
                self.results["messages_exchanged"] += 1
                self.results["tasks_completed"] += 1
                self.results["timeline"].append("Executor: Posted completion response")
                
                return True
            else:
                self.results["timeline"].append("Executor: No tasks found")
                return False
                
        except Exception as e:
            self.results["errors"].append(f"Executor error: {e}")
            return False
    
    def simulate_coordination_cycle(self) -> bool:
        """Simulate a full coordination cycle between agents."""
        try:
            # Architect receives response
            messages = self.bus.pull("e2a", limit=1)
            
            if messages["items"]:
                response = messages["items"][0]["body"]
                self.results["timeline"].append(f"Architect: Received completion for {response['task_id']}")
                
                # Post status update
                status_update = {
                    "from": "architect",
                    "message": f"Task {response['task_id']} completed successfully",
                    "workflow_status": "completed",
                    "next_steps": "Workflow complete"
                }
                
                self.bus.post("status", "architect", status_update)
                self.results["messages_exchanged"] += 1
                self.results["timeline"].append("Architect: Posted workflow completion")
                
                return True
            else:
                self.results["timeline"].append("Architect: No responses found")
                return False
                
        except Exception as e:
            self.results["errors"].append(f"Coordination error: {e}")
            return False
    
    def run_full_workflow_simulation(self, task: str = "Create a simple Python function to calculate fibonacci numbers") -> Dict[str, Any]:
        """Run a complete workflow simulation."""
        try:
            self.setup_automation()
            
            # Step 1: Architect plans task
            if not self.simulate_architect_behavior(task):
                return self.results
            
            # Step 2: Executor processes task
            if not self.simulate_executor_behavior():
                return self.results
            
            # Step 3: Coordination cycle
            if not self.simulate_coordination_cycle():
                return self.results
            
            # Verify final state
            self.results["success"] = len(self.results["errors"]) == 0
            self.results["final_channels"] = self.bus.list_channels()
            
            return self.results
            
        except Exception as e:
            self.results["errors"].append(f"Workflow error: {e}")
            self.results["success"] = False
            return self.results


def test_2_agent_workflow_simulation():
    """Test a complete 2-agent workflow simulation."""
    print("\n🔄 Testing 2-Agent Workflow Simulation")
    print("-" * 50)
    
    # Create test workspace
    test_workspace = tempfile.mkdtemp(prefix="workflow_test_")
    
    try:
        # Run workflow simulation
        workflow = MockCursorWorkflow(test_workspace)
        results = workflow.run_full_workflow_simulation()
        
        # Print results
        print(f"Messages exchanged: {results['messages_exchanged']}")
        print(f"Tasks completed: {results['tasks_completed']}")
        print(f"Errors: {len(results['errors'])}")
        
        if results.get('timeline'):
            print(f"\nTimeline:")
            for event in results['timeline']:
                print(f"  • {event}")
        
        if results['errors']:
            print(f"\nErrors:")
            for error in results['errors']:
                print(f"  ❌ {error}")
        
        # Validate results
        success = (
            results.get('success', False) and
            results['messages_exchanged'] >= 3 and  # At least 3 messages
            results['tasks_completed'] >= 1 and     # At least 1 task
            len(results['errors']) == 0             # No errors
        )
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"\n{status} 2-Agent Workflow Simulation")
        
        return success
        
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False
    
    finally:
        # Cleanup
        import shutil
        if os.path.exists(test_workspace):
            shutil.rmtree(test_workspace)


def test_message_bus_performance():
    """Test message bus performance under load."""
    print("\n⚡ Testing Message Bus Performance")
    print("-" * 50)
    
    test_workspace = tempfile.mkdtemp(prefix="perf_test_")
    
    try:
        bus = SimpleMessageBus(os.path.join(test_workspace, "perf_test.db"))
        
        # Performance test parameters
        num_messages = 100
        num_channels = 5
        
        # Register test agent with all channels
        channel_list = [f"channel_{i}" for i in range(num_channels)]
        agent_id = bus.register_agent("test_perf_agent", channel_list)
        
        start_time = time.time()
        
        # Post messages
        for i in range(num_messages):
            channel = f"channel_{i % num_channels}"
            message = {
                "id": i,
                "data": f"Performance test message {i}",
                "timestamp": time.time()
            }
            bus.post(channel, "test_perf_agent", message)
        
        post_time = time.time() - start_time
        
        # Pull messages
        start_time = time.time()
        total_pulled = 0
        
        for i in range(num_channels):
            channel = f"channel_{i}"
            messages = bus.pull(channel, limit=50)
            total_pulled += len(messages["items"])
        
        pull_time = time.time() - start_time
        
        # Results
        print(f"Posted {num_messages} messages in {post_time:.3f}s ({num_messages/post_time:.1f} msgs/sec)")
        print(f"Pulled {total_pulled} messages in {pull_time:.3f}s ({total_pulled/pull_time:.1f} msgs/sec)")
        
        # Performance criteria
        post_rate = num_messages / post_time
        pull_rate = total_pulled / pull_time
        
        success = post_rate > 50 and pull_rate > 100  # Reasonable performance thresholds
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"\n{status} Message Bus Performance Test")
        
        return success
        
    except Exception as e:
        print(f"❌ Performance test error: {e}")
        return False
    
    finally:
        # Cleanup
        import shutil
        if os.path.exists(test_workspace):
            shutil.rmtree(test_workspace)


def test_concurrent_workflows():
    """Test handling multiple concurrent workflow simulations."""
    print("\n🔀 Testing Concurrent Workflows")
    print("-" * 50)
    
    test_workspace = tempfile.mkdtemp(prefix="concurrent_test_")
    
    try:
        workflows = []
        threads = []
        results = []
        
        # Create multiple workflow instances
        for i in range(3):
            workflow = MockCursorWorkflow(os.path.join(test_workspace, f"workflow_{i}"))
            workflows.append(workflow)
        
        def run_workflow(workflow, task_id):
            """Run workflow in thread."""
            task = f"Create function for task {task_id}"
            result = workflow.run_full_workflow_simulation(task)
            results.append(result)
        
        # Start concurrent workflows
        start_time = time.time()
        
        for i, workflow in enumerate(workflows):
            thread = threading.Thread(target=run_workflow, args=(workflow, i))
            threads.append(thread)
            thread.start()
        
        # Wait for completion
        for thread in threads:
            thread.join()
        
        duration = time.time() - start_time
        
        # Analyze results
        successful_workflows = len([r for r in results if r.get('success', False)])
        total_messages = sum(r['messages_exchanged'] for r in results)
        total_tasks = sum(r['tasks_completed'] for r in results)
        total_errors = sum(len(r['errors']) for r in results)
        
        print(f"Ran {len(workflows)} concurrent workflows in {duration:.2f}s")
        print(f"Successful workflows: {successful_workflows}/{len(workflows)}")
        print(f"Total messages: {total_messages}")
        print(f"Total tasks: {total_tasks}")
        print(f"Total errors: {total_errors}")
        
        success = (
            successful_workflows >= 2 and  # Most workflows succeed
            total_messages >= 9 and        # Reasonable message count
            total_tasks >= 3 and           # Tasks completed
            total_errors == 0              # No errors
        )
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"\n{status} Concurrent Workflows Test")
        
        return success
        
    except Exception as e:
        print(f"❌ Concurrent test error: {e}")
        return False
    
    finally:
        # Cleanup
        import shutil
        if os.path.exists(test_workspace):
            shutil.rmtree(test_workspace)


def main():
    """Run real workflow integration tests."""
    print("🔄 Real Workflow Integration Tests")
    print("=" * 60)
    
    tests = [
        ("2-Agent Workflow Simulation", test_2_agent_workflow_simulation),
        ("Message Bus Performance", test_message_bus_performance),
        ("Concurrent Workflows", test_concurrent_workflows),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        if test_func():
            passed += 1
    
    print(f"\n📊 Real Workflow Test Summary")
    print("=" * 50)
    print(f"Passed: {passed}/{total}")
    print(f"Success rate: {(passed/total*100):.1f}%")
    
    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())