# Service Not Reachable / Connection Refused

## Error Message
```
curl: (7) Failed to connect to my-service port 80: Connection refused
dial tcp 10.96.0.1:80: connect: connection refused
```

## Symptoms
- Service is created but cannot be reached
- Pods cannot communicate with each other through service
- External traffic cannot reach the application

## Root Cause
The Kubernetes service is not routing traffic to healthy pods.

## Possible Reasons
- Service selector doesn't match pod labels
- No healthy pods (all pods failing readiness probe)
- Wrong port mapping in service spec
- NetworkPolicy blocking traffic
- Service type mismatch (ClusterIP vs NodePort vs LoadBalancer)

## Diagnostic Commands
```bash
kubectl get svc -n <namespace>
kubectl describe svc <service-name> -n <namespace>
kubectl get endpoints <service-name> -n <namespace>
kubectl get pods --show-labels -n <namespace>
```

## Fix Steps
1. Check endpoints: `kubectl get endpoints <service-name>` — if empty, selector doesn't match
2. Compare service selector with pod labels:
```bash
kubectl describe svc <service-name> | grep Selector
kubectl get pods --show-labels
```
3. Fix the selector in service YAML to match pod labels
4. Verify port numbers match between service and container

## Severity
High

## Prevention
- Use consistent label naming conventions
- Test service connectivity right after deployment
