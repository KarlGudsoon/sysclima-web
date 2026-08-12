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
