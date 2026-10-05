const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Conexion a bd junto cin transaccion comit y rollback
const {query, beginTransaction, commit, rollback } = require("../conexion");

Router.get("/", async(req,res) => {
    try {
        const consulta = `SELECT ui.* , 
                                roles.nombre AS rol_nombre 
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
        logger.error("Error al obtener registros de usuarios internos:", error);

        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Error interno del servidor"
        });
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


module.exports = Router