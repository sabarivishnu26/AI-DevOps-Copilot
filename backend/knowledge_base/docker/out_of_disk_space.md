# Docker Out of Disk Space

## Error Message
```
no space left on device
Error response from daemon: mkdir /var/lib/docker/overlay2/...: no space left on device
```

## Symptoms
- Docker builds fail
- Containers fail to start
- df -h shows disk at 100%

## Root Cause
Docker has consumed all available disk space with images, containers, volumes, or build cache.

## Possible Reasons
- Accumulated unused images
- Stopped containers not cleaned up
- Build cache consuming space
- Large volumes

## Diagnostic Commands
```bash
df -h
docker system df
docker images
docker ps -a
```

## Fix Steps
1. Check Docker disk usage: docker system df
2. Remove stopped containers: docker container prune
3. Remove unused images: docker image prune -a
4. Full cleanup: docker system prune -a --volumes

## Severity
Critical

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
