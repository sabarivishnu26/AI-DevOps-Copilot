# API Gateway 502 Bad Gateway

## Error Message
```
502 Bad Gateway
{"message": "Internal server error"}
Execution failed due to configuration error: Malformed Lambda proxy response
```

## Root Cause
API Gateway received an invalid response from the backend Lambda or HTTP integration.

## Possible Reasons
- Lambda function throwing unhandled exception
- Lambda response format wrong
- Lambda timeout
- Integration not configured

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
