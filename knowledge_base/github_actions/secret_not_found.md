# Secret Not Found

## Error Message
```
Error: Secret MY_API_KEY does not exist
##[error]Input required and not supplied: token
```

## Root Cause
A secret referenced in the workflow does not exist in the repository settings.

## Possible Reasons
- Secret not added to repo Settings > Secrets
- Secret name typo
- Wrong scope (repo vs org secret)
- Secret deleted

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
