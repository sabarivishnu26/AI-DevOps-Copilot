# OOMKilled — Out of Memory Killed

## Error Message
```
State: Terminated
Reason: OOMKilled
Exit Code: 137
Last State: Terminated Reason: OOMKilled
```

## Symptoms
- Pod shows `OOMKilled` in `kubectl describe pod`
- Exit code 137
- Pod keeps restarting (often leads to CrashLoopBackOff)
- Container is killed suddenly with no application error

## Root Cause
The container exceeded its memory limit. Linux OOM killer terminated the process to protect the node.

## Possible Reasons
- Memory limit set too low for the application's actual usage
- Memory leak in the application
- Sudden spike in traffic causing high memory usage
- Large data processing job consuming more memory than expected
- No memory limit set and node ran out of memory

## Diagnostic Commands
```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl top pod <pod-name> -n <namespace>
kubectl top node
kubectl get pod <pod-name> -o yaml | grep -A5 resources
```

## Fix Steps
1. Check current memory usage: `kubectl top pod <pod-name>`
2. Increase memory limit in deployment:
```yaml
resources:
  requests:
    memory: "256Mi"
  limits:
    memory: "512Mi"
```
3. Apply the change: `kubectl apply -f deployment.yaml`
4. If memory leak: profile the application — add memory profiling tools
5. Verify after fix: `kubectl top pod` for a few minutes

## Severity
High

## Prevention
- Always set memory requests AND limits
- Set limits 2x the normal usage to handle spikes
- Monitor memory usage with Prometheus/Grafana
- Add HPA (Horizontal Pod Autoscaler) for traffic spikes
