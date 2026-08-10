<?php
if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

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

    $stmt = db()->prepare(
        'INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)'
    );
    $stmt->execute([$nombre, $email, $mensaje]);

    json_response(201, ['message' => '¡Mensaje enviado con éxito!']);
}

function contact_mensajes(?string $id = null): void {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        requiere_admin();
        $stmt = db()->query('SELECT id, nombre, email, mensaje, fecha FROM mensajes ORDER BY fecha DESC');
        json_response(200, ['mensajes' => $stmt->fetchAll()]);
    }

    if ($method === 'DELETE') {
        requiere_admin();

        if ($id === null) {
            db()->exec('DELETE FROM mensajes');
            json_response(200, ['message' => 'Todos los mensajes han sido eliminados']);
        }

        $stmt = db()->prepare('DELETE FROM mensajes WHERE id = ?');
        $stmt->execute([(int) $id]);

        if ($stmt->rowCount() === 0) {
            json_response(404, ['message' => 'Mensaje no encontrado']);
        }

        json_response(200, ['message' => 'Mensaje eliminado con éxito']);
    }

    json_response(405, ['message' => 'Método no permitido']);
}
