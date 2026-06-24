# Lambda Function Timeout

## Error Message
```
Task timed out after 3.00 seconds
START RequestId: abc123 Version: $LATEST
END RequestId: abc123
REPORT Duration: 3000.00 ms Billed Duration: 3000 ms
```

## Root Cause
The Lambda function exceeded its configured timeout limit.

## Possible Reasons
- Function timeout set too low
- External API call taking too long
- Database query not optimized
- Cold start latency

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
