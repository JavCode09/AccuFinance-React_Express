const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Conexion a bd junto cin transaccion comit y rollback
const {query, beginTransaction, commit, rollback } = require("../conexion");

// Modulos
const tabla = "roles";

// Inserta roles
Router.post("/", async (req,res) => {
    const {nombre} = req.body;

    try {
        await beginTransaction();

        if (!nombre) {throw new HttpError("Nombre vacio, por favor llena el campo.",400); }

        
        // COnsulta 
        const consulta1 = `INSERT INTO ${tabla} (nombre) VALUES (?)`;
        const result1 = await query(consulta1,[nombre]);

        // if (!result1 || result1.affectedRows === 0) {
        //     throw new HttpError(`Error al insertar el rol en la tabla  ${tabla}`,500);
        // }

        await commit();

        return res.status(200).json({
            success: true,
            message: "Rol agregado",
            data: null
        })

    } catch (error) {
        await rollback();

        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "El nombre de este rol ya existe, por favor cámbialo." });
        }

        return res.status(error.status || 500).json({
            success: false,
            message: error.status ? error.message : "Error interno del servidor",
            data:null
        })
        
    }
});

// Mostrar todo
Router.get("/",async(req,res) => {
    try {
        const consulta2 = `SELECT * FROM ${tabla} ORDER BY id DESC`;
        const result2 = await query(consulta2);

        if (!result2 || result2.length === 0) {
            throw new HttpError("No se encontraron registros.", 404);
        }

        return res.status(200).json({
            success:true,
            message: "Se hay registros.",
            data: result2
        })
    } catch (error) {
        console.error(error);

        
        return res.status(error.status || 500).json({
            success: false,
            message: error.status ? error.message : "Error interno del servidor",
            data:null
        })
        
    }
});

module.exports = Router