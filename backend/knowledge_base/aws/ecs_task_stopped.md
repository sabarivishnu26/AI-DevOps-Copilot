# ECS Task Stopped Unexpectedly

## Error Message
```
Essential container in task exited
Task stopped at: 2024-01-01T00:00:00Z
Reason: Essential container 'app' exited with code 1
```

## Root Cause
An ECS container task exited unexpectedly, causing the task to stop.

## Possible Reasons
- Container application crashed
- OOM kill
- Health check failing
- Missing environment variables

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
