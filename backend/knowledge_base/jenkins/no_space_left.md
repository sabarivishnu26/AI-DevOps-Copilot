# Jenkins Workspace Out of Disk Space

## Error Message
```
java.io.IOException: No space left on device
ERROR: Build step failed with exception
```

## Root Cause
Jenkins server or agent has run out of disk space.

## Possible Reasons
- Old workspaces not cleaned
- Build artifacts accumulating
- Log files filling disk
- Docker images on agent

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
Critical

## Prevention
- Use Jenkinsfile linting before committing
- Monitor Jenkins agent disk usage
- Test pipeline stages locally when possible
- Keep Jenkins and plugins updated
