const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); // ✅ Solo una vez
require("dotenv").config(); // Para leer variables de entorno

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// 📌 Conexión a PostgreSQL en Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 📌 Ruta para registrar usuarios
app.post("/registrar", async (req, res) => {
    const { nombre, apellido, edad } = req.body;

    try {
        await pool.query("INSERT INTO usuarios (nombre, apellido, edad) VALUES ($1, $2, $3)", [nombre, apellido, edad]);
        res.json({ mensaje: "Usuario registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// 📌 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});