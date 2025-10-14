# Trilingual Website Deployment Checklist

## Pre-Deployment Tasks

### 1. SMTP Configuration ⚠️ REQUIRED
- [ ] Open `sendmail.php`
- [ ] Update `SMTP_USERNAME` with actual email address
- [ ] Update `SMTP_PASSWORD` with actual SMTP password
- [ ] Verify `SMTP_HOST` is correct (smtp.kinghost.net)
- [ ] Verify `RECIPIENT_EMAIL` is correct (felipe.lei@unifesp.br)
- [ ] Save and test locally if possible

### 2. PHPMailer Installation
- [ ] Install PHPMailer via Composer: `composer require phpmailer/phpmailer`
- OR [ ] Download PHPMailer manually and place in `vendor/PHPMailer/` directory
- [ ] Verify the following files exist:
  - `vendor/PHPMailer/src/Exception.php`
  - `vendor/PHPMailer/src/PHPMailer.php`
  - `vendor/PHPMailer/src/SMTP.php`

### 3. File Permissions
- [ ] Set sendmail.php to 644 permissions
- [ ] Ensure web server can execute PHP files
- [ ] Verify vendor directory has appropriate permissions (755)

## Deployment

### 4. Upload Files
Upload all files from the branch to the web server:
- [ ] All root-level HTML files (index.html, servicos.html, etc.)
- [ ] sendmail.php
- [ ] en/ directory with all HTML files
- [ ] es/ directory with all HTML files
- [ ] vendor/ directory (if using manual PHPMailer installation)
- [ ] All existing directories (css, js, img, portfolio, posts)

### 5. Testing

#### Navigation Testing
- [ ] Test PT to EN language switching on all pages
- [ ] Test PT to ES language switching on all pages
- [ ] Test EN to PT language switching on all pages
- [ ] Test EN to ES language switching on all pages
- [ ] Test ES to PT language switching on all pages
- [ ] Test ES to EN language switching on all pages
- [ ] Verify all navigation links work within each language
- [ ] Test mobile menu navigation in all languages

#### Contact Form Testing
- [ ] Test PT contact form (sobre.html)
  - [ ] Fill with valid data and submit
  - [ ] Verify email received
  - [ ] Check email formatting
  - [ ] Test with invalid email
  - [ ] Test with empty fields
- [ ] Test EN contact form (en/sobre.html)
  - [ ] Fill with valid data and submit
  - [ ] Verify email received
  - [ ] Check email is in English subject
  - [ ] Verify redirect goes to EN page
- [ ] Test ES contact form (es/sobre.html)
  - [ ] Fill with valid data and submit
  - [ ] Verify email received
  - [ ] Check email is in Spanish subject
  - [ ] Verify redirect goes to ES page

#### Content Verification
- [ ] Check PT pages display correctly
- [ ] Check EN pages display correctly
- [ ] Check ES pages display correctly
- [ ] Verify all images load
- [ ] Verify all styles apply correctly
- [ ] Test on mobile devices
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

## Post-Deployment

### 6. Monitoring
- [ ] Monitor server error logs for PHP errors
- [ ] Check email delivery for first few submissions
- [ ] Monitor spam folder if emails not arriving
- [ ] Set up email notifications for form submissions (optional)

### 7. SEO and Analytics
- [ ] Submit sitemap to search engines if applicable
- [ ] Verify Google Analytics tracking (if implemented)
- [ ] Check meta descriptions in all languages
- [ ] Verify hreflang tags if implementing (recommended for multilingual SEO)

### 8. Documentation
- [ ] Share SENDMAIL_SETUP.md with team
- [ ] Document SMTP credentials securely (password manager)
- [ ] Update any internal wikis or documentation
- [ ] Note any customizations made during deployment

## Troubleshooting

### Common Issues and Solutions

**Contact form not sending emails:**
1. Check PHP error logs
2. Verify SMTP credentials are correct
3. Test SMTP connection separately
4. Check firewall isn't blocking SMTP port
5. Verify PHPMailer is properly installed

**Language switcher not working:**
1. Verify all language files exist
2. Check file paths are correct (../ for parent directory)
3. Test on web server, not just locally
4. Clear browser cache

**Pages not displaying correctly:**
1. Check file upload completed successfully
2. Verify file permissions
3. Check for PHP errors in logs
4. Test with different browsers

**Emails going to spam:**
1. Add SPF record to domain DNS
2. Set up DKIM signing
3. Use professional from-address
4. Ask recipients to whitelist the address

## Rollback Plan

If issues arise after deployment:

1. **Immediate:** Revert sobre.html forms to use Formspree
   - Change action back to `https://formspree.io/f/mkgqqrbw`
   
2. **If needed:** Remove new language pages
   - Remove en/*.html files (except index.html and sobre.html which already existed)
   - Remove es/*.html files (except index.html which already existed)
   
3. **Contact:** Reach out to repository owner for assistance

## Success Criteria

Deployment is successful when:
- [x] All 15 new pages are accessible
- [x] Contact forms in all 3 languages work and send emails
- [x] Language switching works correctly
- [x] All navigation links function properly
- [x] No PHP errors in server logs
- [x] Emails are received and properly formatted
- [x] Mobile responsiveness works correctly

## Notes

- Keep the old Formspree endpoint as backup initially
- Monitor email delivery for the first 24 hours
- Be prepared to quickly update SMTP settings if issues occur
- Test thoroughly before announcing multilingual support

---

**Prepared by:** GitHub Copilot
**Date:** 2025-10-14
**Branch:** copilot/add-multilingual-support-pages
