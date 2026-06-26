# Docker Not Found on Agent

## Error Message
```
docker: command not found
ERROR: script returned exit code 127
```

## Root Cause
Docker is not installed or not in PATH on the Jenkins agent.

## Possible Reasons
- Docker not installed on agent
- Docker not in agent PATH
- Wrong agent selected for Docker job

## Diagnostic Steps
```
1. Open the failed build in Jenkins UI
2. Click "Console Output" to see full logs
3. Search for ERROR, FAILED, or Exception in logs
4. Check agent status in Jenkins > Manage Jenkins > Nodes
```

## Fix Steps
1. Read the Console Output for the full error context
2. Check Jenkins system logs: Manage Jenkins > System Log
3. Verify all credentials and plugins are configured
4. Apply fix and rebuild: click "Build Now" or "Rebuild"

## Severity
High

## Prevention
- Use Jenkinsfile linting before committing
- Monitor Jenkins agent disk usage
- Test pipeline stages locally when possible
- Keep Jenkins and plugins updated
