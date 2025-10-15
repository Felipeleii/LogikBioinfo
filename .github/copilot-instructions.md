# Copilot Instructions for LogikBioinfo

## Repository Overview

LogikBioinfo is a multilingual bioinformatics services website built with static HTML, Tailwind CSS, and vanilla JavaScript. The site supports Portuguese (default), English, and Spanish translations.

## Technology Stack

- **HTML5**: Semantic HTML with proper DOCTYPE declarations
- **CSS**: Tailwind CSS via CDN + inline `<style>` blocks for custom styling
- **JavaScript**: Vanilla JS (no jQuery), minimal inline scripts
- **Icons**: Font Awesome 6.4.0 via CDN
- **Forms**: Formspree integration for static form handling
- **Hosting**: GitHub Pages

## Project Structure

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
└── posts/              Blog posts directory

/en/                     English translations
├── index.html
└── posts/

/es/                     Spanish translations
├── index.html
└── posts/

/img/                    Images
/portfolio/              Portfolio images
/js/                     JavaScript utilities
/unused_files/           Archived duplicate files
```

## Code Style Guidelines

### HTML

1. **Always use proper HTML5 structure**:
   ```html
   <!DOCTYPE html>
   <html lang="pt">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Page Title - Logik Bioinfo</title>
   </head>
   ```

2. **Consistent navigation menu** - All pages must include:
   - Início (Home)
   - Serviços (Services)
   - Publicações (Publications)
   - Portfólio (Portfolio)
   - Ferramentas (Tools)
   - Blog
   - Orçamento (Budget)
   - Sobre (About)
   - Quem Sou Eu (Who I Am)

3. **Language selector** - Must be present on all pages:
   ```html
   <div class="language-selector">
       <span class="lang-divider">|</span>
       <a href="../index.html" class="lang-option active" data-lang="pt">PT</a>
       <a href="../en/index.html" class="lang-option" data-lang="en">EN</a>
       <a href="../es/index.html" class="lang-option" data-lang="es">ES</a>
   </div>
   ```

4. **Semantic HTML** - Use appropriate semantic elements:
   - `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
   - Proper heading hierarchy (h1 → h2 → h3)

### CSS

1. **Tailwind CSS classes** - Primary styling method:
   ```html
   <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
   ```

2. **Custom styles** - Use inline `<style>` blocks in `<head>`:
   ```html
   <style>
       .custom-class {
           /* Custom CSS here */
       }
   </style>
   ```

3. **Color scheme**:
   - Primary green: `#22c55e` (Tailwind `green-500`)
   - Dark backgrounds: `bg-gray-900`, `bg-gray-800`
   - Text colors: `text-white`, `text-gray-300`, `text-gray-400`

4. **No external CSS files** - All styles must be inline or in `<style>` blocks

### JavaScript

1. **Vanilla JavaScript only** - No jQuery or heavy frameworks
2. **Minimal inline scripts** - Keep JS simple and purposeful
3. **Common patterns**:
   - Mobile menu toggle
   - Dynamic year in footer: `document.getElementById('year').textContent = new Date().getFullYear();`
   - Language selector functionality

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

### Adding Translated Pages

1. Copy the Portuguese page to the language directory
2. Update `lang` attribute: `<html lang="en">` or `<html lang="es">`
3. Translate `<title>` and meta `description`
4. Translate all visible content
5. Update language selector active state
6. Ensure internal links point to correct language directory

## Forms and Formspree

### Configuration

- **Endpoint**: `https://formspree.io/f/mkgqqrbw`
- **Recipient**: `contato@logikbioinfo.com.br` (configured in Formspree dashboard)
- **Method**: POST
- **Charset**: UTF-8

### Required Fields

```html
<form action="https://formspree.io/f/mkgqqrbw" method="POST" accept-charset="UTF-8">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <input type="hidden" name="_subject" value="Nova mensagem do site Logik Bioinfo">
    <input type="hidden" name="_language" value="pt">
    <input type="text" name="_gotcha" class="hp-field" style="display:none">
    <button type="submit">Enviar</button>
</form>
```

### Language-Specific Forms

- **Portuguese**: Redirects to `/obrigado.html`
- **English**: Redirects to `/en/thank-you.html`
- **Spanish**: Redirects to `/es/gracias.html`

### Anti-Spam

Always include honeypot field:
```html
<input type="text" name="_gotcha" class="hp-field" style="display:none">
```

## File Naming Conventions

1. **Use lowercase** for all HTML files (e.g., `portfolio.html`, not `Portfolio.html`)
2. **Kebab-case for multi-word files** (e.g., `quem-sou-eu.html`)
3. **Language prefixes** only in subdirectories, not filenames
4. **Blog posts** in `/posts/` directory with descriptive names (e.g., `post-acinetobacter.html`)

## Documentation Standards

When adding or modifying features:

1. **Update relevant documentation files**:
   - `LINT_REPORT.md` - Repository analysis and structure
   - `I18N_GUIDE.md` - Internationalization guidelines
   - `FORMSPREE_SETUP.md` - Form configuration
   - `DEPLOYMENT_CHECKLIST.md` - Pre-deployment verification
   - `CHANGES.md` - Changelog for significant updates

2. **Documentation format**:
   - Use Markdown with clear headings
   - Include code examples
   - Keep language simple and direct
   - Date significant updates

## Accessibility

1. **Semantic HTML structure** - Use appropriate tags
2. **Alt text for images** - Always provide descriptive alt attributes
3. **Keyboard navigation** - Ensure all interactive elements are accessible
4. **ARIA labels** - Add where appropriate (consider adding to language selector)
5. **Proper heading hierarchy** - Don't skip heading levels

## Testing Guidelines

Before deploying changes:

1. **Visual validation**:
   - Test on desktop and mobile viewports
   - Verify responsive design (mobile menu toggle)
   - Check language selector visibility and functionality

2. **Link verification**:
   - Ensure all internal links work
   - Verify language-specific links point to correct directories
   - Check external links open in new tabs

3. **Form testing**:
   - Submit test data to verify Formspree integration
   - Confirm correct redirect to thank-you pages
   - Check email notifications arrive properly

4. **Cross-browser compatibility**:
   - Test in Chrome, Firefox, Safari, Edge
   - Verify CDN resources load correctly

5. **No broken references**:
   - All images load
   - All CSS/JS from CDN loads
   - No 404 errors in browser console

## Common Tasks

### Adding a New Page

1. Create HTML file in root directory (Portuguese version)
2. Add navigation link to all existing pages
3. Include standard header with language selector
4. Use consistent footer with social links and year
5. Create translated versions in `/en/` and `/es/` as needed
6. Update documentation (`CHANGES.md`, `LINT_REPORT.md`)

### Updating Navigation

1. Modify navigation in ALL HTML files (root, `/en/`, `/es/`)
2. Maintain consistent order and naming
3. Test mobile menu behavior
4. Verify active page highlighting works

### Adding Blog Posts

1. Create post in `/posts/` directory
2. Update `blog.html` with post preview/link
3. Consider creating translations in `/en/posts/` and `/es/posts/`
4. Include language selector on post pages

## Important Notes

1. **No server-side code** - This is a static site hosted on GitHub Pages
2. **CDN dependencies** - All external libraries loaded via CDN
3. **Keep it lightweight** - Minimal JavaScript, optimize images
4. **Mobile-first** - Ensure responsive design works on all devices
5. **SEO-friendly** - Proper meta tags, descriptions, and semantic HTML
6. **Version control** - Commit changes frequently with clear messages

## Don't Do

- ❌ Don't add jQuery or heavy frameworks
- ❌ Don't create external CSS files (use inline or `<style>` blocks)
- ❌ Don't hardcode email addresses in forms (use Formspree)
- ❌ Don't skip language selector on any page
- ❌ Don't break consistent navigation structure
- ❌ Don't use uppercase in filenames
- ❌ Don't remove working duplicate-prevention measures (see `unused_files/`)

## Resources

- **Repository Docs**: `LINT_REPORT.md`, `I18N_GUIDE.md`, `FORMSPREE_SETUP.md`
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
