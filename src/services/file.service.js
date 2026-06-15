const { File } = require("../models");
const fs = require("fs").promises;
const path = require("path");

class FileService {
  async createFileRecord(fileData) {
    try {
      const newFile = await File.create(fileData);
      return {
        success: true,
        data: newFile,
      };
    } catch (error) {
      throw new Error(`Error registrando archivo en BD: ${error.message}`);
    }
  }

  async getFiles() {
    try {
      const files = await File.findAll({ order: [["createdAt", "DESC"]] });
      return {
        success: true,
        data: files,
        count: files.length,
      };
    } catch (error) {
      throw new Error(`Error obteniendo archivos: ${error.message}`);
    }
  }

  async getFileById(id) {
    try {
      const fileRecord = await File.findByPk(id);
      if (!fileRecord) {
        throw new Error("Registro de archivo no encontrado");
      }
      return {
        success: true,
        data: fileRecord,
      };
    } catch (error) {
      throw new Error(`Error obteniendo archivo: ${error.message}`);
    }
  }

  async deleteFileRecord(id) {
    try {
      const fileRecord = await File.findByPk(id);
      if (!fileRecord) {
        throw new Error("El archivo no existe en el sistema");
      }

      // Eliminar el archivo físico en el disco
      // Usamos path.resolve para asegurar que la ruta absoluta es correcta
      const absolutePath = path.resolve(fileRecord.path);
      try {
        await fs.unlink(absolutePath);
      } catch (unlinkError) {
        console.warn(`Advertencia al borrar archivo físico (${absolutePath}): ${unlinkError.message}`);
        // Continuamos para limpiar el registro de la base de datos de todos modos
      }

      // Eliminar el registro de la base de datos
      await fileRecord.destroy();

      return {
        success: true,
        message: "Archivo físico y registro eliminados correctamente",
      };
    } catch (error) {
      throw new Error(`Error eliminando archivo: ${error.message}`);
    }
  }
}

module.exports = new FileService();
