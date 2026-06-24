# Docker Push Unauthorized in CI

## Error Message
```
Error: unauthorized: authentication required
The push refers to repository [docker.io/myorg/myapp]
```

## Root Cause
The CI pipeline cannot push the Docker image to the registry.

## Possible Reasons
- Registry credentials not set as secrets
- Secret name mismatch in workflow
- Token expired
- Registry URL wrong

## Diagnostic Steps
```
1. Check the full workflow run log in GitHub Actions tab
2. Click the failing step to expand full output
3. Check repository Settings > Secrets and variables
4. Review workflow YAML for typos or missing fields
```

## Fix Steps
1. Read the complete error message in the Actions run log
2. Verify all secrets exist: repo Settings > Secrets and variables > Actions
3. Check the workflow YAML indentation (YAML is whitespace-sensitive)
4. Re-run the failed job after applying the fix

## Verification
- Trigger a new workflow run after the fix
- Check all steps show green checkmarks
- Verify the expected outcome (deploy, test pass, artifact created)

## Severity
High

## Prevention
- Validate workflow YAML with actionlint before committing
- Test workflows on a branch before merging to main
- Document all required secrets in README
