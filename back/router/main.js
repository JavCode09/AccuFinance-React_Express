const express = require('express');
const router = express.Router();
const { query } = require("../conexion");
const getRoleAccess = require("../utils/getRoleAccess");

const accountTables = {
    users: "users",
    user_access_log: "user_access_log"
};

router.get('/', async (req, res) => {
    const table = accountTables[req.user.source];

    if (!table) {
        return res.status(401).json({
            success: false,
            message: "Sesión no válida."
        });
    }

    try {
        const accounts = await query(`
            SELECT id, nombre, apellido_paterno, apellido_materno, email, rol, status
            FROM ${table}
            WHERE id = ?
            LIMIT 1
        `, [req.user.id]);

        if (!accounts.length || Number(accounts[0].status) !== 1) {
            return res.status(401).json({
                success: false,
                message: "Sesión no válida."
            });
        }

        const account = accounts[0];
        const accesos = await getRoleAccess(account.rol);

        return res.status(200).json({
            message: "Sesión válida.",
            user: {
                id: account.id,
                rol: account.rol,
                nombre_completo: `${account.nombre} ${account.apellido_paterno} ${account.apellido_materno}`,
                email: account.email,
                status: account.status
            },
            accesos
        });
    } catch (error) {
        console.error("Error al recuperar los datos de sesión.", error);
        return res.status(500).json({
            success: false,
            message: "No fue posible validar la sesión."
        });
    }
});

module.exports = router;
