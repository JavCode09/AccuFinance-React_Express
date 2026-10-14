const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require("bcrypt")
const Router = express.Router();
const HttpError = require("../utils/HttpError");
const { SESSION_COOKIE, sessionCookieOptions } = require("../utils/sessionCookie");
const getRoleAccess = require("../utils/getRoleAccess");

const {query, beginTransaction, commit, rollback } = require("../conexion");


const tabla = 'users';
const tabla_personal = 'user_access_log';
const mensajeRegistro = "Solicitud recibida. Si el correo es elegible, podrás iniciar sesión.";

// Contenidos extraños
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]+$/;

//clave de JWT
const SECRET_KEY = process.env.SECRET_KEY; // Cambiar por una clave segura

// Define la ruta POST para registro
Router.post("/registro", async (req, res) => {
    const {
        nombre: nombreInput,
        apellido_paterno: apellidoPaternoInput,
        apellido_materno: apellidoMaternoInput,
        email: emailInput,
        password,
        verificar_password: verificarPassword
    } = req.body || {};
    const saltRounds = 10;
    let transactionStarted = false;

    try {
        if (![nombreInput, apellidoPaternoInput, apellidoMaternoInput, emailInput, password, verificarPassword]
            .every(value => typeof value === "string")) {
            throw new HttpError("Completa todos los campos con valores válidos.", 400);
        }

        const nombre = nombreInput.trim();
        const apellido_paterno = apellidoPaternoInput.trim();
        const apellido_materno = apellidoMaternoInput.trim();
        const email = emailInput.trim();

        if (!nombre) {
            throw new HttpError("El campo nombre está vacío.", 400);
        }

        if (!regexNombre.test(nombre)) {
            throw new HttpError("El nombre contiene caracteres inválidos.", 400);
        }

        if (!apellido_paterno) {
            throw new HttpError("El campo apellido paterno está vacío.", 400);
        }

        if (!regexNombre.test(apellido_paterno)) {
            throw new HttpError("El apellido paterno contiene caracteres inválidos.", 400);
        }

        if (!apellido_materno) {
            throw new HttpError("El campo apellido materno está vacío.", 400);
        }

        if (!regexNombre.test(apellido_materno)) {
            throw new HttpError("El apellido materno contiene caracteres inválidos.", 400);
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new HttpError("Introduce un correo electrónico válido.", 400);
        }

        if (!password) {
            throw new HttpError("El campo password está vacío.", 400);
        }

        if (!/^[A-Z]/.test(password)) {
            throw new HttpError("La password debe iniciar con una letra mayúscula.", 400);
        }

        if (!/^[A-Za-z0-9]+$/.test(password)) {
            throw new HttpError("En la password solo se permiten letras y números.", 400);
        }

        if (password.length < 8) {
            throw new HttpError("El password debe de tener 8 caracteres como mínimo.", 400);
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            throw new HttpError("El password no puede exceder 72 caracteres.", 400);
        }

        if (password !== verificarPassword) {
            throw new HttpError("Las contraseñas no coinciden.", 400);
        }

        await beginTransaction();
        transactionStarted = true;

        const registeredUsers = await query(`SELECT email FROM ${tabla} WHERE email = ?`, [email]);
        const internalUsers = await query(`SELECT email FROM ${tabla_personal} WHERE email = ?`, [email]);

        if (registeredUsers.length > 0 || internalUsers.length > 0) {
            await rollback();
            transactionStarted = false;
            return res.status(200).json({ message: mensajeRegistro });
        }

        const password_hash = await bcrypt.hash(password, saltRounds);

        const consulta2 = `INSERT INTO ${tabla} (nombre,apellido_paterno,apellido_materno,email,password,rol) VALUES (?,?,?,?,?,?)`;
        const result2 = await query(consulta2, [nombre,
                                              apellido_paterno,
                                              apellido_materno,
                                              email,
                                              password_hash,
                                              2
                                            ]);

        if (!result2 || result2.affectedRows === 0) {
            throw new HttpError(`Error al insertar en la BD, tabla ${tabla}: Formulario de registros`, 500);
        }

        await commit();
        transactionStarted = false;

        res.status(200).json({
            message: mensajeRegistro
        });

    } catch (error) {
        if (transactionStarted) {
            try {
                await rollback();
            } catch (rollbackError) {
                console.error("Error al revertir la transacción de registro.", rollbackError);
            }
        }

        console.error(`Error en la operación, Tabla: ${tabla}`, error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
                message: mensajeRegistro
            });
        }

        const status = error.status || 500;

        return res.status(status).json({
            message: status === 500
                ? "Ocurrió un error inesperado, por favor inténtalo más tarde."
                : error.message
        });

    }
});

Router.post("/logout", (req, res) => {
    res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
    return res.status(200).json({
        success: true,
        message: "Sesión cerrada."
    });
});

//Login 
Router.post("/login", async (req, res) => {
    const { usuario, contrasena } = req.body || {};

    try {
        if (typeof usuario !== "string" || !usuario.trim()) {
            throw new HttpError("El campo usuario está vacío.", 400);
        }

        if (typeof contrasena !== "string" || !contrasena) {
            throw new HttpError("El campo password está vacío.", 400);
        }

        // Consultamos el usuario por email
        let usuarioEncontrado = null;
        let fuenteUsuario = null;
        const email = usuario.trim();

        const consulta1 = `SELECT * FROM ${tabla} WHERE email = ?`;
        const result1 = await query(consulta1, [email]);

        if (result1.length !== 0) {
           usuarioEncontrado = result1[0];
           fuenteUsuario = tabla;
        }else{
            const consulta2 = `SELECT * FROM ${tabla_personal} WHERE email = ?`;
            const result2 = await query(consulta2,[email])

            if (result2.length === 0) {
                await bcrypt.hash(contrasena.slice(0, 18), 10);
                throw new HttpError("Correo o contraseña incorrectos.", 401);
            }

            usuarioEncontrado = result2[0];
            fuenteUsuario = tabla_personal;
        }

        let password_hash = usuarioEncontrado.password;

        // Comparamos contraseña ingresada con el hash almacenado
        const password_verify = await bcrypt.compare(contrasena, password_hash);

        if (!password_verify) {
            throw new HttpError("Correo o contraseña incorrectos.", 401);
        }

        // Verificamos status (1:Activo , 2: Inactivo)
        if (usuarioEncontrado.status !== 1) {
            throw new HttpError("Correo o contraseña incorrectos.", 401);
        }

        const arbol = await getRoleAccess(usuarioEncontrado.rol);
        if (arbol.length === 0) {
            throw new HttpError("Lo sentimos, pero no cuentas con permisos aun, Comunicate a atencion al cliente.", 403);
        }

        // Generamos JWT
        const token = jwt.sign(
            {
                id: usuarioEncontrado.id,
                rol: usuarioEncontrado.rol,
                source: fuenteUsuario,
            },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.cookie(SESSION_COOKIE, token, {
            ...sessionCookieOptions,
            maxAge: 2 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login exitoso",
            usuario: {
                        id: usuarioEncontrado.id, // 🔥 AGREGA ESTO
                        nombre_completo: `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido_paterno} ${usuarioEncontrado.apellido_materno}`,
                        email: usuarioEncontrado.email,
                        status: usuarioEncontrado.status,
                    },
                    accesos: arbol,
        });
    } catch (error) {
        console.error(`Error en la operación, Tabla: ${tabla} o ${tabla_personal}, Login:`, error);

        const status = error.status || 500;

        return res.status(status).json({
            message: status === 500
                ? "Ocurrió un error inesperado, por favor inténtalo más tarde."
                : error.message
        });

    }
});




module.exports = Router;