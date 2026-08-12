<?php
// ============================================================
// SYSCLIMA-WEB | Configuración del HOSTING (fuera de public_html)
// ============================================================
//
// ESTE ARCHIVO VA FUERA DEL WEBROOT. En un hosting cPanel:
//   /home/<tu_usuario>/sysclima-config.php
//
// La ruta se autodetecta con dirname($_SERVER['DOCUMENT_ROOT']):
//   si tu sitio está en /home/usuario/public_html, busca en /home/usuario/
//
// PASOS:
//   1) Copia este archivo a /home/<tu_usuario>/sysclima-config.php
//   2) Rellena los valores con los datos REALES de tu hosting
//   3) NO dejes una copia con credenciales dentro de public_html
//
// Los valores definidos aquí tienen prioridad sobre api/config.php,
// que solo se usa para desarrollo (Docker).
// ============================================================

if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

// ==================== BASE DE DATOS (MySQL) ====================
// Datos de la base creada desde el panel del hosting (cPanel > Bases de datos MySQL).
define('DB_HOST', 'localhost');            // casi siempre 'localhost'
define('DB_PORT', '3306');
define('DB_NAME', 'sysclima');
define('DB_USER', 'sysclima');
define('DB_PASSWORD', 'sysclima123');

// ==================== CORREO (SMTP) ====================
// Datos del correo del hosting. Usa la casilla contact@sysclima.cl.
define('MAIL_SMTP_HOST', 'mail.sysclima.cl');      // servidor SMTP del hosting
define('MAIL_SMTP_PORT', 587);                     // 587 (TLS) | 465 (SSL) | 25 (sin cifrar)
define('MAIL_SMTP_USER', 'contact@sysclima.cl');   // casilla completa
define('MAIL_SMTP_PASSWORD', 'TU_CLAVE_MAIL');     // contraseña de la casilla
define('MAIL_SMTP_SECURE', 'tls');                 // 'tls' | 'ssl' | '' (sin cifrado)
define('MAIL_SMTP_AUTH', true);

define('MAIL_FROM', 'contact@sysclima.cl');
define('MAIL_FROM_NAME', 'SyS Climatización');

// Destinatarios del formulario de contacto (tus dos correos del hosting).
define('MAIL_TO', [
    'correo1@sysclima.cl',
    'correo2@sysclima.cl',
]);

define('MAIL_SUBJECT', 'Nuevo mensaje de contacto - SyS Climatización');
