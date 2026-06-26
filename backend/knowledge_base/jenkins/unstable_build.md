# Build Marked Unstable

## Error Message
```
Build step 'Publish JUnit test result report' changed build result to UNSTABLE
Finished: UNSTABLE
```

## Root Cause
Build completed but with warnings — typically test failures that don't fail the build.

## Possible Reasons
- Test failures configured as warnings
- Code coverage below threshold
- Static analysis issues

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
Medium

## Prevention
- Use Jenkinsfile linting before committing
- Monitor Jenkins agent disk usage
- Test pipeline stages locally when possible
- Keep Jenkins and plugins updated
