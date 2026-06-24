# Tests Failed in CI

## Error Message
```
Run npm test
FAIL src/app.test.js
Tests: 2 failed, 8 passed
Process completed with exit code 1
```

## Root Cause
Automated tests are failing in the CI pipeline.

## Possible Reasons
- Code changes broke existing tests
- Environment variable missing in CI
- Database not seeded
- Test depends on external service

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
