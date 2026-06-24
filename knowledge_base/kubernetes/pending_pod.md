# Pod Stuck in Pending State

## Error Message
```
NAME       READY   STATUS    RESTARTS   AGE
my-app     0/1     Pending   0          10m
```

## Symptoms
- Pod stays in `Pending` state indefinitely
- Never transitions to Running
- No containers are started

## Root Cause
Kubernetes scheduler cannot find a suitable node to schedule the pod.

## Possible Reasons
- Insufficient CPU or memory on all nodes
- Node selector or affinity rules don't match any node
- Taints on nodes without matching tolerations
- PersistentVolumeClaim not bound
- No nodes available in the cluster

## Diagnostic Commands
```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get nodes
kubectl describe node <node-name>
kubectl get events -n <namespace>
kubectl get pvc -n <namespace>
```

## Fix Steps
1. Check events: `kubectl describe pod <pod-name>` → look at Events section
2. If insufficient resources: scale the node group or reduce resource requests
3. If node selector mismatch: check node labels `kubectl get nodes --show-labels`
4. If PVC issue: `kubectl get pvc` → check if Bound
5. If taint issue: add toleration to pod spec or remove taint from node

## Severity
High

## Prevention
- Set realistic resource requests
- Use pod disruption budgets
- Monitor cluster resource utilization
