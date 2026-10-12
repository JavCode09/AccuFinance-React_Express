const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require("bcrypt")
const Router = express.Router();
const HttpError = require("../utils/HttpError");

const {query, beginTransaction, commit, rollback } = require("../conexion");


const tabla = 'users';
const tabla_personal = 'user_access_log';
const mensajeRegistro = "Solicitud recibida. Si el correo es elegible, podrás iniciar sesión.";
const tabla_roles_permisos = 'rol_permisos';
const tabla_permisos = 'permisos';
const tabla_modulos = 'modulos';

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
        const email = usuario.trim();

        const consulta1 = `SELECT * FROM ${tabla} WHERE email = ?`;
        const result1 = await query(consulta1, [email]);

        if (result1.length !== 0) {
           usuarioEncontrado = result1[0];
        }else{
            const consulta2 = `SELECT * FROM ${tabla_personal} WHERE email = ?`;
            const result2 = await query(consulta2,[email])

            if (result2.length === 0) {
                await bcrypt.hash(contrasena.slice(0, 18), 10);
                throw new HttpError("Correo o contraseña incorrectos.", 401);
            }

            usuarioEncontrado = result2[0];
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

        // Obtenemos permisos del rol y los modulos ocn sus caracteristicas
        const consulta3 = `
            SELECT 
                m.id AS modulo_id,
                m.nombre AS nombre_modulo,
                m.ruta,
                m.icon,
                m.parent_id,
                m.tipo,
                m.orden,
                
                rp.rol_id,
                rp.permiso_id,

                p.nombre AS nombre_permiso
                

            FROM ${tabla_modulos} m

            LEFT JOIN ${tabla_roles_permisos} rp 
                ON rp.modulo_id = m.id AND rp.rol_id = ?

            LEFT JOIN ${tabla_permisos} p 
                ON rp.permiso_id = p.id

            ORDER BY m.orden ASC;
        `;
        
        const result3 = await query(consulta3,[usuarioEncontrado.rol]);
        if (result3.length === 0) {
            throw new HttpError("Lo sentimos, pero no cuentas con permisos aun, Comunicate a atencion al cliente.", 403);
        }

        const permisos_roles = result3;

        // Agrupacion por modulo, Agrupamos cada modulo con sus roles y permisos
        const modulosAgrupados = {};

        // Recorremos todos los registros y agrupamos
        permisos_roles.forEach(data => {
            const id = data.modulo_id;

            // Validamos si el modulo ya existe en la lista de objetos
            if (!modulosAgrupados[id]) {
                modulosAgrupados[id] = {
                    modulo_id: data.modulo_id,
                    nombre_modulo: data.nombre_modulo,
                    ruta: data.ruta,
                    icon: data.icon,
                    parent_id:data.parent_id,
                    tipo:data.tipo,
                    orden:data.orden,
                    permisos: {},
                    hijos:[]
                }
            
            }

            // Una ves validado el modulo se agregan permisos
            if (data.permiso_id) {
                modulosAgrupados[id].permisos[data.nombre_permiso] = true;
            }
        });

        // Vamos ahora a poner en los padres los hijos, el padre puede ser modulo sin ruta o bloque
        const arbol = [];

        // Procesamos la lista de objetos
        Object.values(modulosAgrupados).forEach(modulo => {

            // Validamos si el modulo tiene parent_id (es la relacion de un padre (bloque o modulo)
            if(modulo.parent_id === null){
                // Es padre
                arbol.push(modulo);
            }else{
                // Es hijo de modulo o bloque, ojo aqui no se hace push por que la referencia del objeto es la misma que la del arbol
                if(modulosAgrupados[modulo.parent_id]){
                    modulosAgrupados[modulo.parent_id].hijos.push(modulo)    
                }
            }
        });

        // console.log(usuarioEncontrado.id);
        // return

        // Generamos JWT
        const token = jwt.sign(
            {
                id: usuarioEncontrado.id,
                rol: usuarioEncontrado.rol,
            },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

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
            token,
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