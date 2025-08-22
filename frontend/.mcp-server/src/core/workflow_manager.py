#!/usr/bin/env python3
"""
Enhanced Workflow Manager with Project Context Integration
Manages agent workflows using enhanced prompts and project-specific context.
"""

import os
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Any

from src.utils.prompt_loader import PromptLoader, ProjectContext


class EnhancedWorkflowManager:
    """Manages workflows with enhanced prompts and project context."""
    
    def __init__(self, project_root: str = None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        
        # Determine actual project root - check if we're in .mcp-server subdirectory
        if self.project_root.name == '.mcp-server':
            actual_project_root = self.project_root.parent
        else:
            actual_project_root = self.project_root
            
        self.project_context = ProjectContext(actual_project_root)
        self.prompt_loader = PromptLoader()
        self.prompt_loader.set_project_context(self.project_context)
        
    def get_workflow_config(self, workflow_type: str, use_enhanced_prompts: bool = True) -> Dict:
        """Get workflow configuration with context-aware prompts."""
        
        if workflow_type == "2-agent":
            return self._build_2_agent_workflow(use_enhanced_prompts)
        elif workflow_type == "3-agent":
            return self._build_3_agent_workflow(use_enhanced_prompts)
        elif workflow_type == "4-agent":
            return self._build_4_agent_workflow(use_enhanced_prompts)
        elif workflow_type == "6-agent":
            return self._build_6_agent_workflow(use_enhanced_prompts)
        elif workflow_type == "custom":
            return self._load_custom_workflow()
        else:
            raise ValueError(f"Unknown workflow type: {workflow_type}")
    
    def _build_2_agent_workflow(self, use_enhanced: bool = True) -> Dict:
        """Build 2-agent workflow with enhanced prompts."""
        try:
            architect_prompt = self.prompt_loader.load_prompt("architect", enhanced=use_enhanced)
            executor_prompt = self.prompt_loader.load_prompt("executor", enhanced=use_enhanced)
        except FileNotFoundError as e:
            print(f"Warning: {e}. Falling back to basic prompts.")
            return self._get_fallback_2_agent_config()
        
        return {
            "name": "Enhanced 2-Agent Workflow",
            "description": f"Context-aware architect + executor for {self.project_context.context['project_name']}",
            "channels": ["a2e", "e2a", "status"],
            "project_context": self.project_context.get_context_summary(),
            "agents": {
                "architect": {
                    "role": "architect",
                    "channels": ["a2e", "e2a", "status"],
                    "prompt": architect_prompt,
                    "enhanced": use_enhanced
                },
                "executor": {
                    "role": "executor",
                    "channels": ["a2e", "e2a", "status"],
                    "prompt": executor_prompt,
                    "enhanced": use_enhanced
                }
            }
        }
    
    def _build_3_agent_workflow(self, use_enhanced: bool = True) -> Dict:
        """Build 3-agent workflow with enhanced prompts."""
        base_config = self._build_2_agent_workflow(use_enhanced)
        
        try:
            reviewer_prompt = self.prompt_loader.load_prompt("reviewer", enhanced=use_enhanced)
        except FileNotFoundError as e:
            print(f"Warning: {e}. Using basic reviewer prompt.")
            reviewer_prompt = self._get_basic_reviewer_prompt()
        
        base_config.update({
            "name": "Enhanced 3-Agent Workflow",
            "description": f"Context-aware architect + executor + reviewer for {self.project_context.context['project_name']}",
            "channels": ["a2e", "e2a", "e2r", "r2a", "status"]
        })
        
        # Update agent channels
        base_config["agents"]["architect"]["channels"] = ["a2e", "e2a", "r2a", "status"]
        base_config["agents"]["executor"]["channels"] = ["a2e", "e2a", "e2r", "status"]
        
        # Add reviewer
        base_config["agents"]["reviewer"] = {
            "role": "reviewer",
            "channels": ["e2r", "r2a", "status"],
            "prompt": reviewer_prompt,
            "enhanced": use_enhanced
        }
        
        return base_config
    
    def _build_4_agent_workflow(self, use_enhanced: bool = True) -> Dict:
        """Build 4-agent workflow with GitHub integration."""
        base_config = self._build_3_agent_workflow(use_enhanced)
        
        try:
            github_prompt = self.prompt_loader.load_prompt("github_agent", enhanced=use_enhanced)
        except FileNotFoundError as e:
            print(f"Warning: {e}. Using basic GitHub prompt.")
            github_prompt = self._get_basic_github_prompt()
        
        base_config.update({
            "name": "Enhanced 4-Agent Workflow",
            "description": f"Full DevOps workflow with GitHub integration for {self.project_context.context['project_name']}",
            "channels": ["a2e", "e2a", "e2r", "r2a", "r2g", "g2a", "status"]
        })
        
        # Update agent channels
        base_config["agents"]["architect"]["channels"] = ["a2e", "e2a", "r2a", "g2a", "status"]
        base_config["agents"]["reviewer"]["channels"] = ["e2r", "r2a", "r2g", "status"]
        
        # Add GitHub agent
        base_config["agents"]["github"] = {
            "role": "github",
            "channels": ["r2g", "g2a", "status"],
            "prompt": github_prompt,
            "enhanced": use_enhanced
        }
        
        return base_config
    
    def _build_6_agent_workflow(self, use_enhanced: bool = True) -> Dict:
        """Build 6-agent workflow with specialized agents."""
        base_config = self._build_4_agent_workflow(use_enhanced)
        
        try:
            security_prompt = self.prompt_loader.load_prompt("security_specialist", enhanced=use_enhanced)
            performance_prompt = self.prompt_loader.load_prompt("performance_optimizer", enhanced=use_enhanced)
        except FileNotFoundError as e:
            print(f"Warning: {e}. Some specialized prompts may not be available.")
            security_prompt = self._get_basic_security_prompt()
            performance_prompt = self._get_basic_performance_prompt()
        
        base_config.update({
            "name": "Enhanced 6-Agent Enterprise Workflow",
            "description": f"Full enterprise workflow with security and performance specialists for {self.project_context.context['project_name']}",
            "channels": ["a2e", "e2a", "e2r", "r2a", "r2g", "g2a", "r2s", "s2a", "r2p", "p2a", "status"]
        })
        
        # Update reviewer channels to connect with specialists
        base_config["agents"]["reviewer"]["channels"] = ["e2r", "r2a", "r2g", "r2s", "r2p", "status"]
        base_config["agents"]["architect"]["channels"] = ["a2e", "e2a", "r2a", "g2a", "s2a", "p2a", "status"]
        
        # Add specialized agents
        base_config["agents"]["security"] = {
            "role": "security",
            "channels": ["r2s", "s2a", "status"],
            "prompt": security_prompt,
            "enhanced": use_enhanced
        }
        
        base_config["agents"]["performance"] = {
            "role": "performance", 
            "channels": ["r2p", "p2a", "status"],
            "prompt": performance_prompt,
            "enhanced": use_enhanced
        }
        
        return base_config
    
    def _load_custom_workflow(self) -> Dict:
        """Load custom workflow from configuration file."""
        custom_config_path = self.project_root / "config" / "workflow_config.yml"
        
        if not custom_config_path.exists():
            print(f"Custom workflow config not found at {custom_config_path}")
            return self._build_2_agent_workflow()
            
        try:
            with open(custom_config_path, 'r') as f:
                custom_config = yaml.safe_load(f)
                
            # Load prompts for each agent
            for agent_name, agent_config in custom_config.get("agents", {}).items():
                prompt_name = agent_config.get("prompt_file", agent_name)
                enhanced = agent_config.get("enhanced", True)
                
                try:
                    agent_config["prompt"] = self.prompt_loader.load_prompt(prompt_name, enhanced=enhanced)
                except FileNotFoundError:
                    print(f"Warning: Prompt file not found for {agent_name}. Using basic prompt.")
                    agent_config["prompt"] = self._get_basic_prompt(agent_name)
            
            custom_config["project_context"] = self.project_context.get_context_summary()
            return custom_config
            
        except Exception as e:
            print(f"Error loading custom workflow: {e}")
            return self._build_2_agent_workflow()
    
    def _get_fallback_2_agent_config(self) -> Dict:
        """Fallback configuration if enhanced prompts not available."""
        return {
            "name": "Basic 2-Agent Workflow",
            "description": "Basic architect + executor workflow",
            "channels": ["a2e", "e2a", "status"],
            "agents": {
                "architect": {
                    "role": "architect",
                    "channels": ["a2e", "e2a", "status"],
                    "prompt": self._get_basic_architect_prompt()
                },
                "executor": {
                    "role": "executor",
                    "channels": ["a2e", "e2a", "status"],
                    "prompt": self._get_basic_executor_prompt()
                }
            }
        }
    
    def _get_basic_architect_prompt(self) -> str:
        """Basic architect prompt as fallback."""
        context_info = ""
        if self.project_context:
            context_info = f"""
PROJECT CONTEXT:
You are working on: {self.project_context.context['project_name']}
Project type: {self.project_context.context['project_type']}
Technologies: {', '.join(self.project_context.context['technology_stack'])}

{self.project_context.context['special_instructions']}

"""

        return f"""{context_info}ROLE: Architect Agent - Strategic task planning and coordination

SETUP:
- Register: register_agent(name="architect", channels=["a2e", "e2a", "status"])
- Primary channel: post to "a2e", pull from "e2a"

WORKFLOW:
1. Break down user requests into micro-tasks (15-30 min each)
2. Post structured task envelopes to "a2e" channel
3. Monitor "e2a" for executor responses
4. Review results and plan next steps
5. Mark completion with status update

ENVELOPE FORMAT:
{{
  "from": "architect",
  "task_id": "TASK-001", 
  "intent": "plan|implement|review|finalize",
  "micro_task": "specific actionable step",
  "acceptance_criteria": "measurable success criteria",
  "priority": "high|medium|low",
  "estimated_time": "15-30 minutes"
}}

Always end messages with [[END-OF-TURN]]"""
    
    def _get_basic_executor_prompt(self) -> str:
        """Basic executor prompt as fallback."""
        context_info = ""
        if self.project_context:
            context_info = f"""
PROJECT CONTEXT:
You are working on: {self.project_context.context['project_name']}
Follow these coding standards: {self.project_context.context.get('coding_standards', {})}
Technology stack: {', '.join(self.project_context.context['technology_stack'])}

{self.project_context.context['special_instructions']}

"""

        return f"""{context_info}ROLE: Executor Agent - Safe task implementation and reporting

SETUP:
- Register: register_agent(name="executor", channels=["a2e", "e2a", "status"])
- Primary channel: pull from "a2e", post to "e2a"

WORKFLOW:
1. Pull tasks from "a2e" channel
2. Implement micro-tasks safely with verification
3. Run tests and validation where applicable  
4. Post detailed results to "e2a" channel
5. Update status on completion

RESPONSE FORMAT:
{{
  "from": "executor",
  "task_id": "TASK-001",
  "status": "success|partial|failed|blocked",
  "summary": "1-3 line summary of what was accomplished",
  "changes_made": "files modified/created",
  "commands_run": ["cmd1", "cmd2"],
  "test_results": {{"passed": 0, "failed": 0}},
  "next_suggestion": "recommended next step",
  "done": true/false
}}

SAFETY RULES:
- Always run tests after code modifications
- Never commit secrets or sensitive data
- Use proper error handling and validation

Always end messages with [[END-OF-TURN]]"""
    
    def _get_basic_reviewer_prompt(self) -> str:
        """Basic reviewer prompt as fallback."""
        return """ROLE: Reviewer Agent - Quality assurance and validation

SETUP:
- Register: register_agent(name="reviewer", channels=["e2r", "r2a", "status"])

WORKFLOW:
1. Pull completed work from "e2r" channel
2. Review code quality, tests, and security
3. Check acceptance criteria fulfillment
4. Post review results to "r2a" channel

REVIEW CRITERIA:
- Code quality and readability
- Test coverage and passing tests
- Security best practices
- Performance considerations
- Documentation completeness

Always end messages with [[END-OF-TURN]]"""
    
    def _get_basic_github_prompt(self) -> str:
        """Basic GitHub prompt as fallback."""
        return """ROLE: GitHub Agent - Git operations and deployment

SETUP:
- Register: register_agent(name="github", channels=["r2g", "g2a", "status"])

WORKFLOW:
1. Pull approved changes from "r2g" channel
2. Create feature branches and commits
3. Create pull requests with descriptions
4. Monitor CI/CD pipeline status
5. Handle merge operations

Always end messages with [[END-OF-TURN]]"""
    
    def _get_basic_security_prompt(self) -> str:
        """Basic security prompt as fallback."""
        return """ROLE: Security Specialist - Vulnerability assessment

SETUP:
- Register: register_agent(name="security", channels=["r2s", "s2a", "status"])

Focus on OWASP Top 10, input validation, authentication, and authorization.

Always end messages with [[END-OF-TURN]]"""
    
    def _get_basic_performance_prompt(self) -> str:
        """Basic performance prompt as fallback."""
        return """ROLE: Performance Optimizer - Performance analysis

SETUP:
- Register: register_agent(name="performance", channels=["r2p", "p2a", "status"])

Focus on database optimization, caching, and scalability.

Always end messages with [[END-OF-TURN]]"""
    
    def _get_basic_prompt(self, agent_name: str) -> str:
        """Get basic prompt for any agent type."""
        prompts = {
            "architect": self._get_basic_architect_prompt(),
            "executor": self._get_basic_executor_prompt(),
            "reviewer": self._get_basic_reviewer_prompt(),
            "github": self._get_basic_github_prompt(),
            "security": self._get_basic_security_prompt(),
            "performance": self._get_basic_performance_prompt()
        }
        
        return prompts.get(agent_name, f"ROLE: {agent_name} Agent\nAlways end with [[END-OF-TURN]]")
    
    def get_project_summary(self) -> str:
        """Get formatted project summary for display."""
        return f"""
🏗️  PROJECT: {self.project_context.context['project_name']}
📂 TYPE: {self.project_context.context['project_type']}
🔧 TECH: {', '.join(self.project_context.context['technology_stack'])}
🏢 DOMAIN: {self.project_context.context['business_domain']}

📋 SPECIAL INSTRUCTIONS:
{self.project_context.context['special_instructions'][:200]}{'...' if len(self.project_context.context['special_instructions']) > 200 else ''}
""".strip()
    
    def validate_workflow_config(self, config: Dict) -> Dict[str, bool]:
        """Validate workflow configuration."""
        validation = {
            "has_agents": len(config.get("agents", {})) > 0,
            "has_channels": len(config.get("channels", [])) > 0,
            "prompts_loaded": all("prompt" in agent for agent in config.get("agents", {}).values()),
            "has_project_context": "project_context" in config,
            "agents_have_channels": all("channels" in agent for agent in config.get("agents", {}).values())
        }
        
        return validation


if __name__ == "__main__":
    # Example usage
    workflow_manager = EnhancedWorkflowManager()
    
    print("🏗️ Project Summary:")
    print(workflow_manager.get_project_summary())
    
    print(f"\n🎭 Testing Workflow Configurations:")
    
    for workflow_type in ["2-agent", "3-agent", "4-agent", "6-agent"]:
        try:
            config = workflow_manager.get_workflow_config(workflow_type)
            validation = workflow_manager.validate_workflow_config(config)
            
            print(f"\n📋 {workflow_type.upper()}:")
            print(f"  - Name: {config['name']}")
            print(f"  - Agents: {len(config['agents'])}")
            print(f"  - Channels: {len(config['channels'])}")
            print(f"  - Validation: {sum(validation.values())}/{len(validation)} checks passed")
            
        except Exception as e:
            print(f"❌ {workflow_type}: {e}")
    
    print(f"\n✅ Workflow manager ready!")