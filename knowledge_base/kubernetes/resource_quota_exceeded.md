# ResourceQuota Exceeded

## Error Message
```
Error from server (Forbidden): pods "my-app" is forbidden: exceeded quota: my-quota,
requested: cpu=500m, used: cpu=1900m, limited: cpu=2000m
```

## Symptoms
- Cannot create new pods or deployments
- Forbidden error when applying manifests
- New resources fail to create

## Root Cause
The namespace has a ResourceQuota and the new resource would exceed it.

## Diagnostic Commands
```bash
kubectl get resourcequota -n <namespace>
kubectl describe resourcequota -n <namespace>
kubectl top pods -n <namespace>
```

## Fix Steps
1. Check current quota usage: `kubectl describe resourcequota -n <namespace>`
2. Delete unused resources to free quota
3. Request quota increase from cluster admin
4. Reduce resource requests in your deployment

## Severity
Medium

## Prevention
- Monitor quota usage with alerts
- Set resource requests accurately
- Plan quota before deploying new services
