<?php
if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

function json_response(int $status, array $data): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function requiere_login(): void {
    if (empty($_SESSION['user_id'])) {
        json_response(401, ['message' => 'No has iniciado sesión']);
    }
}

function requiere_admin(): void {
    requiere_login();
    if (($_SESSION['rol'] ?? '') !== 'admin') {
        json_response(403, ['message' => 'Acceso restringido a administradores']);
    }
}
