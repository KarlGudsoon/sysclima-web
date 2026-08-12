<?php
// Front controller: despacha las rutas /api/* hacia sus controladores.
//
//   POST /api/contact -> contact_crear()  (formulario de contacto: BD + correo)

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

if (!in_array($controller, ['contact'], true)) {
    json_response(404, ['message' => 'Ruta no encontrada']);
}

require_once __DIR__ . "/{$controller}.php";

$fn = "{$controller}_{$action}";
if (!function_exists($fn)) {
    json_response(404, ['message' => 'Acción no encontrada']);
}

$fn($param);
