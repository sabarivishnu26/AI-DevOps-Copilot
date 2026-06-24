# Docker Compose Service Dependency Failed

## Error Message
```
Service 'api' failed to build: dependency 'db' is not ready
```

## Symptoms
- Services start in wrong order
- App fails because database not ready
- depends_on not working as expected

## Root Cause
docker-compose depends_on only waits for container start, not service readiness.

## Possible Reasons
- Database takes time to initialize
- depends_on does not wait for health
- No healthcheck defined

## Diagnostic Commands
```bash
docker-compose logs db
docker-compose ps
docker inspect <db-container>
```

## Fix Steps
1. Add healthcheck to db service
2. Use depends_on with condition: service_healthy
3. Add retry logic in application startup

## Severity
Medium

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
