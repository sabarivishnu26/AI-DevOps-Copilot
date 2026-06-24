# Runner Not Found / Offline

## Error Message
```
Error: No runner matching the specified labels was found
All runners: offline
```

## Root Cause
No GitHub Actions runner is available to execute the workflow.

## Possible Reasons
- Self-hosted runner is offline
- Runner labels don't match job's runs-on
- Runner needs re-registration
- Runner host machine is down

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
