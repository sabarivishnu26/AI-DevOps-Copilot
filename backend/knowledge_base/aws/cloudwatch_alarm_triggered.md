# CloudWatch Alarm in ALARM State

## Error Message
```
ALARM: CPUUtilization > 80% for 5 minutes
State change: OK -> ALARM
Metric: AWS/EC2 CPUUtilization
```

## Root Cause
A CloudWatch metric has crossed the alarm threshold.

## Possible Reasons
- High CPU due to traffic spike
- Runaway process
- Insufficient instance size
- Memory pressure causing CPU spikes

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
Medium

## Prevention
- Set up CloudWatch alarms for key metrics
- Use AWS Trusted Advisor for best practices
- Implement auto-scaling for handling traffic spikes
- Regularly review IAM permissions with least-privilege principle
