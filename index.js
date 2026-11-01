require("dotenv").config();

const express = require("express");
const http = require("http");
const pool = require("./src/config/db");

const taskRoutes = require("./src/routes/task.routes");
const fileRoutes = require("./src/routes/file.routes");

const { initializeSocket } = require("./src/sockets/socket");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bienvenido a TaskManager API");
});

app.use("/api/tasks", taskRoutes);
app.use("/api", fileRoutes);

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.IO
initializeSocket(server);

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("Conexion con MySQL exitosa");

        server.listen(PORT, () => {
            console.log(
                `Servidor activo en http://localhost:${PORT}`
            );
            console.log("Socket.IO inicializado correctamente");
        });

    } catch (error) {
        console.error(
            "Error al conectar con MySQL:",
            error.message
        );

        process.exit(1);
    }
}

startServer();
