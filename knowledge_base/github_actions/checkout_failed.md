# Checkout Failed

## Error Message
```
Error: fatal: repository 'https://github.com/org/repo' not found
Error: The process '/usr/bin/git' failed with exit code 128
```

## Root Cause
The actions/checkout step cannot access the repository.

## Possible Reasons
- Private repo requires PAT or deploy key
- Repository moved or renamed
- Network issue reaching GitHub
- Wrong ref or branch name

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
