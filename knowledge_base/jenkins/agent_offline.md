# Jenkins Agent Offline / Disconnected

## Error Message
```
ERROR: [Office hours] agent is offline
Waiting for next available executor on agent 'my-agent'
```

## Root Cause
The Jenkins agent that the job is configured to run on is offline.

## Possible Reasons
- Agent machine is down
- Java process on agent crashed
- Network connectivity issue
- Agent needs restart

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
