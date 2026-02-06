# Copilot Instructions for LogikBioinfo

## Repository Overview

LogikBioinfo is a multilingual bioinformatics services website built as a static site for GitHub Pages. The site supports Portuguese (default), English, and Spanish translations.

## Technology Stack

- **HTML5**: Semantic HTML with proper DOCTYPE declarations
- **CSS**: Tailwind CSS via CDN + inline `<style>` blocks for custom styling
- **JavaScript**: Vanilla JS (no jQuery), minimal inline scripts
- **Icons**: Font Awesome via CDN (6.5.1 preferred; some legacy pages still reference 6.4.0)
- **Typography**: Google Fonts (Poppins family)
- **Forms**: Formspree integration for static form handling
- **Hosting**: GitHub Pages

## Architecture & Project Structure

```
/                        Portuguese (default/root)
├── index.html          Main homepage
├── servicos.html       Services page
├── publicacoes.html    Publications page
├── portfolio.html      Portfolio/work examples
├── ferramentas.html    Bioinformatics tools
├── blog.html           Blog listing
├── orcamento.html      Budget calculator
├── sobre.html          About/contact page
├── quem-sou-eu.html    About me page
├── obrigado.html       Thank you page (form submission)
├── posts/              Blog posts directory
├── img/                Images
├── portfolio/          Portfolio images
├── js/                 JavaScript utilities
├── scripts/            Node.js helpers (e.g., i18n comparison)
└── docs/               Documentation (deployment, forms, etc.)

/en/                     English translations
├── index.html
├── blog.html
├── servicos.html
├── publicacoes.html
├── portfolio.html
├── ferramentas.html
├── orcamento.html
├── sobre.html
├── quem-sou-eu.html
├── thank-you.html      EN version of obrigado.html
└── posts/

/es/                     Spanish translations
├── index.html
├── blog.html
├── servicos.html
├── publicacoes.html
├── portfolio.html
├── ferramentas.html
├── orcamento.html
├── sobre.html
├── quem-sou-eu.html
├── gracias.html        ES version of obrigado.html
└── posts/

/unused_files/           Archived duplicate files
```

## Code Style Guidelines

### HTML

1. **Standard template**:
   ```html
   <!DOCTYPE html>
   <html lang="pt-BR" class="scroll-smooth">
   <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <link rel="icon" type="image/png" href="favicon.png" />
       <link rel="icon" type="image/x-icon" href="favicon.ico" />
       <title>Page Title | Logik Bioinfo</title>
       <meta name="description" content="..." />
       <script src="https://cdn.tailwindcss.com"></script>
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
       <style>
           body { font-family: 'Poppins', sans-serif; background-color: #111827; }
       </style>
   </head>
   ```

2. **Navigation** - All pages must include links for:
   Início/Home/Inicio, Serviços/Services/Servicios, Publicações/Publications/Publicaciones,
   Portfólio/Portfolio/Portafolio, Ferramentas/Tools/Herramientas, Blog, Orçamento/Budget/Presupuesto,
   Sobre/About/Acerca de, Quem Sou Eu/Who I Am/Quién Soy.

3. **Language selector** - Provide desktop and mobile versions. Example (desktop from PT page):
   ```html
   <div class="language-selector">
       <span class="lang-divider">|</span>
       <a href="index.html" class="lang-option active" data-lang="pt">🇧🇷 PT</a>
       <a href="en/index.html" class="lang-option" data-lang="en">🇬🇧 EN</a>
       <a href="es/index.html" class="lang-option" data-lang="es">🇪🇸 ES</a>
   </div>
   ```
   Mobile menu version mirrors the same links and active state.

4. **Semantic HTML** - Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` and maintain proper heading hierarchy (h1 → h2 → h3).

### CSS

1. **Tailwind CSS classes** - Primary styling method:
   ```html
   <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
   ```

2. **Custom styles** - Use inline `<style>` blocks in `<head>` for shared classes (e.g., `.nav-link-hover`, `.language-selector`, `.whatsapp-float`, `.hp-field`).

3. **Color scheme**:
   - Primary green: `#22c55e` (Tailwind `green-500`)
   - Dark backgrounds: `bg-gray-900`, `bg-gray-800`
   - Text colors: `text-white`, `text-gray-300`, `text-gray-400`

4. **No external CSS files** - Keep styles inline or in `<style>` blocks.

### JavaScript

1. **Vanilla JavaScript only** - No jQuery or heavy frameworks.
2. **Minimal inline scripts** - Keep JS simple (mobile menu toggle, language selector, footer year).
3. **Common patterns**:
   - Mobile menu toggle via class `hidden`
   - Dynamic year in footer: `document.getElementById('year').textContent = new Date().getFullYear();`
   - Simple calculator logic on `orcamento.html`

## Internationalization (i18n)

### Language Structure

- **Portuguese (PT)**: Default language, root directory (`/`)
- **English (EN)**: `/en/` directory
- **Spanish (ES)**: `/es/` directory

### Translation Guidelines

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

- `obrigado.html` (PT) = `thank-you.html` (EN) = `gracias.html` (ES).
- Ensure internal links point to the correct language directory and active state matches the current language.

## Forms and Formspree

### Configuration

- **Endpoint**: `https://formspree.io/f/mkgqqrbw`
- **Recipient**: `contato@logikbioinfo.com.br` (configured in Formspree dashboard)
- **Method**: POST
- **Charset**: UTF-8

### Required Fields

```html
<form action="https://formspree.io/f/mkgqqrbw" method="POST" accept-charset="UTF-8">
    <input type="hidden" name="_subject" value="Nova mensagem do site Logik Bioinfo">
    <input type="hidden" name="_language" value="pt">
    <input type="hidden" name="_redirect" value="https://logikbioinfo.com.br/obrigado.html">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit">Enviar</button>
</form>
```

### Language-Specific Forms

- **Portuguese**: `_language=pt`, `_redirect=/obrigado.html`
- **English**: `_language=en`, `_redirect=/en/thank-you.html`
- **Spanish**: `_language=es`, `_redirect=/es/gracias.html`

### Anti-Spam

Always include honeypot field `.hp-field` with CSS:
```css
.hp-field { position: absolute; left: -9999px; }
```
Current forms use a `website` honeypot field (instead of the older `_gotcha` name); keep this naming consistent across languages.

## File Naming Conventions

1. Use lowercase for all HTML files.
2. Kebab-case for multi-word files (e.g., `quem-sou-eu.html`).
3. Language prefixes only in subdirectories, not filenames.
4. Blog posts in `/posts/` with descriptive names.

## Documentation Standards

When adding or modifying features:

1. Update relevant documentation files:
   - `LINT_REPORT.md` / `LINT_REPORT_FINAL.md`
   - `I18N_GUIDE.md`
   - `FORMSPREE_SETUP.md`
   - `DEPLOYMENT_CHECKLIST.md`
   - `CHANGES.md`

2. Documentation format:
   - Use Markdown with clear headings
   - Include code examples
   - Keep language simple and direct
   - Date significant updates

## Accessibility

1. Use semantic HTML structure.
2. Provide descriptive `alt` text for all images.
3. Ensure keyboard navigation works for menus and forms.
4. Add ARIA labels where appropriate (e.g., language selector).
5. Maintain proper heading hierarchy.

## Testing Guidelines

Before deploying changes:

1. Visual validation on desktop and mobile viewports.
2. Verify mobile menu toggle and language selector.
3. Check all internal links (including language variants).
4. Submit test forms to confirm Formspree redirect and notifications.
5. Verify CDN assets load (Tailwind, Font Awesome, Google Fonts).
6. Ensure no 404s or broken images in console.

## Common Tasks

### Adding a New Page

1. Create the Portuguese page in the root directory.
2. Add navigation link to all existing pages.
3. Include standard header with language selector.
4. Use consistent footer with social links and dynamic year.
5. Create translated versions in `/en/` and `/es/`.
6. Update documentation (`CHANGES.md`, `LINT_REPORT.md`).

### Updating Navigation

1. Modify navigation in all language versions (root, `/en/`, `/es/`).
2. Maintain consistent order and naming.
3. Test mobile menu behavior.
4. Verify active state highlights the current page.

### Adding Blog Posts

1. Create post in `/posts/` (and `/en/posts/`, `/es/posts/` as needed).
2. Update `blog.html` and translated listings with preview/link.
3. Include language selector on post pages.

## Important Notes

1. No server-side code — static site only.
2. CDN dependencies for styles and icons.
3. Keep JavaScript minimal; prefer Tailwind utilities for styling.
4. Optimize images and keep the site lightweight.
5. Mobile-first design.
6. SEO-friendly meta tags and semantic HTML.

## Don't Do

- ❌ Don't add jQuery or heavy frameworks.
- ❌ Don't create external CSS files (use inline or `<style>` blocks).
- ❌ Don't hardcode email addresses outside Formspree configuration.
- ❌ Don't skip the language selector on any page.
- ❌ Don't break consistent navigation structure.
- ❌ Don't use uppercase in filenames.
- ❌ Don't remove working duplicate-prevention measures (see `unused_files/`).

## Resources

- **Repository Docs**: `LINT_REPORT.md`, `I18N_GUIDE.md`, `FORMSPREE_SETUP.md`, `DEPLOYMENT_CHECKLIST.md`
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Font Awesome**: https://fontawesome.com/icons
- **Formspree**: https://formspree.io/

## Support

For questions about the repository structure or guidelines, refer to:
- `LINT_REPORT.md` for detailed repository analysis
- `I18N_GUIDE.md` for translation guidelines
- `VERIFICATION.txt` for testing results and validation

---

**Last Updated**: October 2025
**Maintained by**: LogikBioinfo Team
