const pool = require("../config/db");
const fs = require("fs/promises");
const path = require("path");

const uploadDirectory = path.resolve(__dirname, "../../uploads");

// ==========================================
// POST: Subir un archivo a una tarea
// ==========================================
const uploadTaskFile = async (req, res) => {
    let connection;

    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "El ID debe ser un numero entero positivo."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Debes seleccionar un archivo."
            });
        }

        const [tasks] = await pool.execute(
            "SELECT id FROM tasks WHERE id = ?",
            [id]
        );

        if (tasks.length === 0) {
            await fs.unlink(req.file.path);

            return res.status(404).json({
                success: false,
                message: "La tarea no existe."
            });
        }

        connection = await pool.getConnection();

        const relativePath = path.posix.join(
            "uploads",
            req.file.filename
        );

        const [result] = await connection.execute(
            `INSERT INTO task_files
             (task_id, original_name, stored_name, file_path, mime_type, file_size)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                id,
                req.file.originalname,
                req.file.filename,
                relativePath,
                req.file.mimetype,
                req.file.size
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Archivo adjuntado correctamente.",
            data: {
                id: result.insertId,
                task_id: Number(id),
                original_name: req.file.originalname,
                stored_name: req.file.filename,
                file_path: relativePath,
                mime_type: req.file.mimetype,
                file_size: req.file.size
            }
        });

    } catch (error) {
        console.error("Error al subir archivo:", error.message);

        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (cleanupError) {
                console.error(
                    "Error al limpiar archivo:",
                    cleanupError.message
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: "Error interno al subir el archivo."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// ==========================================
// GET: Consultar archivos de una tarea
// ==========================================
const getTaskFiles = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "El ID debe ser un numero entero positivo."
            });
        }

        const [tasks] = await pool.execute(
            "SELECT id FROM tasks WHERE id = ?",
            [id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tarea no encontrada."
            });
        }

        const [files] = await pool.execute(
            `SELECT id, task_id, original_name, stored_name,
                    file_path, mime_type, file_size, uploaded_at
             FROM task_files
             WHERE task_id = ?
             ORDER BY uploaded_at DESC`,
            [id]
        );

        return res.status(200).json({
            success: true,
            total: files.length,
            data: files
        });

    } catch (error) {
        console.error("Error al consultar archivos:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error interno al consultar archivos."
        });
    }
};

// ==========================================
// DELETE: Eliminar un archivo
// ==========================================
const deleteTaskFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        if (!/^[1-9]\d*$/.test(fileId)) {
            return res.status(400).json({
                success: false,
                message: "El ID del archivo debe ser positivo."
            });
        }

        const [files] = await pool.execute(
            "SELECT id, stored_name FROM task_files WHERE id = ?",
            [fileId]
        );

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Archivo no encontrado."
            });
        }

        // Construir la ruta usando el nombre almacenado
        const storedName = path.basename(files[0].stored_name);
        const filePath = path.join(uploadDirectory, storedName);

        // Eliminar el archivo físico
        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }

        // Eliminar el registro de MySQL
        await pool.execute(
            "DELETE FROM task_files WHERE id = ?",
            [fileId]
        );

        return res.status(200).json({
            success: true,
            message: "Archivo eliminado correctamente."
        });

    } catch (error) {
        console.error("Error al eliminar archivo:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error interno al eliminar el archivo."
        });
    }
};

module.exports = {
    uploadTaskFile,
    getTaskFiles,
    deleteTaskFile
};
