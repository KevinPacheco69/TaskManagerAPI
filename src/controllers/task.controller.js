const pool = require("../config/db");

// ==========================================
// GET: Obtener todas las tareas
// ==========================================
const getAllTasks = async (req, res) => {
    try {
        const [tasks] = await pool.query(
            "SELECT * FROM tasks ORDER BY created_at DESC"
        );

        return res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (error) {
        console.error("Error al consultar tareas:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error interno al obtener las tareas."
        });
    }
};

// ==========================================
// GET: Obtener una tarea por ID
// ==========================================
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "El ID debe ser un numero entero positivo."
            });
        }

        const [tasks] = await pool.execute(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tarea no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            data: tasks[0]
        });

    } catch (error) {
        console.error("Error al consultar tarea:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error interno al consultar la tarea."
        });
    }
};

// ==========================================
// POST: Crear una tarea
// ==========================================
const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "El titulo es obligatorio y debe ser texto."
            });
        }

        const validPriorities = ["low", "medium", "high"];

        if (
            priority !== undefined &&
            !validPriorities.includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message: "La prioridad debe ser low, medium o high."
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO tasks (title, description, priority)
             VALUES (?, ?, ?)`,
            [
                title.trim(),
                description || null,
                priority || "medium"
            ]
        );

        const [tasks] = await pool.execute(
            "SELECT * FROM tasks WHERE id = ?",
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Tarea creada correctamente.",
            data: tasks[0]
        });

    } catch (error) {
        console.error("Error al crear tarea:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error interno al crear la tarea."
        });
    }
};

// ==========================================
// PUT: Actualizar una tarea
// ==========================================
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        // Validar ID
        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "El ID debe ser un numero entero positivo."
            });
        }

        // Validar titulo
        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "El titulo es obligatorio."
            });
        }

        // Validar descripcion
        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "La descripcion debe ser texto o null."
            });
        }

        // Validar estado
        const validStatuses = [
            "pending",
            "in_progress",
            "completed"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "El estado debe ser pending, in_progress o completed."
            });
        }

        // Validar prioridad
        const validPriorities = ["low", "medium", "high"];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "La prioridad debe ser low, medium o high."
            });
        }

        // Comprobar que la tarea exista
        const [existingTasks] = await pool.execute(
            "SELECT id FROM tasks WHERE id = ?",
            [id]
        );

        if (existingTasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tarea no encontrada."
            });
        }

        // Actualizar la tarea
        await pool.execute(
            `UPDATE tasks
             SET title = ?, description = ?, status = ?, priority = ?
             WHERE id = ?`,
            [
                title.trim(),
                description ?? null,
                status,
                priority,
                id
            ]
        );

        // Recuperar la tarea actualizada
        const [updatedTasks] = await pool.execute(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tarea actualizada correctamente.",
            data: updatedTasks[0]
        });

    } catch (error) {
        console.error("Error al actualizar tarea:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error interno al actualizar la tarea."
        });
    }
};
// ==========================================
// DELETE: Eliminar una tarea
// ==========================================
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar el ID
        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "El ID debe ser un numero entero positivo."
            });
        }

        // Comprobar que la tarea exista
        const [existingTasks] = await pool.execute(
            "SELECT id FROM tasks WHERE id = ?",
            [id]
        );

        if (existingTasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tarea no encontrada."
            });
        }

        // Eliminar la tarea
        await pool.execute(
            "DELETE FROM tasks WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tarea eliminada correctamente."
        });

    } catch (error) {
        console.error("Error al eliminar tarea:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error interno al eliminar la tarea."
        });
    }
};

// ==========================================
// EXPORTAR CONTROLADORES
// ==========================================
module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};