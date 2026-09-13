const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Conexion a bd junto cin transaccion comit y rollback
const {query, beginTransaction, commit, rollback } = require("../conexion");

// Obtenemos loa informacion
Router.get("/", async (req,res) => {
    try {
       const consulta1 = "SELECT * FROM permisos ORDER BY id DESC";
       const result1 = await query(consulta1);

       if (!result1 || result1.length === 0) {
            throw new HttpError("No hay ningun permisos.", 400);
       }

        return res.status(200).json({
            success: true,
            message: "Datos encontrados",
            data: result1
        })
    } catch (error) {
        console.log(error);
        
        return res.status(error.status || 500).json({
            succes: false,
            message: error.status ? error.message : "Error interno del servidor",
            data: null
        })
    }

});

Router.post("/", async (req,res) => {
    const {namePermiso} = req.body;
    // console.log(namePermiso);

    try {
        await beginTransaction()

        if (!namePermiso) {
            throw new HttpError("Nombre vacio, por favor introduce un nombre. ", 400);
        }
        
        // consulta de insercion
        const consulta1 = "INSERT INTO permisos (nombre) VALUES (?)";
        const result1 = await query(consulta1,[namePermiso]);

        if (!result1 || result1.affectedRows  === 0) {
            throw new HttpError("No se pudo insertar el permiso.", 500);
        }

        await commit();

        return res.status(201).json({
            succes:true,
            message:"¡Permiso guardado!",
        });
    } catch (error) {
        await rollback();

        console.error(error);
        
        // Si es duplicado
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                succes: false,
                message: "El permiso ya existe.",
            });
        }

        // Si es otro problema
        return res.status(error.status || 500).json({
            succes:false,
            message: error.message || "Error interno del serviddor.",
        });
        
    }

});

module.exports = Router