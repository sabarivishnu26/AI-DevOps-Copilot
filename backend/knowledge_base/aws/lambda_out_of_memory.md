# Lambda Out of Memory

## Error Message
```
REPORT Duration: 1200ms Memory Size: 128 MB Max Memory Used: 128 MB
Process exited before completing request
```

## Root Cause
Lambda function ran out of allocated memory.

## Possible Reasons
- Memory limit too low for workload
- Memory leak in function
- Processing large files in memory
- Too many loaded dependencies

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
