const jwt = require("jsonwebtoken");
const SECRET = "mi_clave_secreta";

function verificarToken(req, res, next) {
  // El token llega en el header: Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado, token requerido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded; // guardas los datos del usuario en la request
    next(); // continúa a la ruta
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}

function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso restringido a administradores" });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
