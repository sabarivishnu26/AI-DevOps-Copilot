# Container Exits Immediately

## Error Message
```
CONTAINER ID   STATUS
abc123         Exited (1) 2 seconds ago
```

## Symptoms
- docker run starts but container stops immediately
- docker ps shows no running containers
- Exit code is non-zero

## Root Cause
The main process inside the container exited, so the container stopped.

## Possible Reasons
- CMD/ENTRYPOINT command fails or exits immediately
- Application crashes on startup
- Missing environment variables
- Port already in use

## Diagnostic Commands
```bash
docker ps -a
docker logs <container-id>
docker run -it --entrypoint /bin/sh <image>
```

## Fix Steps
1. Check logs: docker logs <container-id>
2. Run interactively: docker run -it --entrypoint /bin/sh <image>
3. Verify CMD is a long-running process
4. Check all environment variables are set

## Severity
High

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
