const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Conexion a bd junto cin transaccion comit y rollback
const {query, beginTransaction, commit, rollback } = require("../conexion");

// Obtenemos lo informacion
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
            success: false,
            message: error.status ? error.message : "Error interno del servidor",
            data: null
        })
    }

});

// Insertamos permisos
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

        let new_id = result1.insertId;

        // Confirmamos la transacción
        await commit();
        
        return res.status(201).json({
            success:true,
            message:"¡Permiso guardado!",
            data:{
                id:new_id,
                nombre: namePermiso
            }

        });
    } catch (error) {
        await rollback();

        console.error(error);
        
        // Si es duplicado
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "El permiso ya existe.",
            });
        }

        // Si es otro problema
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Error interno del serviddor.",
        });
        
    }

});

// Obtenemos los datos al actualizar cada registro
Router.get("/:permiso_id", async(req,res) => {
    const {permiso_id} = req.params;

    try {
        
        if (!permiso_id) {
            throw new HttpError("No se encontro el permiso actaul", 400);
        }

        // consulta 
        const consulta = "SELECT * FROM permisos WHERE id = ?";
        const result = await query(consulta,[permiso_id]);

        if (!result || result.length === 0) {
            throw new HttpError("No se encontro el permiso.", 500);
        }

        return res.status(200).json({
            success: true,
            message:"Permiso encontrado",
            data:{
                id: result[0].id,
                nombre: result[0].nombre,
            }
        })
    } catch (error) {
        
        console.error(error);
        
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Error interno del servidor.",
        });
    }



});

//Actualizamos permisos
Router.put("/:permiso_id", async(req,res) => {
    const permiso_id = Number(req.params.permiso_id);
    const {nombre} = req.body;

    try {
        await beginTransaction();
        
        if (!permiso_id) {
            throw new HttpError("No se encontro el permiso.", 400);
        }

        if (!nombre) {
            throw new HttpError("Introduce un nombre.", 400);
        }

        const consulta = "UPDATE permisos SET nombre = ? WHERE id = ?";
        const result = await query(consulta,[nombre,permiso_id]);

        if (!result || result.affectedRows === 0 ) {
            throw new HttpError("No se pudo actualizar el permiso.", 500);
        }

        await commit();

        return res.status(200).json({
            success:true,
            message:"Permiso Actualizado",
            data:{
                id: permiso_id,
                nombre:nombre
            }
        });

    } catch (error) {
        
        await rollback();

        // Si es duplicado
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "El permiso ya existe.",
            });
        }

        // Si es otro problema
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Error interno del serviddor.",
        });
    }

});

Router.delete("/:permiso_id", async(req,res) => {
    const permiso_id = Number(req.params.permiso_id);

    try {
        await beginTransaction();

        if (!Number.isInteger(permiso_id) || permiso_id <= 0) {
            throw new HttpError("El ID del permiso no es válido.", 400);
        }

        if (!permiso_id) {
            throw new HttpError("No se encontro el permiso.", 404);
        }

        // Budcamos el permiso
        const consulta = "SELECT * FROM permisos WHERE id = ?";
        const result = await query(consulta,[permiso_id]);

        if (result.length == 0) {
            throw new HttpError("Este permiso no existe",404);
        }

        // Si el permiso esta siendo utilizado
        const consulta1 = "SELECT * FROM rol_permisos WHERE permiso_id = ?";
        const result1 = await query(consulta1,[permiso_id]);

        if (result1.length != 0) {
            throw new HttpError("Este permiso está siendo utilizado, no se puede eliminar",400);
        }

        // Eliminamos permiso
        const consulta2 = "DELETE FROM permisos WHERE id = ?";
        const result2 = await query(consulta2,[permiso_id]);

        if (!result2 || result2.affectedRows === 0) {
            throw new HttpError("No se elimino el permiso.", 500);
        }

        await commit();

        return res.status(200).json({
            success:true,
            message: "Permiso Eliminado",
            data:{
                id:permiso_id
            }
        })

    } catch (error) {
        console.error(error);

        await rollback();

        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Ups. Error interno del serviddor.",
        });
        
    }

});


module.exports = Router