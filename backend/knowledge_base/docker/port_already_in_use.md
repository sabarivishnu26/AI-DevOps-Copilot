# Port Already in Use

## Error Message
```
Bind for 0.0.0.0:8080 failed: port is already allocated
```

## Symptoms
- Container fails to start
- Port binding error in output

## Root Cause
The host port being mapped is already in use by another process or container.

## Possible Reasons
- Previous container still running
- Another process using the same port
- Wrong port mapping in docker run command

## Diagnostic Commands
```bash
docker ps -a
lsof -i :<port>
netstat -tulpn | grep <port>
```

## Fix Steps
1. Find what is using the port: lsof -i :8080
2. Stop conflicting container: docker stop <container-id>
3. Use a different host port: docker run -p 8081:8080 myapp

## Severity
Medium

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
