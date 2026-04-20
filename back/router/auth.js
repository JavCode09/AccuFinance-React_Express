const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require("bcrypt")
const Router = express.Router();
const HttpError = require("../utils/HttpError");

const {query, beginTransaction, commit, rollback } = require("../conexion");


const tabla = 'users';
const tabla_personal = 'user_access_log';
const tabla_roles_permisos = 'rol_permisos';
const tabla_permisos = 'permisos';
const tabla_modulos = 'modulos';

// Contenidos extraños
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]+$/;

//clave de JWT
const SECRET_KEY = process.env.SECRET_KEY; // Cambiar por una clave segura

// Define la ruta POST para registro
Router.post("/registro", async (req, res) => {
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
Router.post("/login", async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        if (!usuario) {
            throw new HttpError("El campo usuario esta vacio.", 400);
        }

        if (!contrasena) {
            throw new HttpError("El campo Password esta vacio.",400);
        }

        // Consultamos el usuario por email
        let usuarioEncontrado = null;
        
        const consulta1 = `SELECT * FROM ${tabla} WHERE email = ?`;
        const result1 = await query(consulta1, [usuario]);

        if (result1.length !== 0) {
           usuarioEncontrado = result1[0];
        }else{
            const consulta2 = `SELECT * FROM ${tabla_personal} WHERE email = ?`;
            const result2 = await query(consulta2,[usuario])

            if (result2.length === 0) { throw new HttpError("No se encontro ningun usuario con esas credenciales.", 400); }

            usuarioEncontrado = result2[0];
        }

        let password_hash = usuarioEncontrado.password;

        // Comparamos contraseña ingresada con el hash almacenado
        const password_verify = await bcrypt.compare(contrasena, password_hash);

        if (!password_verify) {
            throw new HttpError("Contraseña Incorrecta.", 400);
        }

        // Verificamos status (1:Activo , 2: Inactivo)
        if (usuarioEncontrado.status !== 1) {
            throw new HttpError("Tu cuenta ha sido desactivada. Ponte en contacto con el servicio al cliente.", 403);
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

        // console.log(permisos_roles);
        // return

        // Generamos JWT
        const token = jwt.sign(
            {
                id: usuarioEncontrado.id_user,
                rol: usuarioEncontrado.rol,
            },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            success: true,
            message: "Login exitoso",
            usuario: {
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
                ? `Ocurrió un error al realizar la operación. Tabla: ${tabla} O  Tabla: ${tabla_personal}  O enpoint login`
                : error.message
        });

    }
});




module.exports = Router;