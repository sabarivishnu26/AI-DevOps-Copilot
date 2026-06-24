# Cache Miss / Cache Not Working

## Error Message
```
Cache not found for input keys: node-modules-${{ hashFiles('package-lock.json') }}
Cache miss occurred on the primary key
```

## Root Cause
The cache key doesn't match previously saved cache.

## Possible Reasons
- cache-key depends on file that changed
- First run (cache never saved)
- Cache expired (7 day TTL)
- Different OS/arch

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
Low

## Prevention
- Validate workflow YAML with actionlint before committing
- Test workflows on a branch before merging to main
- Document all required secrets in README
