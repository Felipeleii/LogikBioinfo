<?php
/**
 * LogikBioinfo Contact Form Handler
 * Sends emails using PHPMailer with SMTP (KingHost)
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader (if using Composer) or require PHPMailer files manually
// For manual installation:
require 'vendor/PHPMailer/src/Exception.php';
require 'vendor/PHPMailer/src/PHPMailer.php';
require 'vendor/PHPMailer/src/SMTP.php';

// Configuration - UPDATE THESE WITH YOUR ACTUAL CREDENTIALS
define('SMTP_HOST', 'smtp.kinghost.net');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'contact@logikbioinfo.com'); // Replace with your email
define('SMTP_PASSWORD', 'your-smtp-password-here'); // Replace with your SMTP password
define('SMTP_FROM_EMAIL', 'contact@logikbioinfo.com'); // Replace with your from email
define('SMTP_FROM_NAME', 'Logik Bioinfo');
define('RECIPIENT_EMAIL', 'felipe.lei@unifesp.br'); // Replace with recipient email

// Set content type header
header('Content-Type: text/html; charset=utf-8');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die('Method Not Allowed');
}

// Honeypot field check (spam protection)
if (!empty($_POST['_gotcha'])) {
    // Bot detected - exit silently
    exit;
}

// Get form data
$nome = isset($_POST['nome']) ? trim($_POST['nome']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$mensagem = isset($_POST['mensagem']) ? trim($_POST['mensagem']) : '';
$language = isset($_POST['_language']) ? trim($_POST['_language']) : 'pt';

// Validate required fields
if (empty($nome) || empty($email) || empty($mensagem)) {
    http_response_code(400);
    die('All fields are required / Todos los campos son obligatorios / Tous les champs sont requis');
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die('Invalid email address / Dirección de correo electrónico no válida / Adresse e-mail invalide');
}

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';
    
    // Recipients
    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addAddress(RECIPIENT_EMAIL);
    $mail->addReplyTo($email, $nome);
    
    // Content
    $mail->isHTML(true);
    
    // Set subject based on language
    $subjects = [
        'pt' => 'Nova mensagem do site Logik Bioinfo',
        'en' => 'New message from Logik Bioinfo website',
        'es' => 'Nuevo mensaje del sitio web Logik Bioinfo'
    ];
    $mail->Subject = isset($subjects[$language]) ? $subjects[$language] : $subjects['pt'];
    
    // Build email body
    $mailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #22c55e; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #555; }
            .field-value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #22c55e; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>🧬 Logik Bioinfo - Contact Form</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='field-label'>Name / Nome / Nombre:</div>
                    <div class='field-value'>" . htmlspecialchars($nome) . "</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Email:</div>
                    <div class='field-value'>" . htmlspecialchars($email) . "</div>
                </div>
                <div class='field'>
                    <div class='field-label'>Message / Mensagem / Mensaje:</div>
                    <div class='field-value'>" . nl2br(htmlspecialchars($mensagem)) . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This message was sent from the contact form at logikbioinfo.com</p>
                <p>Sent: " . date('Y-m-d H:i:s') . "</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->Body = $mailBody;
    
    // Alternative plain text body (sanitized)
    $mail->AltBody = "Name: " . strip_tags($nome) . "\nEmail: " . strip_tags($email) . "\n\nMessage:\n" . strip_tags($mensagem) . "\n\n---\nSent from logikbioinfo.com contact form";
    
    // Send email
    $mail->send();
    
    // Success - redirect to appropriate contact page with success parameter
    if ($language === 'en') {
        $redirectUrl = '/en/sobre.html?success=1';
    } elseif ($language === 'es') {
        $redirectUrl = '/es/sobre.html?success=1';
    } else {
        $redirectUrl = '/sobre.html?success=1';
    }
    
    header('Location: ' . $redirectUrl);
    exit;
    
} catch (Exception $e) {
    // Log error for debugging (in production, this goes to error log)
    error_log("Email sending failed: {$mail->ErrorInfo}");
    
    // Show user-friendly error message without exposing system details
    http_response_code(500);
    
    // Determine appropriate error message based on language
    $errorMessages = [
        'pt' => 'Desculpe, houve um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.',
        'en' => 'Sorry, there was an error sending your message. Please try again later.',
        'es' => 'Lo sentimos, hubo un error al enviar su mensaje. Por favor, inténtelo de nuevo más tarde.'
    ];
    
    $errorMessage = isset($errorMessages[$language]) ? $errorMessages[$language] : $errorMessages['pt'];
    
    echo "<!DOCTYPE html>
    <html lang='" . htmlspecialchars($language) . "'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Error | Logik Bioinfo</title>
        <script src='https://cdn.tailwindcss.com'></script>
    </head>
    <body class='bg-gray-900 text-white'>
        <div class='container mx-auto px-6 py-20 text-center'>
            <h1 class='text-4xl font-bold mb-4'>⚠️ Error</h1>
            <p class='text-xl mb-8'>" . htmlspecialchars($errorMessage) . "</p>
            <a href='javascript:history.back()' class='inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300'>
                " . ($language === 'es' ? 'Volver' : ($language === 'en' ? 'Go Back' : 'Voltar')) . "
            </a>
        </div>
    </body>
    </html>";
}
