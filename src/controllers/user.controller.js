const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const { authenticateToken, requireRole } = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este controlador
router.use(authenticateToken);

// Crear un nuevo usuario (Solo ADMIN)
router.post("/", requireRole("ADMIN"), async (req, res) => {
  try {
    const { name, username, password, role, companyDebt, phoneNumber } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        error: "Los campos 'name', 'username' y 'password' son requeridos.",
      });
    }

    const result = await userService.createUser({
      name,
      username,
      password,
      role,
      companyDebt,
      phoneNumber,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Listar todos los usuarios (Autenticado)
router.get("/", async (req, res) => {
  try {
    const result = await userService.getUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Obtener un usuario por ID (Autenticado)
router.get("/:id", async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Actualizar un usuario (Autenticado + Control de roles/seguridad)
router.put("/:id", async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const requester = req.user;

    // Si no es administrador y quiere modificar a otro usuario, denegar
    if (requester.role !== "ADMIN" && requester.id !== targetId) {
      return res.status(403).json({
        success: false,
        error: "Acceso denegado. No tienes permisos para actualizar a otros usuarios.",
      });
    }

    // Filtrar campos protegidos si no es un usuario administrador
    const updateData = { ...req.body };
    if (requester.role !== "ADMIN") {
      delete updateData.role;
      delete updateData.companyDebt;
      delete updateData.isActive;
    }

    const result = await userService.updateUser(targetId, updateData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
