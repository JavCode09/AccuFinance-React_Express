const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require("bcrypt")
const Router = express.Router();

const {query, beginTransaction, commit, rollback } = require("../conexion");


let tabla = 'users';

//clave de JWT
const SECRET_KEY = 'accufinance'; // Cambiar por una clave segura

// Define la ruta POST para registro
Router.post("/add", async (req, res) => {
    const { nombre, apellidos, email, password } = req.body;
    const grupo = 1;
    const saltRounds = 10;

    try {
        const password_hash = await bcrypt.hash(password, saltRounds);

        await query(
            "INSERT INTO users (nombre, apellidos, email, password, grupo) VALUES (?, ?, ?, ?, ?)",
            [nombre, apellidos, email, password_hash, grupo]
        );

        console.log(`Registro insertado con éxito en la tabla ${tabla}`);
        res.status(200).json({ message: `Registro insertado con éxito en la tabla ${tabla}` });

    } catch (error) {
        console.error(`Error en la operación, Tabla: ${tabla}`, error);
        res.status(500).json({
            message: `Ocurrió un error al realizar la operación en la tabla: ${tabla}`,
            error: error.message
        });
    }
});

//Login 
Router.post("/", async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        // Consultamos el usuario por email
        const usuarios = await query("SELECT * FROM users WHERE email = ?", [usuario]);

        if (usuarios.length === 0) {
            return res.status(200).json({ success: false, message: "Usuario no encontrado" });
        }

        const usuarioEncontrado = usuarios[0];
        const password_hash = usuarioEncontrado.password;

        // Comparamos contraseña ingresada con el hash almacenado
        const password_verify = await bcrypt.compare(contrasena, password_hash);

        if (!password_verify) {
            return res.status(200).json({ success: false, message: "Contraseña incorrecta" });
        }

        // Generamos JWT
        const token = jwt.sign(
            {
                id: usuarioEncontrado.id_user,
                nombre_completo: `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellidos}`,
                email: usuarioEncontrado.email,
                grupo: usuarioEncontrado.grupo,
            },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login exitoso",
            usuario: usuarioEncontrado,
            token,
        });
    } catch (error) {
        console.error(`Error en la operación, Tabla: ${tabla}, Login:`, error);
        res.status(500).json({
            message: `Ocurrió un error al realizar la operación. Tabla: ${tabla}`,
            error: error.message,
        });
    }
});




module.exports = Router;