# Volume Mount Failed

## Error Message
```
Error response from daemon: invalid mount config for type bind: bind source path does not exist
```

## Symptoms
- Container fails to start
- Volume mount error
- Files not accessible inside container

## Root Cause
The host path being mounted does not exist or has wrong permissions.

## Possible Reasons
- Host path does not exist
- Permission denied on host directory
- SELinux blocking mount
- Wrong path in docker-compose volume spec

## Diagnostic Commands
```bash
docker inspect <container-id>
ls -la <host-path>
docker run -v <path>:<path> <image>
```

## Fix Steps
1. Create the host directory: mkdir -p /path/to/dir
2. Fix permissions: chmod 755 /path/to/dir
3. Use named volumes instead of bind mounts
4. Check docker-compose volume syntax

## Severity
High

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
