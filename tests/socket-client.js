
const { io } = require("socket.io-client");

// Conectarse al servidor
const socket = io("http://localhost:3000");

console.log("Conectando al servidor Socket.IO...");

// Cuando se establece la conexión
socket.on("connect", () => {
    console.log("Conectado correctamente a Socket.IO");
    console.log("ID del cliente:", socket.id);
});

// Escuchar cuando se crea una tarea
socket.on("task:created", (task) => {
    console.log("\n========== TAREA CREADA ==========");
    console.log(task);
});

// Escuchar cuando se actualiza una tarea
socket.on("task:updated", (task) => {
    console.log("\n========== TAREA ACTUALIZADA ==========");
    console.log(task);
});

// Escuchar cuando se elimina una tarea
socket.on("task:deleted", (data) => {
    console.log("\n========== TAREA ELIMINADA ==========");
    console.log(data);
});

// Detectar errores de conexión
socket.on("connect_error", (error) => {
    console.error("Error de conexión:", error.message);
});

// Detectar desconexión
socket.on("disconnect", (reason) => {
    console.log("Desconectado:", reason);
});
