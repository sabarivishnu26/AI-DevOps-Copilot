# ImagePullBackOff / ErrImagePull

## Error Message
```
Failed to pull image "myrepo/myapp:latest": rpc error: code = Unknown
Warning  Failed  pod/my-app  Failed to pull image: ErrImagePull
Back-off pulling image "myrepo/myapp:latest"
```

## Symptoms
- Pod status shows `ImagePullBackOff` or `ErrImagePull`
- Pod never reaches Running state
- `kubectl describe pod` shows image pull failure events

## Root Cause
Kubernetes cannot pull the container image from the registry. Either the image doesn't exist, the tag is wrong, or credentials are missing.

## Possible Reasons
- Image name or tag is misspelled (e.g., `myapp:lastest` instead of `myapp:latest`)
- Image does not exist in the registry
- Private registry requires authentication but no imagePullSecret is configured
- Registry is temporarily unavailable or rate-limited (Docker Hub rate limits)
- Wrong registry URL
- Image was deleted from registry

## Diagnostic Commands
```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -n <namespace>
kubectl get secret <secret-name> -o yaml
docker pull <image-name>  # test locally
```

## Fix Steps
1. Verify image name and tag: `kubectl describe pod <pod-name>` → check Image field
2. Pull the image manually to verify it exists: `docker pull <image>:<tag>`
3. For private registries, create an imagePullSecret:
```bash
kubectl create secret docker-registry regcred \
  --docker-server=<registry-url> \
  --docker-username=<username> \
  --docker-password=<password>
```
4. Add the secret to your pod spec:
```yaml
spec:
  imagePullSecrets:
  - name: regcred
```
5. If Docker Hub rate limit: authenticate with Docker Hub or use a different registry mirror

## Severity
High

## Prevention
- Always use specific image tags (never `latest` in production)
- Store imagePullSecrets in the same namespace as the pod
- Use a private registry mirror to avoid rate limits
