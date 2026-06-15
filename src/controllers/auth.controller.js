const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Nombre de usuario y contraseña son obligatorios.",
      });
    }

    const result = await userService.login(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

// Registro de primer Administrador del sistema
router.post("/register-first-admin", async (req, res) => {
  try {
    const { user, initialAdminKey } = req.body;
    if (!user || !initialAdminKey) {
      return res.status(400).json({
        success: false,
        error: "Los campos 'user' e 'initialAdminKey' son requeridos.",
      });
    }

    if (!user.username || !user.password || !user.name) {
      return res.status(400).json({
        success: false,
        error:
          "El objeto 'user' debe contener 'name', 'username' y 'password'.",
      });
    }

    const result = await userService.createFirstAdmin(user, initialAdminKey);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
