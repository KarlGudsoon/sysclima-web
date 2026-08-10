<?php
// Configuración de la aplicación.
// En desarrollo (Docker) usa las variables de entorno del docker-compose.yml.
// En el hosting compartido, si las variables no existen, edita aquí los valores.

if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'sysclima');
define('DB_USER', getenv('DB_USER') ?: 'sysclima');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: 'sysclima123');
define('DB_CHARSET', 'utf8mb4');

error_reporting(E_ALL);
ini_set('display_errors', getenv('APP_ENV') === 'dev' ? '1' : '0');

// Cookie de sesión segura (HttpOnly + SameSite; Secure solo si hay HTTPS)
session_set_cookie_params([
    'httponly' => true,
    'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Lax',
]);
session_start();
