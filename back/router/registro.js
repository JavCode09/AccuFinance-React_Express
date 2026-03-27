const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require("bcrypt")
const Router = express.Router();
const HttpError = require("../utils/HttpError");

const {query, beginTransaction, commit, rollback } = require("../conexion");


const tabla = 'users';

// Contenidos extraños
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]+$/;

//clave de JWT
const SECRET_KEY = process.env.SECRET_KEY; // Cambiar por una clave segura

// Define la ruta POST para registro
Router.post("/", async (req, res) => {
    let { nombre, apellido_paterno, apellido_materno, email, password, verificar_password } = req.body;
    const saltRounds = 10;

    nombre = nombre?.trim();
    apellido_paterno = apellido_paterno?.trim();
    apellido_materno = apellido_materno?.trim();
    email = email?.trim();

    // Iniciamos transaccion 
    await beginTransaction();

    try {
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Validar que no exista el correo electronico
        const consulta1 = `SELECT email FROM ${tabla} WHERE email = ?`;
        const result1 = await query(consulta1, [email]);
        
        if (!result1 && result1.length > 0) {
            throw new HttpError("El correo electronico ya existe en el sistema," , 409);
        }

        if (!nombre) {
            throw HttpError("El campo nombre está vacío." , 400);
        }

        if(!regexNombre.test(nombre)){
            throw HttpError("El nombre contiene caracteres inválidos.", 400);
        }

        if (!apellido_paterno) {
            throw HttpError("El campo apellido paterno está vacío." , 400);
        }

        if(!regexNombre.test(apellido_paterno)){
            throw HttpError("El apellido paterno contiene caracteres inválidos.", 400);
        }

       if (!apellido_materno) {
        throw HttpError("El campo apellido materno está vacío." , 400);
       }

        if(!regexNombre.test(apellido_materno)){
            throw HttpError("El apellido materno contiene caracteres inválidos.", 400);
        }

        if(!password){
            throw HttpError("El campo password está vacío.", 400);
        }

        if (!/^[A-Z]/.test(password)) {
            throw HttpError("La password debe iniciar con una letra mayúscula.", 400);
        }

        if (!/^[A-Za-z0-9]+$/.test(password)) {
            throw HttpError("En la password solo se permiten letras y números.", 400);
        }

        if (password.length < 8) {
            throw HttpError("El password debe de tener 8 caracteres como minimo.", 400);
        }
            
        if (password !== verificar_password) {
            throw HttpError("Las contraseñas no coinciden.", 400);  
        }

        // throw new HttpError("Error simulado", 500);

        //Consulta
        const consulta2 = `INSERT INTO ${tabla} (nombre,apellido_paterno,apellido_materno,email,password) VALUES (?,?,?,?,?)`;
        const result2 = await query(consulta2, [nombre,
                                              apellido_paterno,
                                              apellido_materno,
                                              email,
                                              password_hash
                                            ]);
        
        if (!result2 || result2.affectedRows === 0) {
            throw new HttpError(`Error al insertar en la BD, tabla ${tabla}: Formulario de registros`, 500);
        }

        await commit();

        res.status(201).json({ 
            message: `Registro creado correctamente` 
        });

    } catch (error) {
        await rollback();

        console.error(`Error en la operación, Tabla: ${tabla}`, error);
    
        const status = error.status || 500;

        return res.status(status).json({
            message: status === 500
                ? "Ocurrió un error inesperado, por favor inténtalo más tarde."
                : error.message
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