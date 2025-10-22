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

### 9. **Branch Protection Setup (com Copilot Agent)**

**Para habilitar branch protection mantendo acesso ao Copilot:**

#### Passo 1: Ir para Settings → Branches
1. Acesse seu repositório: https://github.com/Felipeleii/LogikBioinfo
2. Clique em **Settings** (engrenagem no topo)
3. Esquerda: clique em **Branches**
4. Em "Branch protection rules", clique em **Add rule**

#### Passo 2: Configurar a Rule
- **Branch name pattern:** `main`
- Habilite as seguintes opções:
  - ✅ Require a pull request before merging
  - ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - ✅ Include administrators (se quiser que as regras se apliquem a você também)
  
#### Passo 3: Configurações Opcionais (recomendadas)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require code reviews from code owners (opcional)
- ✅ Require approval of the most recent reviewers before deployment

#### Como o Copilot Agent Continua Funcionando:
1. O agent cria um **branch de trabalho** (ex: `copilot/fix-something`)
2. Faz os commits neste branch
3. Abre um **Pull Request** para `main`
4. O PR ativa:
   - Verificações automáticas (GitHub Actions - se configurado)
   - Requer revisão/aprovação (se configurado)
5. Após tudo passar, você **aprova e faz merge**

#### Workflow Recomendado para Copilot:
```bash
# Copilot cria uma branch
git checkout -b feature/your-feature

# Faz alterações e commits
git add .
git commit -m "description"

# Faz push da feature branch
git push origin feature/your-feature

# GitHub mostra opção de "Create Pull Request"
# Você aprova e faz merge
```

#### GitHub Actions (Automação de Verificações)
Para que o branch protection funcione melhor, crie um workflow:

1. Crie arquivo `.github/workflows/security-check.yml`:
   ```yaml
   name: Security Checks
   on: [pull_request, push]
   jobs:
     security:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Check for secrets
           run: |
             if grep -r "AIza\|PRIVATE KEY\|password=" . --exclude-dir=.git; then
               echo "Potential secret found!"
               exit 1
             fi
   ```

### 10. **Alternativa: Cobot como Colaborador com Permissões**

Se preferir que o Copilot trabalhe diretamente em `main`:
1. Settings → Collaborators → Add people
2. Dê permissão de "Maintain" ou "Admin" (se confiável)
3. **Risco:** sem branch protection, mudanças vão direto para `main`

**Recomendação:** Use branch protection + PRs. É mais seguro!

### 11. **References**

- [Google: Handling Compromised Credentials](https://cloud.google.com/docs/authentication/security)
- [GitHub: Removing sensitive data from history](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management](https://owasp.org/www-community/Sensitive_Data_Exposure)
- [GitHub: Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [GitHub: GitHub Actions](https://docs.github.com/en/actions)

---

**Last Updated:** October 22, 2025  
**Maintained by:** LogikBioinfo Team
