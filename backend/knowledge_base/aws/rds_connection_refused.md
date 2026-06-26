# RDS Connection Refused / Max Connections

## Error Message
```
FATAL: remaining connection slots are reserved for non-replication superuser connections
Error: connect ETIMEDOUT
ERROR: too many connections
```

## Root Cause
The RDS database has reached its maximum connection limit or is refusing connections.

## Possible Reasons
- Max connections exceeded
- Connection pool not releasing connections
- Instance class too small
- Database crashed

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
