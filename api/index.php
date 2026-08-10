<?php
// Front controller: despacha las rutas /api/* hacia sus controladores.
//
//   GET    /api/auth/session          -> auth_session()
//   POST   /api/auth/register         -> auth_register()
//   POST   /api/auth/login            -> auth_login()
//   POST   /api/auth/logout           -> auth_logout()
//   GET    /api/users/perfil          -> users_perfil()
//   GET    /api/users/admin           -> users_admin()
//   POST   /api/contact               -> contact_crear()
//   GET    /api/contact/mensajes      -> contact_mensajes()
//   DELETE /api/contact/mensajes      -> contact_mensajes()
//   DELETE /api/contact/mensajes/{id} -> contact_mensajes($id)

define('SYS_CLIMA', true);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (!preg_match('#/api/([a-z]+)(?:/([a-z]+))?(?:/([^/]+))?$#i', $uri, $m)) {
    json_response(404, ['message' => 'Ruta no encontrada']);
}

$controller = strtolower($m[1]);
$action     = strtolower($m[2] ?? 'index');
$param      = $m[3] ?? null;

if (!in_array($controller, ['auth', 'contact', 'users'], true)) {
    json_response(404, ['message' => 'Ruta no encontrada']);
}

require_once __DIR__ . "/{$controller}.php";

$fn = "{$controller}_{$action}";
if (!function_exists($fn)) {
    json_response(404, ['message' => 'Acción no encontrada']);
}

$fn($param);
