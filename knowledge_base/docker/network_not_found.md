# Docker Network Not Found

## Error Message
```
Error response from daemon: network my-network not found
```

## Symptoms
- Container fails to connect to network
- docker-compose up fails
- Services cannot communicate

## Root Cause
The referenced Docker network does not exist.

## Possible Reasons
- Network was deleted
- docker-compose network not created yet
- Typo in network name
- Running containers on different networks

## Diagnostic Commands
```bash
docker network ls
docker network inspect <network-name>
docker-compose ps
```

## Fix Steps
1. Create the network: docker network create my-network
2. Use docker-compose which auto-creates networks
3. Check network name spelling in docker-compose.yml

## Severity
Medium

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
