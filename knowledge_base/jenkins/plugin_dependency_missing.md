# Plugin Missing or Incompatible

## Error Message
```
java.lang.NoSuchMethodError: No such DSL method 'docker'
Required plugin: docker-workflow not installed
```

## Root Cause
A Jenkins plugin required by the pipeline is not installed or is the wrong version.

## Possible Reasons
- Plugin not installed
- Plugin version incompatible with Jenkins version
- Plugin disabled

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
