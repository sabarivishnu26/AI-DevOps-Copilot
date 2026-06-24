# EC2 Instance Unreachable

## Error Message
```
Instance status check failed
System Status Check: Failed
Instance Status Check: Failed
```

## Root Cause
The EC2 instance is not responding to health checks.

## Possible Reasons
- Instance crashed or frozen
- Security group blocking traffic
- Network ACL issue
- Operating system kernel panic

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
Critical

## Prevention
- Set up CloudWatch alarms for key metrics
- Use AWS Trusted Advisor for best practices
- Implement auto-scaling for handling traffic spikes
- Regularly review IAM permissions with least-privilege principle
