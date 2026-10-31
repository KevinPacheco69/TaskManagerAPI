require("dotenv").config();

const express = require("express");
const pool = require("./src/config/db");

const taskRoutes = require("./src/routes/task.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(express.json());

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
  res.send("Bienvenido a TaskManager API");
});

// ==========================================
// RUTAS DE LA API
// ==========================================

app.use("/api/tasks", taskRoutes);

// ==========================================
// INICIAR SERVIDOR
// ==========================================

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Conexion con MySQL exitosa");

    app.listen(PORT, () => {
      console.log(`Servidor activo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con MySQL:", error.message);

    process.exit(1);
  }
}

startServer();
