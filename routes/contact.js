const express = require("express");
const router = express.Router();
const { verificarToken, soloAdmin } = require("../middleware/auth");

const mensajes = [
  {
    nombre: "Juan Pérez",
    email: "admin@example.com",
    mensaje: "Hola, me gustaría saber más sobre sus servicios.",
    fecha: "2024-06-01T12:00:00Z",
  },
];

router.post("/", async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  mensajes.push({ nombre, email, mensaje, fecha: new Date() });

  // await pool.query(
  //   'INSERT INTO mensajes (nombre, email, mensaje, fecha) VALUES ($1, $2, $3, $4)',
  //   [nombre, email, mensaje, new Date()]
  // );

  res.status(201).json({ message: "¡Mensaje enviado con éxito!" });
});

router.get("/mensajes", verificarToken, soloAdmin, (req, res) => {
  res.status(200).json({ mensajes });

  // const resultado = await pool.query('SELECT * FROM mensajes ORDER BY fecha DESC');
  // res.status(200).json({ mensajes: resultado.rows });
});

router.delete("/mensajes/:index", verificarToken, soloAdmin, (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0 || index >= mensajes.length) {
    return res.status(400).json({ message: "Índice de mensaje inválido" });
  }
  mensajes.splice(index, 1);

  // const id = parseInt(req.params.index); // en este caso el parámetro sería el id real
  // const resultado = await pool.query('DELETE FROM mensajes WHERE id = $1 RETURNING *', [id]);
  // if (resultado.rowCount === 0) {
  //   return res.status(400).json({ message: "Mensaje no encontrado" });
  // }

  res.status(200).json({ message: "Mensaje eliminado con éxito" });
});

router.delete("/mensajes", verificarToken, soloAdmin, (req, res) => {
  mensajes.length = 0; // Vacía el array de mensajes

  // await pool.query('DELETE FROM mensajes');

  res.status(200).json({ message: "Todos los mensajes han sido eliminados" });
});

module.exports = router;
