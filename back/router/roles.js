const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Conexion a bd junto cin transaccion comit y rollback
const {query, beginTransaction, commit, rollback } = require("../conexion");

// Modulos
const tabla = "roles";
const tabla2 = "rol_permisos";
const tabla3 = "permisos";
const tabla4 = "modulos";

// Inserta roles
Router.post("/", async (req,res) => {
    const {nombre} = req.body;

    try {
        await beginTransaction();

        if (!nombre) {throw new HttpError("Nombre vacio, por favor llena el campo.",400); }

        
        // COnsulta 
        const consulta1 = `INSERT INTO ${tabla} (nombre) VALUES (?)`;
        const result1 = await query(consulta1,[nombre]);

        if (!result1 || result1.affectedRows === 0) {
            throw new HttpError(`Error al insertar el rol en la tabla  ${tabla}`,500);
        }

        // // Id del rol nuevo
        // const idRol = result1.insertId;

        // // Optenemos   todos los ids de los modulos
        // const consulta2 = `SELECT id FROM ${tabla4}`;
        // const result2 = await query(consulta2);

        // if (result2.length > 0) {
            
        //     const valores = result2.map(modulo => [
        //         idRol,
        //         modulo.id
        //     ])
            
        //     // Insertamos en la tabla de rol_permisos
        //     const consulta3 = `INSERT INTO ${tabla2} (rol_id,modulo_id) VALUES ?`;
        //     const result3 = await query(consulta3,[valores]);
            
        //     if (!result3 || result3.affectedRows === 0) {
        //         throw new HttpError(`Error al insertar los modulo con sus permisos en ${tabla2}`, 500);
        //     }
        // }else{
        //     throw new HttpError("Error, No se encontro el ningun modulo", 500);
        // }

        await commit();

        return res.status(200).json({
            success: true,
            message: "Rol agregado sin permisos",
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
            message: "Si hay registros.",
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


// Pendiente (se actualizara para actualizar permisos)
// Router.post("/permisos", async(req,res) =>{
//     const {id_rol} = req.body;

//     try {
//         if (!id_rol) { throw new HttpError("Rol no encontrado",400);
//         }
        
//         const consulta1 = `SELECT * FROM ${tabla2} WHERE rol_id = ?`;
//         const result1 = await query(consulta1,[id_rol]);

//         if (!result1) {
//             throw new HttpError("Error al buscar los permisos del rol.", 500);
//         }

//     } catch (error) {
        
//     }
// });

module.exports = Router