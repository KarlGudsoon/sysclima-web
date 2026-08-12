<?php
if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

require_once __DIR__ . '/mailer.php';

function contact_index(): void {
    contact_crear();
}

function contact_crear(): void {
    $data    = json_decode(file_get_contents('php://input'), true);
    $nombre  = trim($data['nombre'] ?? '');
    $email   = trim($data['email'] ?? '');
    $mensaje = trim($data['mensaje'] ?? '');

    if ($nombre === '' || $email === '' || $mensaje === '') {
        json_response(400, ['message' => 'Todos los campos son obligatorios']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(400, ['message' => 'Correo electrónico no válido']);
    }

    $stmt = db()->prepare(
        'INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)'
    );
    $stmt->execute([$nombre, $email, $mensaje]);

    enviar_mail_contacto($nombre, $email, $mensaje);

    json_response(201, ['message' => '¡Mensaje enviado con éxito!']);
}
