# SCM Checkout Failed

## Error Message
```
ERROR: Error cloning remote repo 'origin'
fatal: unable to access 'https://github.com/org/repo': Failed to connect
```

## Root Cause
Jenkins cannot clone or checkout the source code repository.

## Possible Reasons
- Git credentials not configured
- SSH key missing or wrong
- Network issue to Git server
- Wrong branch name

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
