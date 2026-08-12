<?php
// Configuración de la aplicación.
//
// PRIORIDAD de valores:
//   1) sysclima-config.php (fuera de public_html, en el hosting)   -> edítalo ALLÍ
//   2) Variables de entorno (Docker) del docker-compose.yml
//   3) Valores por defecto de desarrollo
//
// En el hosting NO edites este archivo: coloca el archivo externo en
// /home/<tu_usuario>/sysclima-config.php (ruta autodetectada) y rellena
// allí las credenciales reales (ver plantilla sysclima-config.php).

if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

function env_or(string $key, string $default = ''): string {
    $value = getenv($key);
    return $value === false ? $default : $value;
}

// Archivo de configuración externo (fuera del webroot).
// En el hosting: /home/<usuario>/sysclima-config.php
// En desarrollo: no existe -> se usan los valores de abajo / variables del compose.
$config_externo = getenv('APP_EXTERNAL_CONFIG')
    ?: dirname($_SERVER['DOCUMENT_ROOT']) . '/sysclima-config.php';

if (is_readable($config_externo)) {
    require $config_externo;
}

// ==================== BASE DE DATOS ====================
if (!defined('DB_HOST'))     define('DB_HOST', getenv('DB_HOST'));
if (!defined('DB_PORT'))     define('DB_PORT', getenv('DB_PORT'));
if (!defined('DB_NAME'))     define('DB_NAME', getenv('DB_NAME'));
if (!defined('DB_USER'))     define('DB_USER', getenv('DB_USER'));
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', getenv('DB_PASSWORD'));
if (!defined('DB_CHARSET'))  define('DB_CHARSET', 'utf8mb4');

// ==================== CORREO (SMTP) ====================
if (!defined('MAIL_SMTP_HOST'))     define('MAIL_SMTP_HOST', getenv('MAIL_SMTP_HOST'));
if (!defined('MAIL_SMTP_PORT'))     define('MAIL_SMTP_PORT', (int) getenv('MAIL_SMTP_PORT'));
if (!defined('MAIL_SMTP_USER'))     define('MAIL_SMTP_USER', getenv('MAIL_SMTP_USER'));
if (!defined('MAIL_SMTP_PASSWORD')) define('MAIL_SMTP_PASSWORD', getenv('MAIL_SMTP_PASSWORD'));
if (!defined('MAIL_SMTP_SECURE'))   define('MAIL_SMTP_SECURE', getenv('MAIL_SMTP_SECURE'));
if (!defined('MAIL_SMTP_AUTH'))     define('MAIL_SMTP_AUTH', getenv('MAIL_SMTP_AUTH'));
if (!defined('MAIL_FROM'))          define('MAIL_FROM', getenv('MAIL_FROM'));
if (!defined('MAIL_FROM_NAME'))     define('MAIL_FROM_NAME', getenv('MAIL_FROM_NAME'));
if (!defined('MAIL_TO'))            define('MAIL_TO', getenv('MAIL_TO'));
if (!defined('MAIL_SUBJECT'))       define('MAIL_SUBJECT', getenv('MAIL_SUBJECT'));

error_reporting(E_ALL);
