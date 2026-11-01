const express = require("express");
const router = express.Router();

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");

// Obtener todas las tareas
router.get("/", getAllTasks);

// Obtener una tarea por ID
router.get("/:id", getTaskById);

// Crear una tarea
router.post("/", createTask);

// Actualizar una tarea
router.put("/:id", updateTask);

// Eliminar una tarea
router.delete("/:id", deleteTask);

module.exports = router;