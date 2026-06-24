# CrashLoopBackOff

## Error Message
```
Back-off restarting failed container
Warning  BackOff  pod/my-app  Back-off restarting failed container
```

## Symptoms
- Pod status shows `CrashLoopBackOff`
- Pod restarts repeatedly (RESTARTS column keeps increasing)
- `kubectl get pods` shows STATUS as CrashLoopBackOff

## Root Cause
The container starts, crashes immediately, and Kubernetes keeps restarting it with exponential backoff. The container itself is exiting with a non-zero exit code.

## Possible Reasons
- Application code throws an unhandled exception on startup
- Missing or incorrect environment variables
- Wrong command or entrypoint in Dockerfile
- Port mismatch between app and container spec
- Missing Kubernetes secrets or ConfigMaps
- Database connection failure on startup
- Insufficient memory — container gets OOMKilled before it starts
- Incorrect file permissions inside the container

## Diagnostic Commands
```bash
kubectl get pods -n <namespace>
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --previous
kubectl get events -n <namespace> --sort-by='.lastTimestamp'
```

## Fix Steps
1. Check logs first: `kubectl logs <pod-name> --previous` — the actual error is always in the logs
2. Verify all environment variables and secrets exist: `kubectl get secret <secret-name> -o yaml`
3. Confirm the Docker entrypoint/command is correct
4. Check resource limits — increase memory if OOMKilled
5. Verify the app can connect to its dependencies (DB, Redis, etc.)

## Severity
High

## Prevention
- Always test Docker image locally before deploying
- Add startup probes to detect slow-starting apps
- Use `readinessProbe` to prevent traffic before app is ready
