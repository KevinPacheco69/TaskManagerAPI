const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Carpeta donde se almacenarán los archivos
const uploadDirectory = path.resolve(__dirname, "../../uploads");

// Crear la carpeta si todavía no existe
fs.mkdirSync(uploadDirectory, { recursive: true });

// Tipos de archivos permitidos
const allowedTypes = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${crypto.randomUUID()}${extension}`;

        callback(null, uniqueName);
    }
});

// Validación del tipo de archivo
const fileFilter = (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const expectedMimeType = allowedTypes[extension];

    if (!expectedMimeType || file.mimetype !== expectedMimeType) {
        return callback(
            new Error("Formato de archivo no permitido.")
        );
    }

    callback(null, true);
};

// Configuración de Multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;
