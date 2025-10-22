# Security Guidelines

## ⚠️ Important Security Practices

### 1. **Never Commit Sensitive Information**
- ❌ API Keys
- ❌ Database Credentials
- ❌ Private Keys
- ❌ Tokens
- ❌ Secrets

### 2. **Use Environment Variables**
Instead of hardcoding secrets in code, use environment variables or `.env` files (which should be in `.gitignore`).

### 3. **Files to Keep Out of Version Control**
The following files/folders are automatically ignored (see `.gitignore`):
- `.vs/` - Visual Studio cache
- `.vscode/` - VS Code settings
- `.idea/` - IDE settings
- `.playwright-mcp/` - Test automation cache
- `*.sqlite` - Database files
- `.prettierrc`, `.prettierignore` - Local formatting config

### 4. **What If an API Key Was Exposed?**

**Immediate Action Required:**
1. **Regenerate the key** in the Google Cloud Console
2. **Check for unauthorized usage** in Cloud Logging
3. **Commit the removal** to Git with a clear message
4. **Rotate all credentials** that may have been compromised

### 5. **Local Development Setup**

For local API usage (e.g., Google Maps, Firebase):
```bash
# Create a local .env file (NOT committed to Git)
echo ".env" >> .gitignore
echo "GOOGLE_API_KEY=your_key_here" > .env
```

Then load it in your HTML/JS:
```html
<!-- For static sites, use a config.js that loads from .env -->
<!-- Or use a build process that injects secrets at build time -->
```

### 6. **Pre-commit Checks**
Before committing, verify no secrets are in staged files:
```bash
git diff --cached | grep -i "api\|key\|password\|secret"
```

### 7. **Secrets Scanning**
If you suspect a secret was committed:
1. Search the commit history: `git log -p --all | grep "API\|secret"`
2. Remove from history (if not yet pushed):
   ```bash
   git reset --soft HEAD~1  # Undo last commit
   git reset HEAD sensitive_file.js  # Unstage the file
   git checkout -- sensitive_file.js  # Discard changes
   ```
3. If already pushed to GitHub, you must:
   - Use `git-filter-branch` or `BFG Repo-Cleaner`
   - Contact GitHub support if needed

### 8. **GitHub Secret Scanning**
- GitHub automatically scans for exposed credentials
- Enable branch protection rules
- Require code reviews before merge

### 9. **References**
- [Google: Handling Compromised Credentials](https://cloud.google.com/docs/authentication/security)
- [GitHub: Removing sensitive data from history](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management](https://owasp.org/www-community/Sensitive_Data_Exposure)

---

**Last Updated:** October 22, 2025  
**Maintained by:** LogikBioinfo Team
