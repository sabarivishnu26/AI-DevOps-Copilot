# PersistentVolumeClaim Pending

## Error Message
```
NAME      STATUS    VOLUME   CAPACITY   STORAGECLASS   AGE
my-pvc    Pending                                      5m
```

## Symptoms
- PVC stays in Pending state
- Pod that needs the PVC also stays Pending
- Storage not provisioned

## Root Cause
No PersistentVolume available to satisfy the PVC's requirements.

## Possible Reasons
- No StorageClass defined or wrong StorageClass name
- No PV with matching access mode and capacity
- Storage provisioner not installed
- PV already bound to another PVC

## Diagnostic Commands
```bash
kubectl get pvc -n <namespace>
kubectl describe pvc <pvc-name> -n <namespace>
kubectl get pv
kubectl get storageclass
```

## Fix Steps
1. Check events on PVC: `kubectl describe pvc <pvc-name>`
2. List available storage classes: `kubectl get storageclass`
3. Check if PVs are available: `kubectl get pv`
4. Create a PV manually if dynamic provisioning not available:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/my-pv
```

## Severity
Medium

## Prevention
- Set up a default StorageClass
- Use cloud-provider storage classes (gp2, standard)
- Monitor PV usage and reclaim policies
