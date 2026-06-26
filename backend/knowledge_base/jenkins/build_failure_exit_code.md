# Build Failed - Non-zero Exit Code

## Error Message
```
Build step 'Execute shell' marked build as failure
Finished: FAILURE
Script returned exit code 1
```

## Root Cause
A shell command or script in the build step returned a non-zero exit code.

## Possible Reasons
- Shell script error or exception
- Test failure
- Compilation error
- Missing dependency

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
