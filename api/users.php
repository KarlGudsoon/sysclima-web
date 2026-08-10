<?php
if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

function users_perfil(): void {
    requiere_login();
    json_response(200, [
        'usuario' => [
            'username' => $_SESSION['username'],
            'email'    => $_SESSION['email'],
            'rol'      => $_SESSION['rol'],
        ],
    ]);
}

function users_admin(): void {
    requiere_admin();
    json_response(200, ['message' => 'Hola admin ' . $_SESSION['username']]);
}
