const express = require("express");
const router = express.Router();
const { verificarToken, soloAdmin } = require("../middleware/auth");

// Ruta protegida — cualquier usuario autenticado
router.get("/perfil", verificarToken, (req, res) => {
  res.json({
    message: "Perfil obtenido",
    usuario: req.usuario, // contiene username, email y rol
  });
});

// Ruta protegida — solo admin
router.get("/admin", verificarToken, soloAdmin, (req, res) => {
  res.json({ message: `Hola admin ${req.usuario.username}` });
});

module.exports = router;
