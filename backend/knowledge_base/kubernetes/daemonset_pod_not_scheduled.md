# daemonset pod not scheduled

## Error Message
```
Error related to daemonset pod not scheduled
```

## Symptoms
- Issue observed with daemonset pod not scheduled
- Pod or workload affected by this condition

## Root Cause
Kubernetes issue related to daemonset pod not scheduled configuration or cluster state.

## Possible Reasons
- Misconfiguration in cluster or workload spec
- Resource constraints on nodes
- Network or storage connectivity issue
- RBAC or permission misconfiguration

## Diagnostic Commands
```bash
kubectl get pods --all-namespaces
kubectl describe pod <pod-name>
kubectl get events --sort-by='.lastTimestamp'
kubectl logs <pod-name> --previous
kubectl describe node <node-name>
```

## Fix Steps
1. Run diagnostic commands to identify the specific error
2. Check cluster events: kubectl get events -n <namespace>
3. Review pod and node logs for root cause
4. Apply fix based on identified root cause
5. Verify: kubectl get pods -w to watch recovery

## Severity
Medium

## Prevention
- Monitor cluster health regularly with Prometheus
- Set up alerts for common failure patterns
- Follow Kubernetes best practices for workload configuration
- Use pod disruption budgets and resource limits
