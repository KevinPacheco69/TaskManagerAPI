const pool = require("../config/db");

// ==========================================
// GET: Obtener todas las tareas
// ==========================================
const getAllTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error al consultar tareas:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error interno al obtener las tareas.",
    });
  }
};

// ==========================================
// GET: Obtener una tarea por ID
// ==========================================
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar el identificador
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "El ID debe ser un numero entero positivo.",
      });
    }

    // Buscar tarea en MySQL
    const [tasks] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [
      id,
    ]);

    // Comprobar si existe
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tasks[0],
    });
  } catch (error) {
    console.error("Error al consultar tarea:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error interno al consultar la tarea.",
    });
  }
};

// ==========================================
// POST: Crear una tarea
// ==========================================
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Validar titulo
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "El titulo es obligatorio y debe ser texto.",
      });
    }

    // Validar prioridad
    const validPriorities = ["low", "medium", "high"];

    if (priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "La prioridad debe ser low, medium o high.",
      });
    }

    // Insertar tarea
    const [result] = await pool.execute(
      `INSERT INTO tasks (title, description, priority)
             VALUES (?, ?, ?)`,
      [title.trim(), description || null, priority || "medium"],
    );

    // Recuperar tarea creada
    const [tasks] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);

    return res.status(201).json({
      success: true,
      message: "Tarea creada correctamente.",
      data: tasks[0],
    });
  } catch (error) {
    console.error("Error al crear tarea:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error interno al crear la tarea.",
    });
  }
};

// ==========================================
// Exportar controladores
// ==========================================
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
};
