# Deployment Checklist for LogikBioinfo

## Pre-Deployment Verification

### Code Quality
- [ ] All HTML validates without errors
- [ ] No broken internal links
- [ ] All images load correctly
- [ ] CSS styles render properly across browsers
- [ ] JavaScript executes without console errors
- [ ] Mobile responsive design works on various screen sizes

### Forms Configuration
- [ ] All contact forms point to Formspree endpoint (`https://formspree.io/f/mkgqqrbw`)
- [ ] Portuguese form redirects to `/obrigado.html`
- [ ] English form redirects to `/en/thank-you.html`
- [ ] Spanish form redirects to `/es/gracias.html`
- [ ] Honeypot field present and hidden in all forms (`.hp-field` CSS)
- [ ] All forms use correct field names: `name`, `email`, `message`
- [ ] Language identifier present (`_language`: pt/en/es)
- [ ] Custom subject lines configured per language
- [ ] Accept-charset="UTF-8" attribute present on all forms

### Formspree Dashboard
- [ ] Formspree endpoint active and verified
- [ ] Recipient email configured: contato@logikbioinfo.com.br
- [ ] Email notifications enabled
- [ ] Reply-To configured to use sender's email
- [ ] Domain verification completed (optional but recommended)
- [ ] Spam protection settings reviewed
- [ ] Rate limiting configured if needed

### Thank-You Pages
- [ ] `/obrigado.html` exists and displays correctly (PT)
- [ ] `/en/thank-you.html` exists and displays correctly (EN)
- [ ] `/es/gracias.html` exists and displays correctly (ES)
- [ ] All thank-you pages include working navigation
- [ ] Language selectors on thank-you pages link correctly

### Floating Buttons
- [ ] WhatsApp button visible on all pages
- [ ] Email button visible on all pages (with correct per-language subject)
- [ ] Buttons don't obstruct content on mobile
- [ ] Buttons positioned correctly (bottom-right)
- [ ] Z-index ensures buttons appear above content
- [ ] Hover effects work properly

### Multilingual Support
- [ ] Portuguese (PT) form at `/sobre.html` works
- [ ] English (EN) form at `/en/sobre.html` works
- [ ] Spanish (ES) form at `/es/sobre.html` works
- [ ] Language switcher links work across all pages
- [ ] Language-specific subjects in mailto buttons work

### Static Site Compatibility
- [ ] No PHP files in repository
- [ ] No server-side code dependencies
- [ ] No hardcoded credentials or secrets
- [ ] All resources use HTTPS URLs
- [ ] No dynamic server requirements
- [ ] Site works on GitHub Pages

### Security
- [ ] No API keys or credentials in repository
- [ ] All external resources (CDN, fonts) use HTTPS
- [ ] Honeypot anti-spam field implemented correctly
- [ ] Forms use POST method (not GET)
- [ ] Email addresses not exposed in HTML (use obfuscation if needed)

### Performance
- [ ] Images optimized for web
- [ ] CDN resources cached properly
- [ ] Minimal external dependencies
- [ ] Pages load within acceptable time (< 3s)

## Testing Checklist

### Form Submission Tests
- [ ] Submit PT form with valid data → redirects to `/obrigado.html`
- [ ] Submit EN form with valid data → redirects to `/en/thank-you.html`
- [ ] Submit ES form with valid data → redirects to `/es/gracias.html`
- [ ] Verify emails arrive at contato@logikbioinfo.com.br
- [ ] Check Reply-To header set to sender's email
- [ ] Verify subject line matches language
- [ ] Confirm honeypot field blocks bot submissions
- [ ] Test form validation (empty fields should prevent submission)

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large mobile (414x896)

### Accessibility
- [ ] Form labels properly associated with inputs
- [ ] Tab navigation works correctly
- [ ] Floating buttons accessible via keyboard (tab focus visible)
- [ ] Color contrast meets WCAG AA standards
- [ ] Alt text present on images
- [ ] Screen reader compatibility tested (optional)

### SEO & Meta Tags
- [ ] Title tags present and descriptive
- [ ] Meta descriptions present
- [ ] Language tags correct (lang="pt-BR", lang="en", lang="es")
- [ ] Canonical URLs set if needed
- [ ] Social media meta tags present (optional)

## GitHub Pages Deployment

### Repository Configuration
- [ ] GitHub Pages enabled in repository settings
- [ ] Source branch set correctly (main/master)
- [ ] Custom domain configured if using (logikbioinfo.com.br)
- [ ] HTTPS enforced in GitHub Pages settings

### DNS Configuration (if using custom domain)
- [ ] A records point to GitHub Pages IPs
- [ ] CNAME file present in repository root
- [ ] Domain verification completed
- [ ] SSL certificate active (auto-provided by GitHub)

### Post-Deployment
- [ ] Site accessible at production URL
- [ ] All pages load without 404 errors
- [ ] Forms submit successfully from production
- [ ] Thank-you page redirects work
- [ ] Floating buttons work correctly
- [ ] Analytics configured (if applicable)

## Monitoring & Maintenance

### Regular Checks
- [ ] Monitor Formspree submission dashboard weekly
- [ ] Check email delivery success rate
- [ ] Review spam submissions and adjust filters if needed
- [ ] Verify forms still working after any site updates
- [ ] Test all language versions monthly

### Analytics (Optional)
- [ ] Track form submission events
- [ ] Monitor thank-you page visits
- [ ] Track mailto button clicks
- [ ] Review bounce rate on contact pages

### Backup & Recovery
- [ ] Repository backed up
- [ ] Form submissions archived (Formspree dashboard)
- [ ] DNS records documented
- [ ] Access credentials secured

## Troubleshooting Guide

### Form Not Submitting
1. Check browser console for JavaScript errors
2. Verify Formspree endpoint URL is correct
3. Test form with browser dev tools network tab
4. Ensure all required fields are filled
5. Check if honeypot field is being auto-filled by password manager

### Email Not Received
1. Check Formspree dashboard for submission
2. Verify recipient email in Formspree settings
3. Check spam/junk folder
4. Verify email notification enabled in Formspree
5. Test with different email provider

### Redirect Not Working
1. Verify `_redirect` URL is absolute (includes https://)
2. Check thank-you pages exist at specified URLs
3. Test redirect URL directly in browser
4. Clear browser cache and cookies
5. Check for JavaScript errors preventing redirect

### Styling Issues
1. Verify `.hp-field` CSS is present on all pages with forms
2. Check `.floating-mail` CSS is defined
3. Test in different browsers
4. Clear browser cache
5. Check for CSS conflicts with other styles

## Rollback Plan

If issues occur after deployment:

1. **Immediate**: Revert to previous commit via Git
2. **Forms**: Can temporarily disable by commenting out submit button
3. **Alternative**: Use mailto button as fallback during fixes
4. **Communication**: Update status on homepage if forms are down

## Sign-Off

- [ ] Developer tested all functionality
- [ ] QA verified checklist items
- [ ] Forms tested end-to-end
- [ ] Documentation updated
- [ ] Stakeholder approval obtained (if required)

**Deployment Date**: _________________

**Deployed By**: _________________

**Production URL**: https://logikbioinfo.com.br

**Formspree Endpoint**: https://formspree.io/f/mkgqqrbw

---

## Notes

- This checklist should be reviewed before each deployment
- Update this document as new features are added
- Keep a deployment log for reference
- Document any issues encountered and resolutions
