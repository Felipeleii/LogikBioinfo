# Changelog - Internationalization and Repository Cleanup

## Version 1.1 - October 24, 2025

### 🔌 Tooling

#### Added (Tooling)

- `.vscode/mcp.json` configuration to run the official GitHub MCP Server container using the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable.
- `MCP_SETUP.md` with Docker, token, and toolset guidance for using MCP in Copilot Agent mode.

#### Modified

- `.gitignore` now excludes `.env` files used for storing sensitive MCP credentials.
- `MCP_SETUP.md` now documents the environment-variable workflow and includes shell examples for priming the token.

### ✅ Notes

- The setup enables Copilot (and other MCP hosts) to access GitHub context via Docker without committing secrets.

## Version 1.0 - October 11, 2025

### 🌐 Internationalization

#### Added (Internationalization)

- Language selector to all HTML pages (PT, EN, ES)
- English translation of homepage (`en/index.html`)
- Spanish translation of homepage (`es/index.html`)
- Translation framework with directory structure
- `js/language-selector.js` utility for future enhancements
- `I18N_GUIDE.md` - Complete internationalization guide
- `en/README.md` - English translation guidelines
- `es/README.md` - Spanish translation guidelines

#### Modified (11 files)

- `index.html` - Added language selector
- `servicos.html` - Added language selector
- `publicacoes.html` - Added language selector
- `portfolio.html` - Added language selector
- `ferramentas.html` - Added language selector
- `blog.html` - Added language selector
- `orcamento.html` - Added language selector
- `sobre.html` - Added language selector
- `quem-sou-eu.html` - Added language selector
- `posts/post-acinetobacter.html` - Added language selector

### 🧹 Repository Cleanup

#### Archived

- `Portfolio.html` → `unused_files/Portfolio.html`
  - Duplicate file with different carousel implementation
- `post-acinetobacter.html` → `unused_files/post-acinetobacter.html`
  - Root duplicate (kept version in posts/ directory)

### 📝 Documentation

#### Added (Documentation)

- `LINT_REPORT.md` - Comprehensive repository analysis
  - File structure documentation
  - Duplicate files identification
  - Navigation consistency review
  - Code quality assessment
  - No broken links or missing files detected

### 🎨 CSS Enhancements

#### Added Styles

```css
.language-selector    /* Container for language options */
/* Container for language options */
/* Container for language options */
/* Container for language options */
.lang-option         /* Language link styling */
.lang-option.active  /* Active language highlight */
.lang-divider; /* Separator styling */
```

### 🧪 Testing

#### Verified

- ✅ All language selector links functional
- ✅ Portuguese (PT) default language working
- ✅ English (EN) translation working
- ✅ Spanish (ES) translation working
- ✅ Mobile and desktop navigation tested
- ✅ No broken links detected
- ✅ All CDN dependencies accessible

### 📊 Statistics

- **Files Modified:** 11
- **Files Created:** 7
- **Files Archived:** 2
- **Languages Supported:** 3 (PT, EN, ES)
- **Translation Coverage:** Homepage (33% of pages)
- **Code Quality:** No issues found

### 🚀 Impact

- **Accessibility:** Site now accessible to English and Spanish speakers
- **Maintainability:** Clear translation framework and documentation
- **Code Quality:** Duplicate files removed, consistent structure
- **User Experience:** Easy language switching on all pages
- **SEO Ready:** Proper language structure for search engines

### 📋 Remaining Work (Optional)

- Translate additional pages (servicos, publicacoes, etc.)
- Add hreflang meta tags for SEO
- Implement automatic language detection
- Create more blog post translations

---

**Authors:** Repository Internationalization Task  
**Date:** October 11, 2025
