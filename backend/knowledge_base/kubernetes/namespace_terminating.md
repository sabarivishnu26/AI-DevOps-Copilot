# Namespace Stuck in Terminating State

## Error Message
```
NAME         STATUS        AGE
my-namespace Terminating   30m
```

## Symptoms
- Namespace deletion command ran but namespace never fully deletes
- Resources inside still show up
- `kubectl delete namespace` hangs

## Root Cause
Kubernetes finalizers are preventing the namespace from being deleted.

## Possible Reasons
- Resources with finalizers that haven't been processed
- Custom resources (CRDs) with finalizers
- Controller managing a resource is not running

## Diagnostic Commands
```bash
kubectl get namespace <ns-name> -o yaml
kubectl api-resources --verbs=list --namespaced -o name | xargs -I {} kubectl get {} -n <ns-name>
```

## Fix Steps
1. Find stuck resources: `kubectl get all -n <namespace>`
2. Force remove finalizers from namespace:
```bash
kubectl get namespace <ns-name> -o json | \
  jq '.spec.finalizers = []' | \
  kubectl replace --raw "/api/v1/namespaces/<ns-name>/finalize" -f -
```
3. Delete any stuck CRDs manually

## Severity
Low

## Prevention
- Ensure custom controllers are running before deleting namespaces
- Remove finalizers before deleting CRDs
