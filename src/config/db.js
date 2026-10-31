
// Importar las dependencias
const mysql = require("mysql2/promise");
require("dotenv").config();

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportar el pool para utilizarlo en otros archivos
module.exports = pool;
