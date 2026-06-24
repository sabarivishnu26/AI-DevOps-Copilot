# IAM Not Authorized

## Error Message
```
User: arn:aws:iam::123456789:user/myuser is not authorized to perform: ec2:DescribeInstances
AccessDeniedException
```

## Root Cause
The IAM user or role lacks permission to perform the requested AWS action.

## Possible Reasons
- Missing IAM policy for the action
- Wrong IAM role attached to resource
- Permission boundary blocking
- Service control policy

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
