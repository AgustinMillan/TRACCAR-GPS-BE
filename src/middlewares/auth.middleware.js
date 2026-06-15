const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";

/**
 * Middleware para validar que la petición tenga un token JWT válido
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Espera formato "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Acceso denegado. Token no provisto.",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Token inválido o expirado.",
      });
    }

    req.user = decodedUser;
    next();
  });
}

/**
 * Middleware para verificar si el usuario tiene el rol permitido
 * @param {Array<string>|string} allowedRoles - Rol o lista de roles permitidos
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "No autenticado.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Acceso prohibido. No tienes permisos suficientes.",
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
};
