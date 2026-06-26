# HPA Unable to Scale / Metrics Not Available

## Error Message
```
Warning  FailedGetScale  horizontalpodautoscaler/my-app  unable to get metrics for resource cpu
Warning  FailedComputeMetricsReplicas  failed to get cpu utilization: unable to get metrics
```

## Symptoms
- HPA created but pod count never changes
- `kubectl get hpa` shows `<unknown>` for current metrics
- Autoscaling not working

## Root Cause
HPA cannot retrieve metrics — usually metrics-server is not installed or resource requests are not set.

## Possible Reasons
- metrics-server not installed in the cluster
- Resource requests not set on pods (HPA needs requests to calculate utilization)
- Custom metrics adapter not configured
- RBAC issues preventing metrics access

## Diagnostic Commands
```bash
kubectl get hpa -n <namespace>
kubectl describe hpa <hpa-name> -n <namespace>
kubectl top pods -n <namespace>
kubectl get apiservices | grep metrics
```

## Fix Steps
1. Check if metrics-server is running: `kubectl get pods -n kube-system | grep metrics-server`
2. Install metrics-server if missing:
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```
3. Add resource requests to your deployment:
```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
```

## Severity
Medium

## Prevention
- Install metrics-server as part of cluster setup
- Always set CPU/memory requests when using HPA
