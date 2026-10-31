const express = require("express");

const router = express.Router();

// Importar controladores
const {
  getAllTasks,
  getTaskById,
  createTask,
} = require("../controllers/task.controller");

// ==========================================
// RUTAS DE TAREAS
// ==========================================

// GET: Obtener todas las tareas
router.get("/", getAllTasks);

// GET: Obtener una tarea por ID
router.get("/:id", getTaskById);

// POST: Crear una tarea
router.post("/", createTask);

module.exports = router;
