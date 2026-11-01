const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");

const {
    uploadTaskFile,
    getTaskFiles,
    deleteTaskFile
} = require("../controllers/file.controller");

// Subir archivo a una tarea
router.post(
    "/tasks/:id/files",
    (req, res, next) => {
        upload.single("file")(req, res, (error) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next();
        });
    },
    uploadTaskFile
);

// Consultar archivos de una tarea
router.get("/tasks/:id/files", getTaskFiles);

// Eliminar un archivo
router.delete("/files/:fileId", deleteTaskFile);

module.exports = router;
