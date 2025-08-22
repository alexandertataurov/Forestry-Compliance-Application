#!/usr/bin/env python3
"""
Prompt Loader and Context Manager
Loads agent prompts and project context for intelligent workflow execution.
"""

import json
import os
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Any


class ProjectContext:
    """Manages project-specific context and instructions."""
    
    def __init__(self, project_root: str = None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        self.context = self._load_project_context()
        
    def _load_project_context(self) -> Dict[str, Any]:
        """Load project context from various sources."""
        context = {
            "project_name": self.project_root.name,
            "project_type": "unknown",
            "technology_stack": [],
            "coding_standards": {},
            "business_domain": "general",
            "special_instructions": "",
            "constraints": [],
            "goals": []
        }
        
        # Look for project configuration files in priority order
        # Process dependency files first (for base detection)
        dependency_files = ["package.json", "requirements.txt", "Cargo.toml", "pom.xml"]
        for config_file in dependency_files:
            file_path = self.project_root / config_file
            if file_path.exists():
                context.update(self._parse_config_file(file_path))
        
        # Process documentation files (medium priority) 
        doc_files = ["README.md", "PROJECT_CONTEXT.md", "DEVELOPMENT_GUIDE.md"]
        for config_file in doc_files:
            file_path = self.project_root / config_file
            if file_path.exists():
                context.update(self._parse_config_file(file_path))
                
        # Process explicit configuration files last (highest priority)
        config_files = [".project-context.yml", ".cursor-context.yml"]
        for config_file in config_files:
            file_path = self.project_root / config_file
            if file_path.exists():
                context.update(self._parse_config_file(file_path))
                
        return context
    
    def _parse_config_file(self, file_path: Path) -> Dict[str, Any]:
        """Parse different types of configuration files."""
        context_updates = {}
        
        if file_path.suffix in ['.yml', '.yaml']:
            context_updates.update(self._parse_yaml_config(file_path))
        elif file_path.suffix == '.json':
            context_updates.update(self._parse_json_config(file_path))
        elif file_path.suffix == '.md':
            context_updates.update(self._parse_markdown_config(file_path))
        elif file_path.name in ['package.json', 'requirements.txt', 'Cargo.toml', 'pom.xml']:
            context_updates.update(self._parse_dependency_file(file_path))
            
        return context_updates
    
    def _parse_yaml_config(self, file_path: Path) -> Dict[str, Any]:
        """Parse YAML configuration files."""
        try:
            with open(file_path, 'r') as f:
                config = yaml.safe_load(f)
                
            if config:
                return {
                    "project_type": config.get("project_type", "unknown"),
                    "technology_stack": config.get("technology_stack", []),
                    "business_domain": config.get("business_domain", "general"),
                    "coding_standards": config.get("coding_standards", {}),
                    "special_instructions": config.get("special_instructions", ""),
                    "constraints": config.get("constraints", []),
                    "goals": config.get("goals", [])
                }
        except Exception as e:
            print(f"Warning: Could not parse {file_path}: {e}")
            
        return {}
    
    def _parse_json_config(self, file_path: Path) -> Dict[str, Any]:
        """Parse JSON configuration files."""
        try:
            with open(file_path, 'r') as f:
                config = json.load(f)
                
            return self._extract_context_from_json(config)
        except Exception as e:
            print(f"Warning: Could not parse {file_path}: {e}")
            
        return {}
    
    def _parse_markdown_config(self, file_path: Path) -> Dict[str, Any]:
        """Parse markdown files for project context."""
        try:
            content = file_path.read_text()
            
            context = {}
            
            # Extract project type from headers
            if any(keyword in content.lower() for keyword in ['web app', 'webapp', 'website']):
                context["project_type"] = "web_application"
            elif any(keyword in content.lower() for keyword in ['api', 'backend', 'server']):
                context["project_type"] = "backend_api"
            elif any(keyword in content.lower() for keyword in ['frontend', 'react', 'vue', 'angular']):
                context["project_type"] = "frontend_application"
            elif any(keyword in content.lower() for keyword in ['mobile', 'ios', 'android']):
                context["project_type"] = "mobile_application"
                
            # Extract technology stack
            tech_keywords = {
                'python': ['python', 'django', 'flask', 'fastapi'],
                'javascript': ['javascript', 'node.js', 'react', 'vue', 'angular'],
                'typescript': ['typescript', 'ts'],
                'java': ['java', 'spring', 'maven'],
                'rust': ['rust', 'cargo'],
                'go': ['golang', 'go'],
                'docker': ['docker', 'container'],
                'kubernetes': ['kubernetes', 'k8s'],
                'postgresql': ['postgresql', 'postgres'],
                'mysql': ['mysql'],
                'redis': ['redis'],
                'mongodb': ['mongodb', 'mongo']
            }
            
            technologies = []
            for tech, keywords in tech_keywords.items():
                if any(keyword in content.lower() for keyword in keywords):
                    technologies.append(tech)
                    
            if technologies:
                context["technology_stack"] = technologies
                
            # Extract special instructions from dedicated sections
            if "## Development Guidelines" in content:
                context["special_instructions"] = self._extract_section(content, "## Development Guidelines")
            elif "## Instructions" in content:
                context["special_instructions"] = self._extract_section(content, "## Instructions")
                
            return context
            
        except Exception as e:
            print(f"Warning: Could not parse {file_path}: {e}")
            
        return {}
    
    def _parse_dependency_file(self, file_path: Path) -> Dict[str, Any]:
        """Parse dependency files to infer technology stack."""
        context = {}
        
        if file_path.name == 'package.json':
            context.update(self._parse_package_json(file_path))
        elif file_path.name == 'requirements.txt':
            context["project_type"] = "python_application"
            context["technology_stack"] = ["python"]
        elif file_path.name == 'Cargo.toml':
            context["project_type"] = "rust_application"
            context["technology_stack"] = ["rust"]
        elif file_path.name == 'pom.xml':
            context["project_type"] = "java_application"
            context["technology_stack"] = ["java"]
            
        return context
    
    def _parse_package_json(self, file_path: Path) -> Dict[str, Any]:
        """Parse package.json for Node.js projects."""
        try:
            with open(file_path, 'r') as f:
                package = json.load(f)
                
            context = {
                "project_type": "nodejs_application",
                "technology_stack": ["javascript", "node.js"]
            }
            
            # Check for specific frameworks
            dependencies = {**package.get("dependencies", {}), **package.get("devDependencies", {})}
            
            if "react" in dependencies:
                context["technology_stack"].append("react")
                context["project_type"] = "react_application"
            elif "vue" in dependencies:
                context["technology_stack"].append("vue")
                context["project_type"] = "vue_application"
            elif "angular" in dependencies:
                context["technology_stack"].append("angular")
                context["project_type"] = "angular_application"
                
            if "typescript" in dependencies:
                context["technology_stack"].append("typescript")
                
            return context
            
        except Exception as e:
            print(f"Warning: Could not parse package.json: {e}")
            
        return {}
    
    def _extract_section(self, content: str, header: str) -> str:
        """Extract content from a markdown section."""
        lines = content.split('\n')
        section_lines = []
        in_section = False
        
        for line in lines:
            if line.startswith(header):
                in_section = True
                continue
            elif in_section and line.startswith('##'):
                break
            elif in_section:
                section_lines.append(line)
                
        return '\n'.join(section_lines).strip()
    
    def _extract_context_from_json(self, config: Dict) -> Dict[str, Any]:
        """Extract context from generic JSON configuration."""
        return {
            "project_type": config.get("type", config.get("project_type", "unknown")),
            "technology_stack": config.get("technologies", config.get("stack", [])),
            "business_domain": config.get("domain", config.get("business_domain", "general"))
        }
    
    def get_context_summary(self) -> str:
        """Get a formatted summary of project context."""
        summary = f"""
PROJECT CONTEXT ANALYSIS:
- Project: {self.context['project_name']}
- Type: {self.context['project_type']}
- Technologies: {', '.join(self.context['technology_stack'])}
- Domain: {self.context['business_domain']}

SPECIAL INSTRUCTIONS:
{self.context['special_instructions']}

CONSTRAINTS:
{chr(10).join(f"- {constraint}" for constraint in self.context['constraints'])}

GOALS:
{chr(10).join(f"- {goal}" for goal in self.context['goals'])}
"""
        return summary.strip()


class PromptLoader:
    """Loads and manages agent prompts with project context integration."""
    
    def __init__(self, prompts_dir: str = None):
        self.prompts_dir = Path(prompts_dir) if prompts_dir else Path(__file__).parent.parent.parent / "archive" / "prompts"
        self.context = None
        
    def set_project_context(self, context: ProjectContext):
        """Set project context for prompt customization."""
        self.context = context
        
    def load_prompt(self, agent_type: str, enhanced: bool = True) -> str:
        """Load agent prompt with project context integration."""
        # Determine prompt file
        if enhanced:
            prompt_file = self.prompts_dir / f"{agent_type}_enhanced.md"
            if not prompt_file.exists():
                prompt_file = self.prompts_dir / f"{agent_type}.md"
        else:
            prompt_file = self.prompts_dir / f"{agent_type}.md"
            
        if not prompt_file.exists():
            raise FileNotFoundError(f"Prompt file not found: {prompt_file}")
            
        # Load base prompt
        base_prompt = prompt_file.read_text()
        
        # Integrate project context if available
        if self.context:
            context_prompt = self._build_context_prompt()
            enhanced_prompt = f"{context_prompt}\n\n{base_prompt}"
            return enhanced_prompt
            
        return base_prompt
    
    def _build_context_prompt(self) -> str:
        """Build project context prompt section."""
        if not self.context:
            return ""
            
        context_summary = self.context.get_context_summary()
        
        context_prompt = f"""
PROJECT CONTEXT AWARENESS:
You are working on the "{self.context.context['project_name']}" project.
Before executing any tasks, consider this project context:

{context_summary}

INTEGRATION REQUIREMENTS:
- Follow project-specific coding standards and conventions
- Respect technology stack constraints and best practices
- Align implementations with business domain requirements
- Adhere to any special instructions or constraints
- Work towards stated project goals

This context should inform all your decisions, recommendations, and implementations.
"""
        return context_prompt.strip()
    
    def get_available_prompts(self) -> List[str]:
        """Get list of available agent prompts."""
        prompts = []
        
        for prompt_file in self.prompts_dir.glob("*.md"):
            if prompt_file.name != "README.md":
                agent_name = prompt_file.stem
                if agent_name.endswith("_enhanced"):
                    agent_name = agent_name[:-9]  # Remove "_enhanced" suffix
                    
                if agent_name not in prompts:
                    prompts.append(agent_name)
                    
        return sorted(prompts)
    
    def validate_prompt(self, prompt: str) -> Dict[str, bool]:
        """Validate prompt has required elements."""
        validation = {
            "has_role_definition": "ROLE:" in prompt or "## ROLE" in prompt,
            "has_setup_instructions": "register_agent" in prompt,
            "has_message_format": any(fmt in prompt for fmt in ["FORMAT:", "ENVELOPE:", "json"]),
            "has_workflow_steps": any(word in prompt for word in ["WORKFLOW:", "PROTOCOL:", "STEPS:"]),
            "has_end_marker": "[[END-OF-TURN]]" in prompt,
            "has_channel_usage": any(ch in prompt for ch in ["a2e", "e2a", "r2a", "status"])
        }
        
        return validation


def create_project_context_template():
    """Create a template project context file."""
    template = """
# Project Context Configuration
# This file helps AI agents understand your project scope and requirements

project_type: "web_application"  # web_application, backend_api, frontend_application, mobile_application, etc.

technology_stack:
  - python
  - fastapi
  - postgresql
  - redis
  - docker

business_domain: "financial_technology"  # fintech, healthcare, e-commerce, education, etc.

coding_standards:
  style_guide: "PEP8"
  max_line_length: 88
  docstring_style: "Google"
  type_hints: true
  test_coverage_threshold: 80

special_instructions: |
  This is a financial modeling application that requires:
  - Strict security compliance (SOX, PCI-DSS)
  - High performance for real-time calculations
  - Comprehensive audit logging
  - Zero-downtime deployment capability
  
  Special considerations:
  - All financial calculations must be decimal-precise
  - User data must be encrypted at rest and in transit
  - API rate limiting is required for all endpoints
  - Database transactions must be ACID compliant

constraints:
  - "No external API calls without explicit approval"
  - "All database migrations must be reversible"
  - "Performance degradation >10% requires architectural review"
  - "Security vulnerabilities must be fixed within 24 hours"

goals:
  - "Achieve 99.9% uptime SLA"
  - "Support 10,000 concurrent users"
  - "Complete financial model calculations in <100ms"
  - "Maintain SOC 2 Type II compliance"

# Integration settings
integrations:
  github:
    repository: "company/financial-model"
    default_branch: "main"
    require_pr_reviews: true
    
  security:
    enable_sast: true
    enable_dependency_scanning: true
    vulnerability_threshold: "medium"
    
  performance:
    enable_profiling: true
    response_time_threshold: "200ms"
    memory_threshold: "512MB"
"""
    
    return template.strip()


if __name__ == "__main__":
    # Example usage
    project_context = ProjectContext("/home/alex/projects/fin-model")
    prompt_loader = PromptLoader()
    prompt_loader.set_project_context(project_context)
    
    print("📋 Project Context:")
    print(project_context.get_context_summary())
    
    print(f"\n🎭 Available Prompts:")
    for prompt_name in prompt_loader.get_available_prompts():
        print(f"  - {prompt_name}")
    
    # Example: Load enhanced architect prompt with project context
    try:
        architect_prompt = prompt_loader.load_prompt("architect", enhanced=True)
        print(f"\n✅ Loaded architect prompt: {len(architect_prompt)} characters")
        
        validation = prompt_loader.validate_prompt(architect_prompt)
        print(f"📊 Prompt validation: {sum(validation.values())}/{len(validation)} checks passed")
        
    except FileNotFoundError as e:
        print(f"❌ {e}")