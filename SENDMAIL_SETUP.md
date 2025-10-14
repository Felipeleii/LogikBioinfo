# SendMail Configuration Guide

## Overview

The `sendmail.php` file provides SMTP email functionality for the LogikBioinfo contact forms across all language versions (Portuguese, English, and Spanish).

## Features

- Uses PHPMailer library with SMTP authentication
- Supports multiple languages (PT, EN, ES)
- Includes spam protection via honeypot field
- HTML-formatted emails with professional styling
- Automatic language detection for appropriate redirects
- Error handling and logging

## Requirements

### PHP Extensions
- PHP 7.0 or higher
- PHP mail functions enabled
- cURL (for SMTP communication)

### PHPMailer Library
The code expects PHPMailer to be installed in the `vendor/PHPMailer/` directory. You can install it via:

**Option 1: Composer (Recommended)**
```bash
composer require phpmailer/phpmailer
```

**Option 2: Manual Installation**
1. Download PHPMailer from https://github.com/PHPMailer/PHPMailer
2. Extract to `vendor/PHPMailer/` directory
3. Ensure the following files are present:
   - `vendor/PHPMailer/src/Exception.php`
   - `vendor/PHPMailer/src/PHPMailer.php`
   - `vendor/PHPMailer/src/SMTP.php`

## Configuration

**IMPORTANT:** Before deploying, update the following constants in `sendmail.php`:

```php
define('SMTP_HOST', 'smtp.kinghost.net');           // Your SMTP server
define('SMTP_PORT', 587);                            // SMTP port (587 for TLS, 465 for SSL)
define('SMTP_USERNAME', 'contact@logikbioinfo.com'); // Your SMTP username/email
define('SMTP_PASSWORD', 'your-smtp-password-here'); // Your SMTP password - CHANGE THIS!
define('SMTP_FROM_EMAIL', 'contact@logikbioinfo.com'); // From email address
define('SMTP_FROM_NAME', 'Logik Bioinfo');          // From name
define('RECIPIENT_EMAIL', 'felipe.lei@unifesp.br'); // Where to send emails
```

### KingHost Specific Settings

For KingHost hosting:
- SMTP Host: `smtp.kinghost.net`
- SMTP Port: `587` (STARTTLS)
- Authentication: Required
- Username: Your full email address (e.g., contact@logikbioinfo.com)
- Password: Your email account password

## Form Integration

All three language versions now use this PHP script:

### Portuguese (sobre.html)
```html
<form action="sendmail.php" method="POST">
    <input type="hidden" name="_language" value="pt">
    <!-- form fields -->
</form>
```

### English (en/sobre.html)
```html
<form action="../sendmail.php" method="POST">
    <input type="hidden" name="_language" value="en">
    <!-- form fields -->
</form>
```

### Spanish (es/sobre.html)
```html
<form action="../sendmail.php" method="POST">
    <input type="hidden" name="_language" value="es">
    <!-- form fields -->
</form>
```

## Form Fields

Required fields:
- `nome` - Name
- `email` - Email address (validated)
- `mensagem` - Message
- `_language` - Language code (pt, en, or es)
- `_gotcha` - Honeypot field (hidden, should remain empty)

## Security Features

1. **Honeypot Field**: The `_gotcha` field catches bots. If filled, the form silently redirects without sending email.

2. **Email Validation**: Server-side validation of email format using PHP's `FILTER_VALIDATE_EMAIL`.

3. **Input Sanitization**: All user inputs are sanitized with `htmlspecialchars()` before being included in the email.

4. **SMTP Authentication**: Uses secure SMTP authentication to prevent email spoofing.

## Success/Error Handling

### Success
- User is redirected back to the contact page with `?success=1` parameter
- Language-appropriate redirect:
  - PT: `/sobre.html?success=1`
  - EN: `/en/sobre.html?success=1`
  - ES: `/es/sobre.html?success=1`

### Error
- HTTP 500 status code
- Error message displayed
- Link to go back to the form
- Error logged to PHP error log (production)

## Email Format

Emails are sent in HTML format with a professional design including:
- Green header with Logik Bioinfo branding
- Clearly labeled fields (Name, Email, Message)
- Timestamp
- Clean, readable layout
- Plain text alternative for email clients that don't support HTML

## Testing

Before going live:

1. **Update credentials** in sendmail.php
2. **Test form submission** from all three language versions
3. **Verify emails arrive** at the recipient address
4. **Check spam folder** if emails don't appear
5. **Test error handling** by providing invalid data
6. **Verify honeypot** works by filling the hidden field

## Troubleshooting

### Common Issues

**Emails not sending:**
- Check SMTP credentials are correct
- Verify SMTP port is not blocked by firewall
- Check PHP error logs for detailed error messages
- Ensure PHPMailer is properly installed

**Authentication failed:**
- Verify username is the full email address
- Check password is correct
- Confirm SMTP server allows external connections

**Emails going to spam:**
- Add SPF record to domain DNS
- Set up DKIM authentication
- Use a professional from-address on the same domain

**Permission errors:**
- Ensure sendmail.php has appropriate file permissions (644)
- Check that the web server can write to error logs

## Maintenance

Regular maintenance tasks:
- Monitor error logs for failed email attempts
- Update PHPMailer library periodically for security patches
- Review and update spam protection measures as needed
- Test form functionality after hosting/server changes

## File Locations

- Main script: `/sendmail.php`
- Portuguese form: `/sobre.html`
- English form: `/en/sobre.html`
- Spanish form: `/es/sobre.html`

## Support

For issues related to:
- PHPMailer: https://github.com/PHPMailer/PHPMailer
- KingHost SMTP: Contact KingHost support
- Form functionality: Review this guide and check error logs
