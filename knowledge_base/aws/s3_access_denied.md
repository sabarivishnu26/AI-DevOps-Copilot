# S3 Access Denied

## Error Message
```
An error occurred (AccessDenied) when calling the GetObject operation: Access Denied
403 Forbidden
```

## Root Cause
The IAM role or user does not have permission to access the S3 bucket or object.

## Possible Reasons
- IAM policy missing S3 permissions
- Bucket policy blocking access
- ACL issue
- KMS key permission denied
- Wrong AWS account

## Diagnostic Commands
```bash
aws cloudwatch get-metric-statistics --namespace AWS/Lambda ...
aws logs get-log-events --log-group-name /aws/lambda/my-function
aws ecs describe-tasks --cluster my-cluster --tasks <task-arn>
aws rds describe-db-instances --db-instance-identifier my-db
```

## Fix Steps
1. Check CloudWatch Logs for detailed error messages
2. Review the specific AWS service console for status
3. Verify IAM permissions are correct
4. Check security groups and network ACLs
5. Apply fix and monitor CloudWatch metrics

## Severity
High

## Prevention
- Set up CloudWatch alarms for key metrics
- Use AWS Trusted Advisor for best practices
- Implement auto-scaling for handling traffic spikes
- Regularly review IAM permissions with least-privilege principle
