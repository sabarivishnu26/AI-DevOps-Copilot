# RBAC Forbidden / Unauthorized

## Error Message
```
Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:default:my-sa"
cannot list resource "pods" in API group "" in the namespace "production"
```

## Symptoms
- Operations fail with Forbidden error
- Service account cannot access resources
- kubectl commands return 403

## Root Cause
The service account or user does not have the required RBAC permissions.

## Diagnostic Commands
```bash
kubectl auth can-i list pods --as=system:serviceaccount:default:my-sa -n <namespace>
kubectl get rolebinding,clusterrolebinding -n <namespace>
kubectl describe rolebinding <name> -n <namespace>
```

## Fix Steps
1. Check what permissions exist: `kubectl get rolebinding -n <namespace>`
2. Create a Role and RoleBinding:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: ServiceAccount
  name: my-sa
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## Severity
High

## Prevention
- Follow least privilege principle
- Document required permissions for each service
