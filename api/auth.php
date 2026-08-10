<?php
if (!defined('SYS_CLIMA')) {
    http_response_code(403);
    exit('Acceso denegado');
}

function auth_register(): void {
    $data     = json_decode(file_get_contents('php://input'), true);
    $username = trim($data['username'] ?? '');
    $email    = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if ($username === '' || $email === '' || $password === '') {
        json_response(400, ['message' => 'Todos los campos son obligatorios']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(400, ['message' => 'Correo electrónico no válido']);
    }
    if (strlen($password) < 6) {
        json_response(400, ['message' => 'La contraseña debe tener al menos 6 caracteres']);
    }

    $stmt = db()->prepare('SELECT id FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(409, ['message' => 'El email ya está registrado']);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = db()->prepare(
        'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$username, $email, $hash, 'admin']);

    json_response(201, ['message' => '¡Usuario registrado con éxito!']);
}

function auth_login(): void {
    $data     = json_decode(file_get_contents('php://input'), true);
    $email    = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if ($email === '' || $password === '') {
        json_response(400, ['message' => 'Email y contraseña son obligatorios']);
    }

    $stmt = db()->prepare('SELECT * FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    if (!$usuario || !password_verify($password, $usuario['password'])) {
        json_response(401, ['message' => 'Credenciales incorrectas']);
    }

    // Evita fijación de sesión
    session_regenerate_id(true);

    $_SESSION['user_id']  = $usuario['id'];
    $_SESSION['username'] = $usuario['username'];
    $_SESSION['email']    = $usuario['email'];
    $_SESSION['rol']      = $usuario['rol'];

    json_response(200, [
        'message' => "Bienvenido, {$usuario['username']}",
        'usuario' => [
            'username' => $usuario['username'],
            'email'    => $usuario['email'],
            'rol'      => $usuario['rol'],
        ],
    ]);
}

function auth_logout(): void {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $p['path'],
            $p['domain'],
            $p['secure'],
            $p['httponly']
        );
    }

    session_destroy();
    json_response(200, ['message' => 'Sesión cerrada']);
}

function auth_session(): void {
    requiere_login();
    json_response(200, [
        'usuario' => [
            'username' => $_SESSION['username'],
            'email'    => $_SESSION['email'],
            'rol'      => $_SESSION['rol'],
        ],
    ]);
}
