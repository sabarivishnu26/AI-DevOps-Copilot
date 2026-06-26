# Liveness Probe Failed

## Error Message
```
Warning  Unhealthy  pod/my-app  Liveness probe failed: HTTP probe failed with statuscode: 500
Warning  Killing    pod/my-app  Container my-app failed liveness probe, will be restarted
```

## Symptoms
- Container is repeatedly killed and restarted
- `kubectl describe pod` shows liveness probe failures before restart
- Application was working but became unresponsive

## Root Cause
Kubernetes determines the container is no longer alive/healthy and kills it.

## Possible Reasons
- Application deadlock or frozen state
- Memory leak causing slow responses
- liveness probe timeout too low
- Wrong probe endpoint or port
- Temporary spike causing slow response

## Diagnostic Commands
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name> --previous
kubectl get events -n <namespace>
```

## Fix Steps
1. Check previous container logs: `kubectl logs <pod-name> --previous`
2. Increase timeout and failure threshold:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```
3. Fix the underlying application issue (deadlock, memory leak)

## Severity
High

## Prevention
- Set conservative timeoutSeconds (5-10s)
- Monitor application response times
- Implement proper deadlock detection in app
