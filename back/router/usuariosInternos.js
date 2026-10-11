const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Conexion a bd junto cin transaccion comit y rollback
const {query, beginTransaction, commit, rollback } = require("../conexion");

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_COLUMNS = `
    ui.id,
    ui.nombre,
    ui.apellido_paterno,
    ui.apellido_materno,
    ui.email,
    ui.rol,
    ui.status,
    ui.registro,
    roles.nombre AS rol_nombre
`;

const normalizeText = (value) =>
    typeof value === "string" ? value.trim() : "";

const parseId = (value) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const validateUser = (body) => {
    const user = {
        nombre: normalizeText(body?.nombre),
        apellido_paterno: normalizeText(body?.apellido_paterno),
        apellido_materno: normalizeText(body?.apellido_materno),
        email: normalizeText(body?.email).toLowerCase(),
        rol: parseId(body?.rol),
        status: Number(body?.status)
    };

    if (!user.nombre || !NAME_PATTERN.test(user.nombre)) {
        throw new HttpError("El nombre contiene caracteres inválidos o está vacío.", 400);
    }

    if (!user.apellido_paterno || !NAME_PATTERN.test(user.apellido_paterno)) {
        throw new HttpError("El apellido paterno contiene caracteres inválidos o está vacío.", 400);
    }

    if (!user.apellido_materno || !NAME_PATTERN.test(user.apellido_materno)) {
        throw new HttpError("El apellido materno contiene caracteres inválidos o está vacío.", 400);
    }

    if (!user.email || user.email.length > 100 || !EMAIL_PATTERN.test(user.email)) {
        throw new HttpError("Ingresa un correo electrónico válido.", 400);
    }

    if (!user.rol) {
        throw new HttpError("Selecciona un rol válido.", 400);
    }

    if (user.status !== 1 && user.status !== 2) {
        throw new HttpError("El estado debe ser activo o inactivo.", 400);
    }

    return user;
};

const validatePassword = (password, confirmation) => {
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

    if (password !== confirmation) {
        throw new HttpError("Las contraseñas no coinciden.", 400);
    }
};

const getUserById = async (id) => {
    const result = await query(
        `SELECT ${USER_COLUMNS}
         FROM user_access_log ui
         LEFT JOIN roles ON ui.rol = roles.id
         WHERE ui.id = ?`,
        [id]
    );

    return result[0] || null;
};

const sendError = (res, error) => {
    console.error(error);
    return res.status(error.status || 500).json({
        success: false,
        message: error.status ? error.message : "Error interno del servidor"
    });
};

Router.get("/", async(req,res) => {
    try {
        const consulta = `SELECT ${USER_COLUMNS}
                        FROM user_access_log ui
                        LEFT JOIN roles ON ui.rol = roles.id
                        ORDER BY ui.id DESC`;
        const result = await query(consulta);

        if (result.length === 0) {
            throw new HttpError("No se encontraron registros de usuarios internos", 404);
        }

        return res.json({
            success:true,
            message:"Registros de usuarios internos obtenidos correctamente", 
            data:result
        });
    } catch (error) {
        return sendError(res, error);
    }
});

Router.get("/rolesAll", async(req,res)=>{

    try {
        const consulta1 = "SELECT * FROM roles";
        const result = await query(consulta1);

        if (result.length === 0) {
            throw new HttpError("No se encontraron registros de roles", 404);
        }

        return res.status(200).json({
            success:true,
            message: "Registros de roles obtenidos correctamente",
            data: result
        });
    } catch (error) {
        console.error(error);
        
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Error interno del servidor",
        })
    }
});

Router.post("/", async(req,res) => {
    let transactionStarted = false;

    try {
        const user = validateUser({
            ...req.body,
            status: 1
        });
        const password = typeof req.body?.password === "string"
            ? req.body.password
            : "";
        const passwordConfirmation = typeof req.body?.passwordVe === "string"
            ? req.body.passwordVe
            : "";
        validatePassword(password, passwordConfirmation);

        if (user.rol === 1 || user.rol === 2) {
            throw new HttpError("No se puede asignar un rol protegido.", 400);
        }

        await beginTransaction();
        transactionStarted = true;

        const existingUser = await query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [user.email]
        );
        const existingInternalUser = await query(
            "SELECT id FROM user_access_log WHERE email = ? LIMIT 1",
            [user.email]
        );
        const role = await query(
            "SELECT id FROM roles WHERE id = ? AND id NOT IN (1, 2)",
            [user.rol]
        );

        if (existingUser.length > 0 || existingInternalUser.length > 0) {
            throw new HttpError("El correo electrónico ya está registrado.", 409);
        }

        if (role.length === 0) {
            throw new HttpError("El rol seleccionado no está disponible.", 400);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await query(
            `INSERT INTO user_access_log
                (nombre, apellido_paterno, apellido_materno, email, password, rol)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user.nombre,
                user.apellido_paterno,
                user.apellido_materno,
                user.email,
                passwordHash,
                user.rol
            ]
        );

        const createdUser = await getUserById(result.insertId);
        if (!createdUser) {
            throw new HttpError("No se pudo recuperar el usuario interno creado.", 500);
        }

        await commit();
        transactionStarted = false;

        return res.status(201).json({
            success: true,
            message: "Usuario interno registrado correctamente.",
            data: createdUser
        });
    } catch (error) {
        if (transactionStarted) {
            await rollback();
        }

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "El correo electrónico ya está registrado."
            });
        }

        return sendError(res, error);
    }
});

Router.put("/:id", async(req,res) => {
    const id = parseId(req.params.id);

    if (!id) {
        return sendError(res, new HttpError("El ID del usuario no es válido.", 400));
    }

    let transactionStarted = false;

    try {
        const existingUser = await getUserById(id);
        if (!existingUser) {
            throw new HttpError("El usuario interno no existe.", 404);
        }

        const user = validateUser(req.body);
        const currentRole = Number(existingUser.rol);
        const protectedRole = currentRole === 1 || currentRole === 2;

        if (protectedRole && user.rol !== currentRole) {
            throw new HttpError("No se puede cambiar el rol de un usuario protegido.", 403);
        }

        if (protectedRole && user.status !== Number(existingUser.status)) {
            throw new HttpError("No se puede cambiar el estado de un usuario protegido.", 403);
        }

        if (!protectedRole && (user.rol === 1 || user.rol === 2)) {
            throw new HttpError("No se puede asignar un rol protegido.", 400);
        }

        await beginTransaction();
        transactionStarted = true;

        const emailConflict = await query(
            `SELECT id FROM users WHERE email = ?
             UNION
             SELECT id FROM user_access_log WHERE email = ? AND id <> ?
             LIMIT 1`,
            [user.email, user.email, id]
        );

        if (emailConflict.length > 0) {
            throw new HttpError("El correo electrónico ya está registrado.", 409);
        }

        if (!protectedRole) {
            const role = await query(
                "SELECT id FROM roles WHERE id = ? AND id NOT IN (1, 2)",
                [user.rol]
            );
            if (role.length === 0) {
                throw new HttpError("El rol seleccionado no está disponible.", 400);
            }
        }

        await query(
            `UPDATE user_access_log
             SET nombre = ?, apellido_paterno = ?, apellido_materno = ?,
                 email = ?, rol = ?, status = ?
             WHERE id = ?`,
            [
                user.nombre,
                user.apellido_paterno,
                user.apellido_materno,
                user.email,
                user.rol,
                user.status,
                id
            ]
        );

        const updatedUser = await getUserById(id);
        await commit();
        transactionStarted = false;

        return res.status(200).json({
            success: true,
            message: "Usuario interno actualizado correctamente.",
            data: updatedUser
        });
    } catch (error) {
        if (transactionStarted) {
            await rollback();
        }
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "El correo electrónico ya está registrado."
            });
        }

        return sendError(res, error);
    }
});

Router.delete("/:id", async(req,res) => {
    const id = parseId(req.params.id);

    if (!id) {
        return sendError(res, new HttpError("El ID del usuario no es válido.", 400));
    }

    try {
        const user = await getUserById(id);
        if (!user) {
            throw new HttpError("El usuario interno no existe.", 404);
        }

        if (Number(user.rol) === 1 || Number(user.rol) === 2) {
            throw new HttpError("No se puede desactivar un usuario con un rol protegido.", 403);
        }

        await query(
            "UPDATE user_access_log SET status = 2 WHERE id = ?",
            [id]
        );

        const deactivatedUser = await getUserById(id);
        return res.status(200).json({
            success: true,
            message: "Usuario interno desactivado correctamente.",
            data: deactivatedUser
        });
    } catch (error) {
        return sendError(res, error);
    }
});


module.exports = Router;