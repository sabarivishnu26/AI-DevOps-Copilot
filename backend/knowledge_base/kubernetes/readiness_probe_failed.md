# Readiness Probe Failed

## Error Message
```
Warning  Unhealthy  pod/my-app  Readiness probe failed: HTTP probe failed with statuscode: 503
Warning  Unhealthy  Readiness probe failed: Get "http://10.0.0.1:8080/health": dial tcp: connection refused
```

## Symptoms
- Pod is Running but never becomes Ready (0/1 READY)
- Traffic is not routed to the pod
- `kubectl describe pod` shows Readiness probe failures

## Root Cause
The container is running but the application inside is not healthy enough to serve traffic yet.

## Possible Reasons
- Application still starting up (startup time > initialDelaySeconds)
- Application crashed internally but process is still running
- Health check endpoint returns non-200 status
- Wrong port or path configured in probe
- Database not ready, app returns 503

## Diagnostic Commands
```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
kubectl exec -it <pod-name> -- curl localhost:8080/health
```

## Fix Steps
1. Check what the health endpoint returns: `kubectl exec -it <pod-name> -- curl -v localhost:<port>/health`
2. Increase `initialDelaySeconds` if app is slow to start:
```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```
3. Fix the health endpoint to return 200 when ready
4. Check app logs for internal errors

## Severity
Medium

## Prevention
- Set `initialDelaySeconds` based on actual startup time
- Implement proper health check endpoints in your app
- Use startupProbe for slow-starting apps
