# Blog Redesign Documentation

**Date**: October 23, 2025  
**Status**: ✅ Complete  
**Version**: 1.0

---

## Overview

The LogikBioinfo blog infrastructure has been completely redesigned to provide a professional, multilingual platform for publishing bioinformatics research and case studies. This document details the new template structure, multilingual support, and implementation details.

## Project Structure

```
posts/
├── post-kpn.html                 # Portuguese - K. pneumoniae ST17 Analysis
├── post-acinetobacter.html       # Portuguese - Acinetobacter baumannii Analysis

en/posts/
├── post-kpn.html                 # English - K. pneumoniae ST17 Analysis
├── post-acinetobacter.html       # English - Acinetobacter baumannii Analysis

es/posts/
├── post-kpn.html                 # Spanish - K. pneumoniae ST17 Analysis
├── post-acinetobacter.html       # Spanish - Acinetobacter baumannii Analysis

blog.html                          # Portuguese Blog Index
en/blog.html                       # English Blog Index
es/blog.html                       # Spanish Blog Index
```

## Template Architecture

### Key Components

Each blog post follows a consistent structure:

1. **Header Section** (Lines 1-89)
   - Fixed navigation bar with DNA icon logo
   - Language selector (PT/EN/ES)
   - Mobile menu toggle
   - Navigation links to all main pages

2. **Breadcrumb Navigation** (Lines 103-109)
   - Blog > Post Title format
   - Easy navigation back to blog index

3. **Post Metadata** (Lines 140-150)
   - Publication date (calendar icon)
   - Author name (Felipe Lei)
   - Calculated reading time (clock icon)
   - Auto-calculated using 200 WPM baseline

4. **Category Tags** (Lines 152-156)
   - Green accent badges
   - Relevant tags: Resistência Antimicrobiana, Genômica, Vigilância Molecular

5. **Featured Image** (Lines 158-164)
   - Full-width responsive image
   - Max height constrained for consistent layout
   - Images from portfolio directory

6. **Author Bio Box** (Lines 165-180)
   - Green accent left border
   - Professional bio text
   - Felipe Alberto Lei credentials

7. **Main Content** (Lines 182+)
   - Semantic HTML heading hierarchy (h2, h3)
   - Structured paragraphs with proper spacing
   - Highlight boxes for important information

8. **Interactive Charts** (Chart.js)
   - Responsive chart containers
   - Multiple chart types: bar, line, doughnut
   - Dark theme compatible

9. **Post Navigation** (Lines 500+)
   - Previous/Next post links
   - Link back to blog index
   - Grid layout on larger screens

10. **Footer** (Lines 502-530)
    - Logo and company info
    - Social media links (GitHub, LinkedIn, Scholar, WhatsApp, Email)
    - Copyright with dynamic year
    - Dark theme consistent styling

### CSS Styling Classes

- `.metadata` - Flexbox container for date/author/reading time
- `.metadata-item` - Individual metadata item with icon
- `.tag` - Category badge with green accent
- `.breadcrumb` - Navigation breadcrumb with separators
- `.author-box` - Bio box with left border accent
- `.post-nav` - Grid navigation for previous/next posts
- `.chart-container` - Responsive container for Chart.js
- `.highlight-box` - Emphasis boxes for important information
- `.whatsapp-float` - Fixed WhatsApp button

### JavaScript Functionality

**Reading Time Calculator**:
```javascript
function calculateReadingTime() {
    const text = document.querySelector('main').innerText;
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    document.getElementById('reading-time').textContent = `${minutes} min leitura`;
}
```

**Mobile Menu Toggle**:
```javascript
document.getElementById('mobile-menu-button').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});
```

**Chart Configuration**:
- Tooltip callbacks for multi-line labels
- Vibrant color palette for data visualization
- Responsive sizing with maintainAspectRatio: false

## Multilingual Support

### Language Selector Pattern

Each post includes a language selector in the header:
```html
<div class="language-selector">
    <span class="lang-divider">|</span>
    <a href="../../posts/post-kpn.html" class="lang-option" data-lang="pt">PT</a>
    <a href="../../en/posts/post-kpn.html" class="lang-option" data-lang="en">EN</a>
    <a href="../../es/posts/post-kpn.html" class="lang-option active" data-lang="es">ES</a>
</div>
```

### Navigation Paths

**From Portuguese posts** (`/posts/post-xxx.html`):
- PT link: `posts/post-xxx.html` (same directory)
- EN link: `en/posts/post-xxx.html`
- ES link: `es/posts/post-xxx.html`

**From English posts** (`/en/posts/post-xxx.html`):
- PT link: `../../posts/post-xxx.html`
- EN link: `post-xxx.html` (same directory)
- ES link: `../../es/posts/post-xxx.html`

**From Spanish posts** (`/es/posts/post-xxx.html`):
- PT link: `../../posts/post-xxx.html`
- EN link: `../../en/posts/post-xxx.html`
- ES link: `post-xxx.html` (same directory)

### Blog Index Pages

Each language has a dedicated blog index page:
- **Portuguese**: `/blog.html` - Links to `/posts/post-xxx.html`
- **English**: `/en/blog.html` - Links to `/en/posts/post-xxx.html`
- **Spanish**: `/es/blog.html` - Links to `/es/posts/post-xxx.html`

## Published Posts

### 1. K. pneumoniae ST17 Analysis

**Files**:
- Portuguese: `posts/post-kpn.html` (680 lines)
- English: `en/posts/post-kpn.html` (680 lines)
- Spanish: `es/posts/post-kpn.html` (680 lines)

**Title**: "Análise Genômica de Klebsiella pneumoniae ST17 Coprodutor de KPC/NDM"

**Metadata**:
- Publication Date: October 22, 2025
- Author: Felipe Lei
- Reading Time: ~8 minutes
- Categories: Resistência Antimicrobiana, Genômica, Análise Epidemiológica

**Content Highlights**:
- K. pneumoniae ST17 genomic profile
- Dual carbapenemase production (KPC-2 + NDM-1)
- Resistance arsenal visualization
- Therapeutic challenges analysis
- Clinical context and recommendations

**Charts**:
- Resistome Bar Chart: 18 resistance genes across multiple classes
- ST Distribution Pie Chart: Clone prevalence in cohort

### 2. Acinetobacter baumannii Analysis

**Files**:
- Portuguese: `posts/post-acinetobacter.html` (750 lines)
- English: `en/posts/post-acinetobacter.html` (750 lines)
- Spanish: `es/posts/post-acinetobacter.html` (750 lines)

**Title**: "Vigilância Molecular de Acinetobacter baumannii: Análise Clonal e Dinâmicas de Sustitução"

**Metadata**:
- Publication Date: October 10, 2025
- Author: Felipe Lei
- Reading Time: ~10 minutes
- Categories: Resistência Antimicrobiana, Genômica, Vigilância Molecular

**Content Highlights**:
- Acinetobacter baumannii epidemiological profile
- Intrinsic and acquired resistance mechanisms
- Clonal dynamics and substitution analysis
- Pre/post-intervention case studies
- Recommendations for infection control

**Charts**:
- Period Chart: Clone A vs Clone B temporal distribution
- Gene Chart: Frequency of resistance genes (OXA-23, OXA-51, etc.)
- Clonal Chart: Global clonal distribution (doughnut)
- Substitution Chart: Pre vs post-intervention clonal composition

## Design System

### Color Palette

- **Primary**: #22c55e (Green) - Accent color, calls-to-action
- **Background**: #111827 (Dark Navy) - Main page background
- **Card**: #1f2937 (Dark Gray) - Card backgrounds
- **Text Primary**: #FFFFFF (White) - Main headings
- **Text Secondary**: #9CA3AF (Gray) - Descriptions, metadata
- **Accent Blues**: #00A0B0 (Acinetobacter palette)
- **Accent Reds**: #CC333F (Acinetobacter palette)
- **Accent Yellows**: #FFC914 (Accent color)

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
- **Headings**: Bold (700) with white color
- **Body**: Regular (400) with gray-300 color
- **Metadata**: Small (0.95rem), gray-400 color

### Responsive Design

- **Mobile First**: Base styles for mobile, enhanced for desktop
- **Breakpoints**: Tailwind MD (768px) for medium screens
- **Navigation**: Hamburger menu on mobile, full menu on desktop
- **Images**: Responsive with max-height constraints
- **Charts**: Responsive containers with fixed aspect ratios

## Performance Considerations

### Image Optimization
- All images served from GitHub raw CDN
- Max-height constraints prevent excessive bandwidth
- Lazy loading supported for modern browsers

### JavaScript
- Minimal inline scripts
- No external dependencies beyond Chart.js
- Reading time calculation on page load
- Mobile menu toggle for accessibility

### CSS
- Tailwind CSS via CDN
- Inline styles in `<style>` tags
- No external CSS files
- ~30KB per post HTML file

## SEO Optimization

Each post includes:
- Proper `<title>` tags with keywords
- Meta `description` tags
- Semantic HTML structure (header, nav, article, footer)
- Heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- Schema-compatible structure

## Maintenance Guidelines

### Adding New Posts

1. Copy existing post template (post-kpn.html or post-acinetobacter.html)
2. Update language-specific content (PT, EN, ES)
3. Place files in correct directories:
   - Portuguese: `/posts/post-xxx.html`
   - English: `/en/posts/post-xxx.html`
   - Spanish: `/es/posts/post-xxx.html`
4. Update blog index pages (blog.html, en/blog.html, es/blog.html)
5. Ensure language selectors use correct relative paths
6. Test all links and chart rendering
7. Commit changes with clear messages

### Updating Blog Index

1. Add new post card after existing cards
2. Use consistent structure (image, title, description, link)
3. Include publication date in ISO format
4. Link to correct post in respective language
5. Update language selector links
6. Test navigation and styling

### Translation Workflow

1. Create Portuguese post first with complete content
2. Translate title, metadata, and content to English
3. Use automatic translation as base (manually review/correct)
4. Translate to Spanish using same workflow
5. Maintain technical terminology consistency across languages
6. Test all three language versions

## Future Enhancements

- [ ] Post search/filtering functionality
- [ ] Category/tag filtering
- [ ] Related posts suggestions
- [ ] Comments/discussion section
- [ ] Post statistics (views, engagement)
- [ ] Email newsletter subscription
- [ ] Social media share buttons
- [ ] Table of contents for long posts

## Git Commits

### Phase 1: Initial Blog Template
- **Commit**: 63e1230
- **Message**: "Feat: Redesign blog posts with professional template"
- **Changes**: 3 files, 1862 insertions, 476 deletions
- **Files**: posts/post-kpn.html, posts/post-acinetobacter.html, en/posts/post-kpn.html

### Phase 2: Multilingual Support
- **Commit**: ab6c1d1
- **Message**: "Feat: Add English and Spanish translations for blog posts"
- **Changes**: 4 files, 2865 insertions, 1335 deletions
- **Files**: es/posts/post-kpn.html, en/posts/post-acinetobacter.html, es/posts/post-acinetobacter.html

### Phase 3: Blog Index Updates
- **Commit**: f67c0a3
- **Message**: "Feat: Update blog index pages with correct post links and metadata"
- **Changes**: 3 files, 14 insertions, 14 deletions
- **Files**: blog.html, en/blog.html, es/blog.html

## Testing Checklist

- [ ] All post links work correctly (PT/EN/ES)
- [ ] Language selectors display correctly
- [ ] Navigation menus are accessible
- [ ] Mobile menu toggles properly
- [ ] Charts render without errors
- [ ] Reading time calculates accurately
- [ ] Images load from CDN
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Footer links are correct
- [ ] WhatsApp button is functional
- [ ] Meta tags are present
- [ ] Page speed is acceptable

## Technical Stack

- **HTML5**: Semantic structure
- **CSS**: Tailwind CSS via CDN
- **JavaScript**: Vanilla JS (no frameworks)
- **Charts**: Chart.js via CDN
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Google Fonts (Poppins)
- **Hosting**: GitHub Pages (static)
- **CDN**: jsDelivr, Tailwind CDN, Font Awesome CDN

## Author Information

**Felipe Alberto Lei**
- Bioinformatician and Researcher
- Specialization: Genomic Analysis, Next-Generation Sequencing
- Focus: Antimicrobial Resistance Analysis
- Contact: contato@logikbioinfo.com.br
- GitHub: https://github.com/Felipeleii
- LinkedIn: https://www.linkedin.com/in/felipelei/
- Google Scholar: https://scholar.google.com/citations?user=0h7F7emPRFsC

---

**Document Version**: 1.0  
**Last Updated**: October 23, 2025  
**Status**: ✅ Complete and Ready for Production
