const express = require("express");
const bcrypt = require("bcrypt")
const Router = express.Router();
const conexion = require("../conexion");
const { reject } = require("bcrypt/promises");
let tabla = 'users';

// Define la ruta POST para registro
Router.post("/add", async (req, res) => {
    const { nombre, apellidos, email, password} = req.body;
    const grupo = 1;
    const saltRounds = 10; // Define cuántas veces quieres hacer el "salting"
    try {
        //Encriptamos passwword antes de insertar
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insertamos en la tabla USERS
        const result = await new Promise((resolve, reject) => {
            const consulta = "INSERT INTO users (nombre, apellidos, email, password, grupo) VALUES (?, ?, ?, ?, ?)";
            conexion.query(consulta, [nombre, apellidos, email, password_hash, grupo], (err, success) => {
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
        res.status(500).json({ message: `Ocurrió un error al realizar la operación. Tabla: ${tabla}, Registro` });
    }
});

Router.post("/" , async (req, res) => {
    const {usuario , contrasena } = req.body;
    try {
        const result = await new Promise((resolve,reject) => {
            //Consultamos si existe el registro
            const consulta = "SELECT * FROM users WHERE email = ?";
            conexion.query(consulta,[usuario], async(err, success) => {
                if (err) {
                    console.error(`Error en la query, Tabla: ${tabla}, Login`);
                    reject(err);
                    return;
                }
                
                if (success.length > 0) {
                    // Obtenemos la contraseña hasheada almacenada
                    const password_bd = success[0];
                    const password_hash =  password_bd.password;

                    //Comparamos la ocnstraseña ingresada con el hash
                    const password_verify = await bcrypt.compare(contrasena, password_hash);
                    if (password_verify) {
                        resolve(success[0]);
                    }else{
                        reject("Contraseña Incorrecta");
                    }
                }else{
                    reject("Usuario no encontrado")
                }
            });
        });

        //Si todo va bien, enviamos la respuesta
        res.status(200).json({message: "Login exitoso", usuario: result})
     
    } catch (error) {
        console.error(`Error en la operación, Tabla: ${tabla}, Post:`, error);
        res.status(500).json({ message: `Ocurrió un error al realizar la operación. Tabla: ${tabla}, Error: ${error}` });
    }
})

module.exports = Router;