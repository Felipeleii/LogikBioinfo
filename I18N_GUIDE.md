# LogikBioinfo - Internationalization Implementation Guide

## Overview
This document describes the internationalization (i18n) implementation for the LogikBioinfo website, supporting Portuguese (PT), English (EN), and Spanish (ES).

## Quick Start

### For Users
The website automatically detects and displays the language selector in the navigation:
- Desktop: Look for "| PT EN ES" at the end of the navigation bar
- Mobile: Tap the menu icon and scroll to find language options at the bottom

### For Developers
To add a new translated page:

1. Create the file in the appropriate language directory:
   ```bash
   # For English
   cp [page].html en/[page].html
   
   # For Spanish
   cp [page].html es/[page].html
   ```

2. Update the following in the new file:
   - Change `lang` attribute in `<html>` tag to "en" or "es"
   - Translate the `<title>` and meta `description`
   - Translate all navigation menu text
   - Translate page content
   - Update language selector links to reflect current page
   - Ensure internal links point to correct language directory

## Language Selector Implementation

### CSS Styling
All pages include these CSS classes:
```css
.language-selector    /* Container for language options */
.lang-option         /* Individual language link */
.lang-option.active  /* Active language highlight */
.lang-divider        /* Separator character */
```

### HTML Structure

**Desktop Navigation:**
```html
<div class="language-selector">
    <span class="lang-divider">|</span>
    <a href="../index.html" class="lang-option" data-lang="pt">PT</a>
    <a href="index.html" class="lang-option active" data-lang="en">EN</a>
    <a href="../es/index.html" class="lang-option" data-lang="es">ES</a>
</div>
```

**Mobile Navigation:**
```html
<div class="flex justify-center py-2 px-6 space-x-2">
    <a href="../index.html" class="lang-option text-sm" data-lang="pt">PT</a>
    <span class="text-gray-600">|</span>
    <a href="index.html" class="lang-option active text-sm" data-lang="en">EN</a>
    <span class="text-gray-600">|</span>
    <a href="../es/index.html" class="lang-option text-sm" data-lang="es">ES</a>
</div>
```

## Directory Structure

```
/                        Portuguese (default language)
├── index.html          Main homepage
├── servicos.html       Services page
├── publicacoes.html    Publications page
├── portfolio.html      Portfolio page
├── ferramentas.html    Tools page
├── blog.html           Blog listing
├── orcamento.html      Budget calculator
├── sobre.html          About page
├── quem-sou-eu.html    About me page
└── posts/              Blog posts directory

/en/                     English translations
├── README.md           Translation guidelines
├── index.html          English homepage
└── posts/              English blog posts (to be added)

/es/                     Spanish translations
├── README.md           Translation guidelines
├── index.html          Spanish homepage
└── posts/              Spanish blog posts (to be added)
```

## Translation Guidelines

### Navigation Menu Translations

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

### Common Phrases

| Portuguese | English | Spanish |
|------------|---------|---------|
| Todos os direitos reservados | All rights reserved | Todos los derechos reservados |
| Fale conosco pelo WhatsApp | Contact us via WhatsApp | Contáctenos por WhatsApp |
| Solicite um Orçamento | Request a Quote | Solicite un Presupuesto |

## URL Structure

The language is determined by the directory:

- **Portuguese (default):** `https://example.com/[page].html`
- **English:** `https://example.com/en/[page].html`
- **Spanish:** `https://example.com/es/[page].html`

### Internal Link Rules

When creating translated pages:

1. **Links within the same language:**
   - Use relative paths: `href="[page].html"`

2. **Links to Portuguese (from EN/ES):**
   - Use: `href="../[page].html"`

3. **Links to other translations (from EN/ES):**
   - EN to ES: `href="../es/[page].html"`
   - ES to EN: `href="../en/[page].html"`

## Testing Checklist

When adding a new translated page:

- [ ] HTML `lang` attribute set correctly
- [ ] Page title translated
- [ ] Meta description translated
- [ ] All navigation menu items translated
- [ ] Language selector present (desktop and mobile)
- [ ] Correct language marked as active in selector
- [ ] All internal links work correctly
- [ ] Page content fully translated
- [ ] Footer text translated
- [ ] WhatsApp button title translated
- [ ] Test on desktop and mobile views

## JavaScript Utility

The file `js/language-selector.js` contains utility functions for potential future enhancements:

- `getCurrentLanguage()` - Get current language from localStorage
- `setLanguage(lang)` - Set language and redirect
- `updateLanguageSelector()` - Update active language indicator
- `redirectToLanguagePage(lang)` - Navigate to language-specific page

Currently, language switching is handled via direct HTML links. The JavaScript can be used for more advanced features if needed.

## Best Practices

1. **Maintain consistency:** Keep the same structure across all language versions
2. **Professional translations:** Use professional translators for public-facing content
3. **Cultural sensitivity:** Adapt content for cultural context, not just literal translation
4. **Regular updates:** When updating Portuguese pages, update translations too
5. **SEO considerations:** Add `hreflang` tags for better search engine optimization
6. **Accessibility:** Ensure `lang` attributes are correct for screen readers

## Future Enhancements

Potential improvements to consider:

1. Add `hreflang` meta tags for SEO
2. Implement automatic language detection based on browser settings
3. Create translation management system
4. Add more translated pages beyond index.html
5. Consider using a static site generator for easier management
6. Add language-specific content (not just translations)

## Support

For questions about translations or implementation:
- See `LINT_REPORT.md` for detailed repository analysis
- Check `en/README.md` and `es/README.md` for language-specific guidelines
- Review existing translated pages for examples

---

**Last Updated:** October 11, 2025  
**Version:** 1.0
