# Cannot Connect to Docker Daemon

## Error Message
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

## Symptoms
- All docker commands fail
- Docker CLI cannot reach the daemon

## Root Cause
Docker daemon is not running, or current user lacks permission to access the socket.

## Possible Reasons
- Docker service stopped
- User not in docker group
- Socket file permissions wrong

## Diagnostic Commands
```bash
sudo systemctl status docker
ls -la /var/run/docker.sock
groups $USER
```

## Fix Steps
1. Start Docker: sudo systemctl start docker
2. Add user to docker group: sudo usermod -aG docker $USER
3. Re-login or run: newgrp docker

## Severity
Critical

## Prevention
- Validate configuration before deployment
- Use docker-compose healthchecks for service dependencies
- Monitor container resource usage and logs
