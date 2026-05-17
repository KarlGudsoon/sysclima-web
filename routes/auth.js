const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET = "mi_clave_secreta";

const usuarios = [
  {
    username: "admin",
    email: "admin@gmail.com",
    password: "$2b$10$rx4QscS8ujlf5ZC4yKnpl.pK81KTuX7ldxDl2gSjNLijrE58b4Y8y",
    rol: "admin",
  },
];

// --- REGISTRO ---
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  const existe = usuarios.find((u) => u.email === email);
  if (existe) {
    return res.status(409).json({ message: "El email ya está registrado" });
  }

  // const existe = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
  //   email,
  // ]);
  // if (existe.rows.length > 0) {
  //   return res.status(409).json({ message: "El email ya está registrado" });
  // }

  const hash = await bcrypt.hash(password, 10);

  // todo usuario registrado desde este form es admin
  usuarios.push({ username, email, password: hash, rol: "admin" });

  // await pool.query(
  //   'INSERT INTO usuarios (username, email, password, rol) VALUES ($1, $2, $3, $4)',
  //   [username, email, hash, 'admin']
  // );

  res.status(201).json({ message: "¡Usuario registrado con éxito!" });
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son obligatorios" });
  }

  const usuario = usuarios.find((u) => u.email === email);

  // const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  // const usuario = resultado.rows[0];

  if (!usuario) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password);
  if (!passwordCorrecta) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign(
    { username: usuario.username, email: usuario.email, rol: usuario.rol },
    SECRET,
    { expiresIn: "1h" },
  );

  res.status(200).json({
    message: `Bienvenido, ${usuario.username}`,
    token,
  });
});

module.exports = router;
