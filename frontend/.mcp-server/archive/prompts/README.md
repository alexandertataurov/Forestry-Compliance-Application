# Agent Prompts Collection

This directory contains comprehensive, production-ready prompts for various specialized AI agents in the Cursor Automation workflow system.

## 📋 Available Agent Prompts

### Core Workflow Agents

#### Basic Prompts (Legacy)
- **architect.md** - Basic architect agent (minimal)
- **executor.md** - Basic executor agent (minimal)  
- **reviewer.md** - Basic reviewer agent (minimal)

#### Enhanced Prompts (Production-Ready)
- **architect_enhanced.md** - Strategic task planning and coordination
- **executor_enhanced.md** - Safe implementation with comprehensive testing
- **reviewer_enhanced.md** - Quality assurance and security review

### Specialized Agents

#### Development Lifecycle
- **github_agent.md** - Git operations, PR management, CI/CD coordination
- **security_specialist.md** - Vulnerability assessment and security compliance
- **performance_optimizer.md** - Performance analysis and optimization

## 🎭 Agent Roles Overview

| Agent | Primary Focus | Key Responsibilities | Channel Pattern |
|-------|---------------|---------------------|-----------------|
| **Architect** | Strategic Planning | Task decomposition, coordination, quality gates | `a2e`, `a2r`, `a2g` |
| **Executor** | Implementation | Safe coding, testing, documentation | `e2a`, `e2r` |
| **Reviewer** | Quality Assurance | Code review, security analysis, compliance | `r2a`, `r2g` |
| **GitHub** | DevOps Operations | Git operations, CI/CD, deployment | `g2a`, `g2r` |
| **Security** | Cybersecurity | Vulnerability assessment, threat modeling | `s2a`, `s2r` |
| **Performance** | Optimization | Profiling, load testing, scalability | `p2a`, `p2r` |

## 🏗️ Prompt Structure

Each enhanced prompt follows a consistent structure:

### 1. Role Definition
Clear description of the agent's purpose and responsibilities

### 2. Setup & Registration
MCP registration commands and channel configuration

### 3. Protocol & Workflow
Step-by-step process for handling tasks and communication

### 4. Message Format
Structured JSON envelopes for consistent communication

### 5. Best Practices
Guidelines for quality, security, and efficiency

### 6. Examples
Real-world interaction examples and use cases

### 7. Error Handling
Common scenarios and recovery procedures

## 📡 Communication Channels

### Channel Naming Convention
- `{source}2{destination}` - Point-to-point communication
- `status` - Broadcast updates and alerts
- Examples: `a2e` (architect to executor), `r2g` (reviewer to github)

### Message Flow Patterns

#### 2-Agent Workflow
```
User → Architect ← → Executor → Status
       ↓           ↗
     Planning   Results
```

#### 3-Agent Workflow  
```
User → Architect ← → Executor → Reviewer → Status
       ↓              ↓         ↓
     Planning    Implementation Review
```

#### 4-Agent Workflow
```
User → Architect ← → Executor → Reviewer → GitHub → Status
       ↓              ↓         ↓         ↓
     Planning    Implementation Review  Deployment
```

## 💡 Usage Guidelines

### Selecting Prompts
- **Basic Prompts**: Simple tasks, proof of concepts, development testing
- **Enhanced Prompts**: Production systems, enterprise environments, complex projects

### Customization
1. Copy the enhanced prompt as a starting point
2. Modify role responsibilities for your specific needs
3. Adjust message formats and channels as required
4. Update examples to match your domain and use cases

### Integration
```python
# Example: Loading custom prompt configuration
workflow_config = {
    "agents": {
        "architect": {
            "role": "architect",
            "prompt": load_prompt("architect_enhanced.md"),
            "channels": ["a2e", "e2a", "r2a", "status"]
        }
    }
}
```

## 🔧 Prompt Features

### Enhanced Prompts Include:
- ✅ **Comprehensive role definitions** with clear boundaries
- ✅ **Structured message formats** for consistency
- ✅ **Error handling procedures** for robustness
- ✅ **Security considerations** and best practices
- ✅ **Performance guidelines** and optimization tips
- ✅ **Real-world examples** and use cases
- ✅ **Escalation procedures** for complex scenarios
- ✅ **Quality standards** and metrics

### Message Envelope Standards:
```json
{
  "from": "agent_name",
  "task_id": "TASK-001",
  "intent": "plan|implement|review|deploy",
  "status": "success|pending|failed|blocked",
  "summary": "Brief description",
  "details": { /* agent-specific payload */ },
  "next_actions": ["action1", "action2"],
  "requires_input": false,
  "done": true
}
```

## 🎯 Best Practices

### Prompt Engineering
- **Be Specific**: Clear, actionable instructions
- **Include Context**: Relevant background and constraints
- **Define Success**: Measurable acceptance criteria
- **Handle Errors**: Graceful degradation and recovery
- **Stay Focused**: Single responsibility per agent

### Channel Management
- **Use Appropriate Channels**: Right agent for the right task
- **Monitor Message Flow**: Track conversation patterns
- **Prevent Loops**: Include termination conditions
- **Handle Timeouts**: Graceful handling of delayed responses

### Quality Assurance
- **Test Thoroughly**: Validate prompts with real scenarios
- **Iterate Based on Feedback**: Continuously improve based on results
- **Document Changes**: Track prompt evolution and reasoning
- **Share Knowledge**: Collaborate on prompt improvements

## 📈 Evolution & Maintenance

### Version Control
- Track prompt changes with clear commit messages
- Tag major versions for stability
- Document breaking changes and migration paths
- Maintain backward compatibility when possible

### Performance Monitoring
- Monitor agent response quality and accuracy
- Track task completion rates and efficiency
- Analyze common failure patterns
- Collect user feedback and satisfaction metrics

### Continuous Improvement
- Regular review and update cycles
- Incorporate lessons learned from production use
- Stay current with AI capabilities and best practices
- Share improvements with the community

## 🤝 Contributing

To add new agent prompts or improve existing ones:

1. Follow the established prompt structure
2. Include comprehensive examples and error handling
3. Test with real scenarios before submitting
4. Document the agent's role and responsibilities clearly
5. Ensure consistent channel usage and message formats

The goal is to create a comprehensive library of production-ready agent prompts that enable sophisticated multi-agent workflows for software development teams.