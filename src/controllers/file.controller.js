const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fileService = require("../services/file.service");

// Asegurar que la carpeta de subidas (uploads) existe en la raíz del proyecto
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombre único usando timestamp y extensión original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtro para permitir solo imágenes y PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo se aceptan imágenes y PDFs."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB
  },
});

// Subir un archivo
router.post("/upload", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se envió ningún archivo en el campo 'file'.",
      });
    }

    try {
      const relativePath = path.join("uploads", req.file.filename);
      // Reemplazar barras invertidas en Windows por barras normales para la URL
      const fileUrl = `/uploads/${req.file.filename}`;

      const result = await fileService.createFileRecord({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: relativePath,
        url: fileUrl,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
});

// Listar todos los registros de archivos
router.get("/", async (req, res) => {
  try {
    const result = await fileService.getFiles();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Eliminar un archivo físico y su registro en BD
router.delete("/:id", async (req, res) => {
  try {
    const result = await fileService.deleteFileRecord(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
