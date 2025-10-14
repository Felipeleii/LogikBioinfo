# Formspree Setup Documentation

## Overview

The LogikBioinfo website uses Formspree as a static-friendly contact form solution, compatible with GitHub Pages hosting. This eliminates the need for server-side code (PHP/SMTP) while maintaining secure and reliable form submissions.

## Formspree Configuration

### Endpoint
- **URL**: `https://formspree.io/f/mkgqqrbw`
- **Method**: POST
- **Charset**: UTF-8

### Recipient Email
The recipient email address is configured in the Formspree dashboard:
- **To**: contato@logikbioinfo.com.br

**Important**: The recipient email is managed in Formspree's dashboard and is NOT stored in the repository for security reasons.

## Form Implementation

### Required Fields

All contact forms include these standard fields:

```html
<form action="https://formspree.io/f/mkgqqrbw" method="POST" accept-charset="UTF-8">
  <!-- Hidden fields -->
  <input type="hidden" name="_subject" value="[Language-specific subject]">
  <input type="hidden" name="_language" value="[pt|en|es]">
  <input type="hidden" name="_redirect" value="[Thank-you page URL]">
  
  <!-- Visible fields -->
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  
  <!-- Honeypot anti-spam field -->
  <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off">
  
  <button type="submit">Send</button>
</form>
```

### Field Specifications

| Field Name | Type | Required | Purpose |
|------------|------|----------|---------|
| `name` | text | Yes | Sender's name |
| `email` | email | Yes | Sender's email (auto-validated) |
| `message` | textarea | Yes | Message content |
| `_subject` | hidden | No | Custom email subject |
| `_language` | hidden | No | Form language identifier |
| `_redirect` | hidden | No | Post-submission redirect URL |
| `website` | text (honeypot) | No | Anti-spam trap field |

### Language-Specific Configuration

#### Portuguese (PT)
- **Subject**: `Nova mensagem do site Logik Bioinfo`
- **Language**: `pt`
- **Redirect**: `https://logikbioinfo.com.br/obrigado.html`
- **Form location**: `/sobre.html`

#### English (EN)
- **Subject**: `New message from Logik Bioinfo website`
- **Language**: `en`
- **Redirect**: `https://logikbioinfo.com.br/en/thank-you.html`
- **Form location**: `/en/sobre.html`

#### Spanish (ES)
- **Subject**: `Nuevo mensaje del sitio web Logik Bioinfo`
- **Language**: `es`
- **Redirect**: `https://logikbioinfo.com.br/es/gracias.html`
- **Form location**: `/es/sobre.html`

## Anti-Spam Protection

### Honeypot Field
A hidden field named `website` is included in all forms:

```html
<input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off">
```

**CSS (required in all pages with forms)**:
```css
.hp-field { position: absolute; left: -9999px; }
```

**How it works**:
- Invisible to humans (positioned off-screen)
- Visible to bots (in HTML source)
- If filled, Formspree may flag as spam
- No layout shift (absolute positioning)

### Additional Formspree Protection
Formspree provides built-in spam filtering:
- reCAPTCHA (configurable in dashboard)
- Rate limiting
- IP blocking
- Domain verification

## Success Redirects

After successful submission, users are redirected to language-specific thank-you pages:

| Language | Thank-You Page |
|----------|----------------|
| PT | `/obrigado.html` |
| EN | `/en/thank-you.html` |
| ES | `/es/gracias.html` |

Each page includes:
- Success confirmation message
- Links back to main sections
- Consistent site branding and navigation

## Formspree Dashboard Configuration

### Recommended Settings

1. **Email Notifications**
   - Enable instant notifications to contato@logikbioinfo.com.br
   - Set up notification preferences

2. **Reply-To Configuration**
   - Configure to use sender's email as Reply-To
   - Allows direct email replies to form submissions

3. **Submission Storage**
   - Enable submission archive in dashboard
   - Set retention period as needed

4. **Domain Verification** (Optional)
   - Verify logikbioinfo.com.br domain
   - Prevents form hijacking
   - Improves deliverability

5. **Spam Protection**
   - Enable reCAPTCHA (optional)
   - Configure honeypot settings
   - Set rate limits if needed

## Testing

### Local Testing
Forms can be tested locally, but will redirect to production thank-you pages.

### Testing Checklist
- [ ] Form submits successfully
- [ ] Confirmation email received at contato@logikbioinfo.com.br
- [ ] Correct redirect to thank-you page
- [ ] Reply-To header set to sender's email
- [ ] Subject line matches language
- [ ] All field data captured correctly
- [ ] Honeypot field not visible
- [ ] Spam submissions blocked

### Test Submission
1. Navigate to a contact form page
2. Fill in valid data
3. Click Submit
4. Verify redirect to thank-you page
5. Check email inbox for notification

## Floating Email Button

In addition to contact forms, all pages include a floating email button:

**HTML**:
```html
<a href="mailto:contato@logikbioinfo.com.br?subject=[Language-specific]" 
   class="floating-mail" title="Send email">✉</a>
```

**CSS**:
```css
.floating-mail {
  position: fixed; right: 16px; bottom: 110px;
  width: 56px; height: 56px; border-radius: 50%;
  background: #22c55e; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; text-decoration: none;
  box-shadow: 0 8px 16px rgba(0,0,0,.15);
  z-index: 9999;
}
.floating-mail:hover { background: #16a34a; }
```

**Subjects by Language**:
- PT: `Contato – Logik Bioinfo`
- EN: `Contact – Logik Bioinfo`
- ES: `Contacto – Logik Bioinfo`

## Security Notes

1. **No Secrets in Repository**
   - Recipient email managed in Formspree dashboard
   - No API keys or credentials in code
   - Safe for public repositories

2. **HTTPS Required**
   - All form submissions over HTTPS
   - GitHub Pages provides SSL by default

3. **No HTTP_REFERER Requirement**
   - Works on any domain/localhost
   - No strict referer checking

4. **Data Privacy**
   - Form data sent directly to Formspree
   - No client-side storage
   - GDPR-compliant when configured properly

## Troubleshooting

### Form Not Submitting
- Verify Formspree endpoint URL
- Check browser console for errors
- Ensure all required fields are filled
- Verify HTTPS is used

### Not Receiving Emails
- Check Formspree dashboard submissions
- Verify recipient email in dashboard
- Check spam folder
- Verify email notification settings

### Redirect Not Working
- Check `_redirect` URL is absolute
- Verify thank-you pages exist
- Test redirect URL directly

### Honeypot Issues
- Ensure CSS class `.hp-field` is defined
- Verify field is positioned off-screen
- Check no JavaScript is auto-filling the field

## Migration Notes

### From PHP/SMTP
This setup replaces the previous PHP-based contact form implementation:
- ❌ No `sendmail.php` file needed
- ❌ No PHPMailer dependency
- ❌ No SMTP credentials
- ❌ No server-side execution
- ✅ Static-friendly (GitHub Pages compatible)
- ✅ Secure (no exposed credentials)
- ✅ Reliable (managed service)
- ✅ Scalable (handles traffic spikes)

## Support

- **Formspree Documentation**: https://help.formspree.io/
- **Formspree Status**: https://status.formspree.io/
- **Dashboard**: https://formspree.io/forms

## Changelog

### 2025-10-14
- Initial Formspree setup
- Migrated from PHP/SMTP to Formspree
- Added honeypot anti-spam protection
- Created language-specific thank-you pages
- Added floating mailto buttons
- Standardized field names (name, email, message)
