# Container Healthcheck Failed

## Error Message
```
unhealthy
health status changed to unhealthy
```

## Symptoms
- Container shows 'unhealthy' status
- docker ps shows (unhealthy)
- Load balancer stops routing to container

## Root Cause
The Docker healthcheck command is returning a non-zero exit code.

## Possible Reasons
- Application not ready yet
- Healthcheck timeout too low
- Wrong healthcheck command
- Application crashed internally

## Diagnostic Commands
```bash
docker inspect --format='{{json .State.Health}}' <container>
docker logs <container>
docker exec <container> <healthcheck-command>
```

## Fix Steps
1. Increase healthcheck interval and retries in Dockerfile
2. Test the healthcheck command manually inside the container
3. Fix the application health endpoint

## Severity
High

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
