const express = require("express");
const router = express.Router();

const mensajes = [];

router.post("/", async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  mensajes.push({ nombre, email, mensaje });

  res.status(201).json({ message: "¡Mensaje enviado con éxito!" });
});

module.exports = router;
