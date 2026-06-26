# Registry Authentication Failed

## Error Message
```
Error response from daemon: pull access denied, repository does not exist or may require 'docker login'
```

## Symptoms
- Cannot pull private images
- Authentication error on docker pull
- docker push fails

## Root Cause
Docker is not authenticated to the container registry.

## Possible Reasons
- Not logged in to registry
- Credentials expired
- Wrong registry URL
- No access to private repository

## Diagnostic Commands
```bash
docker login <registry-url>
cat ~/.docker/config.json
docker pull <image>
```

## Fix Steps
1. Login to registry: docker login registry.example.com
2. For AWS ECR: aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
3. Verify credentials have access to the repository

## Severity
High

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
