const express = require("express");
const Router = express.Router();
const conexion = require("../conexion");

let tabla = 'users';

// Define la ruta POST para registro
Router.post("/", async (req, res) => {
    const { nombre, apellidos, email, password, grupo } = req.body;
    try {
        // Insertamos en la tabla USERS
        const result = await new Promise((resolve, reject) => {
            const consulta = "INSERT INTO users (nombre, apellidos, email, password, grupo) VALUES (?, ?, ?, ?, ?)";
            conexion.query(consulta, [nombre, apellidos, email, password, grupo], (err, success) => {
                if (err) {
                    console.error(`Error en la query, Tabla: ${tabla}, Post`);
                    reject(err);
                    return;
                }
                resolve(`Registro Insertado con éxito, Tabla: ${tabla}, server`);
                // el console.log e spara que aparesca en terminal de servidor
                console.log(`Registro Insertado con éxito, Tabla: ${tabla}, server`);
                
            });
        });
        res.status(200).json({ message: result });
    } catch (error) {
        console.error(`Error en la operación, Tabla: ${tabla}, Post:`, error);
        res.status(500).json({ message: `Ocurrió un error al realizar la operación. Tabla: ${tabla}, Post` });
    }
});

module.exports = Router;