const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";
const INITIAL_ADMIN_KEY = process.env.INITIAL_ADMIN_KEY || "secret-first-admin-key-123";

class UserService {
  /**
   * Iniciar sesión y obtener token JWT
   */
  async login(username, password) {
    try {
      const user = await User.findOne({ where: { username, isActive: true } });
      if (!user) {
        throw new Error("Credenciales inválidas.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Credenciales inválidas.");
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      // Excluir contraseña en el retorno
      const userJSON = user.toJSON();
      delete userJSON.password;

      return {
        success: true,
        token,
        user: userJSON,
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  /**
   * Crear el primer administrador usando una clave de seguridad secreta
   */
  async createFirstAdmin(userData, key) {
    try {
      if (key !== INITIAL_ADMIN_KEY) {
        throw new Error("Clave secreta inicial incorrecta.");
      }

      // Verificar si ya existe algún administrador en el sistema
      const adminCount = await User.count({ where: { role: "ADMIN" } });
      if (adminCount > 0) {
        throw new Error("Ya existe un administrador en el sistema. Utiliza las rutas estándar.");
      }

      // Verificar si el username está tomado
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (existingUser) {
        throw new Error("El nombre de usuario ya está en uso.");
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Crear administrador
      const newAdmin = await User.create({
        ...userData,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      });

      const adminJSON = newAdmin.toJSON();
      delete adminJSON.password;

      return {
        success: true,
        data: adminJSON,
      };
    } catch (error) {
      throw new Error(`Error creando administrador inicial: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo usuario (solo para ADMIN)
   */
  async createUser(userData) {
    try {
      // Verificar si el username está en uso
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (existingUser) {
        throw new Error("El nombre de usuario ya está registrado.");
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await User.create({
        ...userData,
        password: hashedPassword,
      });

      const userJSON = newUser.toJSON();
      delete userJSON.password;

      return {
        success: true,
        data: userJSON,
      };
    } catch (error) {
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  /**
   * Listar todos los usuarios
   */
  async getUsers() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["name", "ASC"]],
      });

      return {
        success: true,
        data: users,
        count: users.length,
      };
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }

  /**
   * Obtener un usuario por su ID
   */
  async getUserById(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new Error(`Error obteniendo usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar usuario
   */
  async updateUser(id, userData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      // Si actualiza username, validar que no esté en uso por otro
      if (userData.username && userData.username !== user.username) {
        const existingUser = await User.findOne({ where: { username: userData.username } });
        if (existingUser) {
          throw new Error("El nombre de usuario ya está en uso.");
        }
      }

      const updatePayload = { ...userData };

      // Si se provee una nueva contraseña, hashearla
      if (userData.password) {
        updatePayload.password = await bcrypt.hash(userData.password, 10);
      } else {
        delete updatePayload.password;
      }

      await user.update(updatePayload);

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }
  }
}

module.exports = new UserService();
