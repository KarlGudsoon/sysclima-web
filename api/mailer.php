<?php
if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

// Envía el correo del formulario de contacto vía SMTP (PHPMailer).
// Devuelve true si se envió; en caso de error registra y devuelve false
// sin romper la respuesta del formulario.
function enviar_mail_contacto(string $nombre, string $email, string $mensaje): bool {
    require_once __DIR__ . '/vendor/PHPMailer/Exception.php';
    require_once __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
    require_once __DIR__ . '/vendor/PHPMailer/SMTP.php';

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = MAIL_SMTP_HOST;
        $mail->SMTPAuth   = MAIL_SMTP_AUTH;
        $mail->Username   = MAIL_SMTP_USER;
        $mail->Password   = MAIL_SMTP_PASSWORD;
        $mail->Port       = MAIL_SMTP_PORT;
        $mail->SMTPSecure = MAIL_SMTP_SECURE; // 'tls' | 'ssl' | '' (sin cifrar)
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
        foreach (MAIL_TO as $destino) {
            $mail->addAddress($destino);
        }
        $mail->addReplyTo($email, $nombre);

        $mail->Subject = MAIL_SUBJECT;
        $mail->Body    = "
        <!doctype html>
        <html lang='es'>
        <head>
            <meta charset='UTF-8'/>
            <style'
            @font-face {
                font-family: 'Lexend';
                src: url('/assets/fonts/Lexend-VariableFont_wght.woff2')
                format('woff2-variations');
                font-weight: 100 900;
                font-style: normal;
                font-display: swap;
            }
            body {
                font-family: Lexend, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                margin: 0 auto;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .content {
                background-color: #eaf3fa;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #033275;
                border-bottom: 2px solid #033275;
                padding-bottom: 10px;
            }
            h3 {
                color: #033275;
                margin-top: 25px;
            }
            .info-block {
                margin-bottom: 15px;
            }
            strong {
                color: #333;
                display: inline-block;
                width: 200px;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 12px;
            }
            </style>
        </head>
        <body>
            <div class='container'>
            <div class='content'>
                <h2>Nuevo mensaje de formulario de contacto</h2>

                <div class='info-section'>
                <h3>Datos del contacto</h3>
                <div class='info-block'><strong>Nombre:</strong> $nombre</div>
                <div class='info-block'><strong>Correo:</strong> $email</div>
                <div class='info-block'><strong>Dirección:</strong> $mensaje</div>
                </div>

                <div class='footer'>
                <p>Este es un correo automático del sistema de contacto.</p>
                <p>Fecha de registro: " . date('d/m/Y H:i:s') . "</p>
                </div>
            </div>
            </div>
        </body>
        </html>
        ";

        return $mail->send();
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        error_log('[contacto] Error SMTP: ' . $mail->ErrorInfo);
        return false;
    }
}
