// Importamos Express, framework para crear servidores web con Node.js

const express = require("express");
const path = require("path");

// Helmet ayuda a configurar cabeceras HTTP de seguridad

const helmet = require("helmet");

// express-session permite trabajar con sesiones de usuario

const session = require("express-session");

// Creamos la aplicación

const app = express();

// Permitimos recibir datos en formato JSON

app.use(express.json());

// Aplicamos Helmet para mejorar la seguridad básica del servidor

app.use(helmet());

// Configuramos una política básica de Content Security Policy

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"], // ✅ permite CSS del mismo origen
      imgSrc: ["'self'", "data:"],
    },
  }),
);

// Configuramos sesiones seguras

app.use(
  session({
    // Clave secreta para firmar la sesión

    secret: "clave_secreta_de_ejemplo",

    // Evita guardar sesiones si no fueron modificadas

    resave: false,

    // Evita guardar sesiones vacías

    saveUninitialized: false,

    cookie: {
      // httpOnly evita que JavaScript del navegador acceda a la cookie

      httpOnly: true,

      // maxAge define duración de la sesión: 1 hora

      maxAge: 1000 * 60 * 60,
    },
  }),
);

// Ruta pública

app.use(express.static(path.join(__dirname, "../frontend")));

// Rutas
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Simulación de login

app.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  // Validación básica de entrada

  if (!usuario || !password) {
    return res.status(400).json({
      mensaje: "Debe ingresar usuario y contraseña.",
    });
  }

  // Simulación de usuario válido

  if (usuario === "admin" && password === "123456") {
    req.session.usuario = {
      nombre: "Administrador",

      rol: "admin",
    };

    return res.json({
      mensaje: "Inicio de sesión correcto.",
    });
  }

  res.status(401).json({
    mensaje: "Credenciales incorrectas.",
  });
});

// Middleware para verificar si el usuario inició sesión

function verificarSesion(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.status(401).json({
      mensaje: "Debe iniciar sesión para acceder a este recurso.",
    });
  }
}

// Middleware para verificar rol de administrador

function verificarAdmin(req, res, next) {
  if (req.session.usuario && req.session.usuario.rol === "admin") {
    next();
  } else {
    res.status(403).json({
      mensaje: "Acceso denegado. Se requiere rol administrador.",
    });
  }
}

// Ruta protegida

app.get("/panel", verificarSesion, verificarAdmin, (req, res) => {
  res.json({
    mensaje: "Bienvenido al panel de administración.",

    usuario: req.session.usuario,
  });
});

// Iniciamos servidor

app.listen(3000, () => {
  console.log("Servidor ejecutándose en localhost:3000");
});
