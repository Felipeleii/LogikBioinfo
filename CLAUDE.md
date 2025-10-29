# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

LogikBioinfo is a multilingual bioinformatics services website built as a static site for GitHub Pages. The site supports Portuguese (default), English, and Spanish with a focus on clean, accessible design using vanilla technologies.

## Technology Stack

- **Static HTML5**: No server-side code, GitHub Pages compatible
- **Tailwind CSS**: Via CDN (https://cdn.tailwindcss.com)
- **Vanilla JavaScript**: Minimal, purposeful JS only - no frameworks or jQuery
- **Font Awesome 6.4.0/6.5.1**: Icon library via CDN
- **Formspree**: Static form handling (endpoint: https://formspree.io/f/mkgqqrbw)
- **Google Fonts**: Poppins font family

## Architecture & Project Structure

### Multilingual Directory Layout

```
/                        Portuguese (default/root)
├── index.html          Main homepage
├── servicos.html       Services page
├── publicacoes.html    Publications page
├── portfolio.html      Portfolio/work examples
├── ferramentas.html    Bioinformatics tools
├── blog.html           Blog listing
├── orcamento.html      Budget calculator with interactive JS
├── sobre.html          About/contact page with Formspree form
├── quem-sou-eu.html    About me page
├── obrigado.html       Thank you page (form submission redirect)
└── posts/              Blog posts directory

/en/                     English translations (all pages translated)
├── index.html
├── thank-you.html      EN version of obrigado.html
└── posts/

/es/                     Spanish translations (all pages translated)
├── index.html
├── gracias.html        ES version of obrigado.html
└── posts/

/js/                     JavaScript utilities
└── language-selector.js  Language switching utilities (not currently active)

/scripts/                Node.js utilities
└── i18n-compare.js      Validates translation consistency across languages

/img/                    Images
/portfolio/              Portfolio images
/unused_files/           Archived duplicate files
```

### File Naming Aliases

When comparing translations, these files are equivalent:
- `obrigado.html` (PT) = `thank-you.html` (EN) = `gracias.html` (ES)

## Common Development Commands

### Translation Validation

Check for missing pages and structural differences between language versions:

```bash
node scripts/i18n-compare.js > I18N_DIFF_REPORT.md
```

This script:
- Scans all HTML files in PT (root), EN (/en/), ES (/es/)
- Detects missing translations
- Compares HTML structure (tags only, ignoring text/attributes)
- Outputs tag count differences and structural fingerprints

### Testing

No build process required - open HTML files directly in browser:

```bash
# Simple local server for testing (if needed)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

Test checklist before deployment:
- Desktop and mobile viewports (responsive design)
- Mobile menu toggle functionality
- Language selector on all pages
- All internal links work correctly
- Forms submit successfully to Formspree
- WhatsApp float button appears
- Images load properly (especially WebP with fallbacks)

## Key Architecture Patterns

### Internationalization (i18n)

**Language Detection**: Based on directory structure
- PT: `https://logikbioinfo.com.br/[page].html`
- EN: `https://logikbioinfo.com.br/en/[page].html`
- ES: `https://logikbioinfo.com.br/es/[page].html`

**Language Selector**: Every page must include both desktop and mobile versions

Desktop navigation:
```html
<div class="language-selector">
    <span class="lang-divider">|</span>
    <a href="../index.html" class="lang-option" data-lang="pt">PT</a>
    <a href="index.html" class="lang-option active" data-lang="en">EN</a>
    <a href="../es/index.html" class="lang-option" data-lang="es">ES</a>
</div>
```

Mobile navigation (inside mobile menu):
```html
<div class="flex justify-center py-2 px-6 space-x-2">
    <a href="../index.html" class="lang-option text-sm" data-lang="pt">PT</a>
    <span class="text-gray-600">|</span>
    <a href="index.html" class="lang-option active text-sm" data-lang="en">EN</a>
    <span class="text-gray-600">|</span>
    <a href="../es/index.html" class="lang-option text-sm" data-lang="es">ES</a>
</div>
```

**Navigation Menu Translations**:

| Portuguese | English | Spanish |
|------------|---------|---------|
| Início | Home | Inicio |
| Serviços | Services | Servicios |
| Publicações | Publications | Publicaciones |
| Portfólio | Portfolio | Portafolio |
| Ferramentas | Tools | Herramientas |
| Blog | Blog | Blog |
| Orçamento | Budget | Presupuesto |
| Sobre | About | Acerca de |
| Quem Sou Eu | Who I Am | Quién Soy |

### Forms with Formspree

**Endpoint**: `https://formspree.io/f/mkgqqrbw` (sends to contato@logikbioinfo.com.br)

Required form structure:
```html
<form action="https://formspree.io/f/mkgqqrbw" method="POST" accept-charset="UTF-8">
    <!-- Hidden fields -->
    <input type="hidden" name="_subject" value="Nova mensagem do site Logik Bioinfo">
    <input type="hidden" name="_language" value="pt">
    <input type="hidden" name="_redirect" value="https://logikbioinfo.com.br/obrigado.html">

    <!-- Required visible fields -->
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>

    <!-- Anti-spam honeypot (REQUIRED) -->
    <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off">

    <button type="submit">Enviar</button>
</form>
```

**Required CSS for honeypot**:
```css
.hp-field { position: absolute; left: -9999px; }
```

**Language-specific redirects**:
- PT: `/obrigado.html`
- EN: `/en/thank-you.html`
- ES: `/es/gracias.html`

### Styling Approach

**No External CSS Files**: All styles must be:
1. Tailwind utility classes inline in HTML
2. Custom CSS in `<style>` blocks within `<head>`

**Color Scheme**:
- Primary green: `#22c55e` (Tailwind `green-500`)
- Dark backgrounds: `bg-gray-900` (#111827), `bg-gray-800` (#1f2937)
- Text: `text-white`, `text-gray-300`, `text-gray-400`

**Standard CSS Classes**:
```css
.nav-link-hover:hover { color: #22c55e; }
.nav-link-active { color: #22c55e; font-weight: 600; }
.whatsapp-float { /* Fixed WhatsApp button bottom-right */ }
.language-selector { /* Language switcher styling */ }
.lang-option { /* Individual language link */ }
.lang-option.active { color: #22c55e; font-weight: 600; }
```

### Standard Page Template

Every HTML page must include:

1. **HTML5 structure** with proper `lang` attribute:
```html
<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">  <!-- or lang="en" / lang="es" -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="favicon.png">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <title>[Page Title] - Logik Bioinfo</title>
    <meta name="description" content="...">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Poppins', sans-serif; background-color: #111827; }
        /* Additional custom styles */
    </style>
</head>
```

2. **Navigation menu** with all 9 menu items (Início/Home/Inicio through Quem Sou Eu/Who I Am/Quién Soy)

3. **Language selector** (desktop and mobile versions)

4. **WhatsApp float button** (fixed bottom-right):
```html
<a href="https://wa.me/5511999999999" class="whatsapp-float" title="[WhatsApp text]">
    <i class="fab fa-whatsapp"></i>
</a>
```

5. **Footer** with:
   - Social links (LinkedIn, GitHub, etc.)
   - Copyright with dynamic year: `<span id="year"></span>`
   - JavaScript: `document.getElementById('year').textContent = new Date().getFullYear();`

### Mobile Menu Pattern

All pages implement a hamburger menu for mobile:
```javascript
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});
```

## Important Constraints

### DO:
- Use semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Maintain proper heading hierarchy (h1 → h2 → h3, no skipping)
- Add alt text for all images
- Use lowercase for all HTML filenames
- Use kebab-case for multi-word files (e.g., `quem-sou-eu.html`)
- Keep JavaScript minimal and vanilla
- Test on desktop and mobile viewports
- Update all three language versions when adding pages

### DON'T:
- Add jQuery or heavy frameworks
- Create external CSS files (use inline styles or `<style>` blocks)
- Hardcode email addresses in forms (use Formspree)
- Skip the language selector on any page
- Break consistent navigation structure
- Use uppercase in filenames
- Remove working duplicate-prevention measures (see `unused_files/`)
- Use server-side code (this is static-only)

## Budget Calculator (`orcamento.html`)

The budget calculator includes interactive JavaScript for calculating project estimates based on:
- Project type selection
- Complexity level
- Timeline
- Additional services

This is the most JavaScript-heavy page in the site. When modifying, ensure calculations remain accurate and the form properly integrates with Formspree.

## Documentation Files Reference

The repository includes extensive documentation:
- `I18N_GUIDE.md` - Translation guidelines and language selector implementation
- `FORMSPREE_SETUP.md` - Complete form configuration and anti-spam setup
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment verification steps
- `LINT_REPORT.md` or `LINT_REPORT_FINAL.md` - Repository analysis
- `IMAGE_OPTIMIZATION.md` / `OTIMIZACAO_IMAGENS.md` - Image optimization guidelines
- `SECURITY.md` - Security considerations
- `CHANGES.md` - Changelog for significant updates

When making significant changes, update relevant documentation.

## Git Workflow

This repository uses GitHub Pages for hosting. The `main` branch is the deployment branch.

Standard commit message format (follow existing patterns in git log):
- Use imperative mood: "Fix:", "Add:", "Update:"
- Reference specific features: "fix: Corrige navegação" or "Fix: Position glow effect"

Recent commit examples show bilingual messages (PT/EN) are acceptable.
