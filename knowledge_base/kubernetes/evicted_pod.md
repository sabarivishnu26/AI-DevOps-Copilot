# Pod Evicted

## Error Message
```
STATUS    REASON
Evicted   The node was low on resource: memory. Threshold quantity: 100Mi, available: 50Mi.
Evicted   The node had condition: [DiskPressure]
```

## Symptoms
- Pod status shows `Evicted`
- Pod was running but suddenly terminated
- Multiple pods evicted at the same time

## Root Cause
Kubernetes evicted the pod to reclaim resources on a node under pressure (memory, disk, or CPU).

## Possible Reasons
- Node running out of memory (MemoryPressure)
- Node disk is full (DiskPressure)
- Too many pods on a single node
- No resource requests set — pod treated as low priority

## Diagnostic Commands
```bash
kubectl get pods --all-namespaces | grep Evicted
kubectl describe pod <pod-name>
kubectl describe node <node-name>
kubectl top node
df -h  # on the node
```

## Fix Steps
1. Clean up evicted pods: `kubectl get pods | grep Evicted | awk '{print $1}' | xargs kubectl delete pod`
2. Check node pressure: `kubectl describe node <node-name>` → look at Conditions
3. If DiskPressure: clean up unused Docker images on node `docker image prune -a`
4. Set resource requests so scheduler distributes pods better
5. Add more nodes or increase node size

## Severity
Medium

## Prevention
- Always set resource requests and limits
- Set up node auto-scaling
- Monitor disk usage on nodes
- Use PodDisruptionBudgets
