# ConfigMap or Secret Not Found

## Error Message
```
Error: configmap "app-config" not found
Error: secret "db-credentials" not found
MountVolume.SetUp failed: configmap "app-config" not found
```

## Symptoms
- Pod fails to start
- Error about missing ConfigMap or Secret
- Volume mount failure in pod events

## Root Cause
Pod references a ConfigMap or Secret that doesn't exist in the same namespace.

## Possible Reasons
- ConfigMap/Secret created in wrong namespace
- Typo in the name reference
- ConfigMap deleted but pod still references it
- Deployment order issue — pod deployed before ConfigMap

## Diagnostic Commands
```bash
kubectl get configmap -n <namespace>
kubectl get secret -n <namespace>
kubectl describe pod <pod-name> -n <namespace>
```

## Fix Steps
1. List all ConfigMaps: `kubectl get configmap -n <namespace>`
2. Create missing ConfigMap:
```bash
kubectl create configmap app-config --from-file=config.yaml -n <namespace>
```
3. Or create from literals:
```bash
kubectl create configmap app-config --from-literal=DB_HOST=localhost -n <namespace>
```
4. Verify namespace matches pod namespace

## Severity
High

## Prevention
- Deploy ConfigMaps and Secrets before Deployments
- Use Helm or Kustomize to manage deploy order
- Keep ConfigMaps and pods in the same namespace
