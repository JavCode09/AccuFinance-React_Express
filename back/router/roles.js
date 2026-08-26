const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Conexion a bd junto cin transaccion comit y rollback
const {query, beginTransaction, commit, rollback } = require("../conexion");

// Modulos
const tabla = "roles";
const tabla2 = "rol_permisos";


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
        const consulta2 = `SELECT * 
        FROM ${tabla} ORDER BY id DESC`;
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
Router.get("/:id", async(req,res) =>{
    const {id} =  req.params;

    try {
        const consulta1 = `SELECT 
                    m.id AS modulo_id,
                    m.nombre AS nombre_modulo,
                    p.id AS permiso_id,
                    p.nombre AS nombre_permiso,

                    CASE
                        WHEN rp.permiso_id IS NULL THEN 0
                        ELSE 1
                    END AS activo

                    FROM modulos m

                    CROSS JOIN permisos p

                    LEFT JOIN rol_permisos rp
                        ON rp.modulo_id = m.id
                        AND rp.permiso_id = p.id
                        AND rp.rol_id = ?

                    ORDER BY m.id, p.id;   
        `;

        const result1 = await query(consulta1, [id]);

        if (!result1 || result1.length === 0) {
            throw new HttpError("No se encontraron permisos para este rol.", 404);
        }

        // Agrupamos po rmodulo cada permiso asi llegaran  por modulo sus permisos
        const permisosAgrupados = result1.reduce((acc, item) => {

            let modulo = acc.find(
                m => m.modulo_id === item.modulo_id
            );

            if (!modulo) {
                modulo = {
                    modulo_id: item.modulo_id,
                    nombre_modulo: item.nombre_modulo,
                    permisos: []
                };

                acc.push(modulo);
            }

            modulo.permisos.push({
                permiso_id: item.permiso_id,
                nombre_permiso: item.nombre_permiso,
                activo: Boolean(item.activo)
            });

            return acc;

        }, []);

        return res.status(200).json({
            success: true,
            message: "Exito",
            data: permisosAgrupados
        })

    } catch (error) {
        console.error(error);
        
        // Si el error es 500 dira (Error interno del servidor)
        return res.status(error.status || 500).json({
            success: false,
            message: error.status ? error.message : "Error interno del servidor",
            data:null
        })
    }
    console.log(id);
    
    return res.status(200).json(id);

});

Router.put("/", async(req,res) => {
    const {rol_id, modulo_id, permisos} = req.body;

    try {
        await beginTransaction();

        // Validamos los requerimientos
        if (!rol_id) {
            throw new HttpError("No se encontro ningun rol relacionado.", 400);
        }

        if (!permisos || permisos.length === 0 ) {
            throw new HttpError("No se encontro ningun permiso o modulo relacionado.", 400);
        }

        // Consulta para insertar o eliminar permisos relacionados
        
        // console.log(rol_id);
        // console.log(modulo_id);
        // console.log(permisos);
        // Recorremos cada permiso del modulo 
        for (const permiso of permisos) {

            // console.log("Entro al for");
           
            
            const consulta1 =`SELECT 
                                    id 
                                FROM ${tabla2} 
                                WHERE 
                                    rol_id = ? AND
                                    modulo_id = ? AND
                                    permiso_id = ?
                                `
            
            const result1 = await query(consulta1,[rol_id,modulo_id,permiso.permiso_id]);
            
           
            // Si el permiso es verdadero y no esta en la bd insertamos
            if (permiso.activo === true && result1.length === 0) {

                // console.log("Entro a insertar");
                
                // insertamos data
                const consulta2 = "INSERT INTO rol_permisos (rol_id,modulo_id,permiso_id) VALUES (?,?,?)";
                const result2 = await query(consulta2, [rol_id,modulo_id,permiso.permiso_id]);

                if (!result2 || result2.affectedRows === 0) {
                    throw new HttpError("Hubo un problema en la insercion de los permisos a la tabla rol_permisos", 500);
                }

                // si el permiso es falso (desactivado) y  existe en la bd eliminamos
            }else if(permiso.activo === false && result1.length > 0){
                
                // console.log("Entro a eliminar");
                
                // Eliminamos permisos 
                const consulta3 = "DELETE FROM rol_permisos WHERE rol_id = ? AND modulo_id = ? AND  permiso_id = ?";
                const result3 = await query(consulta3, [rol_id,modulo_id,permiso.permiso_id]);

                if (!result3 || result3.affectedRows === 0) {
                    throw new HttpError("Ocurrio un error al eliminar el permiso o los permisos de la tabla rol_permisos", 500);
                }
            }
        }

        await commit();

        // RETORNAMOS LAS RESPUESTAS
        return res.status(200).json({
            success:true,
            message:"Permisos actualizados correctamente"
        })

    
    } catch (error) {
        
        await rollback();
         
        console.log(error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.status ? error.message : "Error interno del servidor"
        })
    }
  
});

Router.put("/:rol_id", async(req,res) =>{
    const {rol_id} = req.params;
    const {permisos} = req.body;

    // console.log("Desde la API: " , rol_id);
    // console.log("Desde la API: " , permisos);

    try {
        await beginTransaction();
        // Validamos informacion
        if (!rol_id) {
            throw new HttpError("No se encontro el rol relacionado", 400);
        }

        if (!permisos || permisos.length === 0) {
            throw new HttpError("No se encontro ningun permiso", 400);
        }

        // Recorremos todos los permisos para precesar modulos y permisos

        // Recorremos modulos
        for (const modulo of permisos) { // Recorremos modulos
            for (const permiso of modulo.permisos) { // Recorremos permisos
                // Consultamos tabla para comprar si insertamos o eliminamo permisos
                const consulta1 = `SELECT id FROM ${tabla2} 
                                    WHERE 
                                        rol_id = ? AND
                                        modulo_id = ? AND
                                        permiso_id = ?
                `;

                const result1 = await query(consulta1,[rol_id,modulo.modulo_id,permiso.permiso_id]);

                // Si el permiso es true y no existe en la bd INSERTAMOS
                if (permiso.activo === true && result1.length === 0) {

                   const consulta2 = `INSERT INTO  ${tabla2} (rol_id,modulo_id,permiso_id) VALUES (?,?,?)`;
                   const result2 = await query(consulta2,[rol_id,modulo.modulo_id,permiso.permiso_id]);

                   console.log("Se inserto");
                   
                // Si el permiso es false y existe en la bd lo ELIMINAMOS
                }else if(permiso.activo === false && result1.length > 0){
                    const consulta3 = `DELETE FROM ${tabla2} WHERE rol_id = ? AND modulo_id = ? AND permiso_id = ?`;
                    const result3 = await query(consulta3, [rol_id,modulo.modulo_id,permiso.permiso_id]);

                }
            }
        }
        
        // lo que pase terminamos
        await commit();

            return res.status(200).json({
                success: true,
                message: "Actualización de permisos exitosa.",
        });
    

    } catch (error) {
        console.log(error);

        return res.status(error.status || 500).json({
            success: false,
            message: error.status ? error.message : "Error interno del servidor"
        });
        
    }
    
});

Router.delete("/", async(req,res)=>{
    const {rol_id} = req.body;

    try {
        await beginTransaction();

        if (!rol_id) {
            throw new HttpError("No se encontro el rol.", 400);
        }

        // Validamos si el rol_id es Super Administrador (no puede ser elimnado aun con validacion de permisos y roles)
        if (rol_id == 1) {
            throw new HttpError("Rol super administrador, no es posible eliminar.", 403);
        }

        // Buscamos en la bd si tiene usuarios utilizando este rol 
        const consulta1 = "SELECT * FROM users WHERE rol = ?";
        const result1 = await query(consulta1,[rol_id]);
        
        if (!result1.length === 0) {
            throw new HttpError("No es posible eliminarlo, Hay usuarios con este rol.");
        }

        const consulta2 = "SELECT * FROM user_access_log WHERE rol = ?";
         const result2 = await query(consulta2,[rol_id]);
        
        if (!result2.length === 0) {
            throw new HttpError("No es posible eliminarlo, Hay usuarios con este rol.");
        }

        // Si existen permisos relacionados al rol estos se eliminaran
        const consulta3 = "DELETE FROM rol_permisos WHERE permiso_id = ?";
        const result3 = await query(consulta3,[rol_id]);

        // Eliminamos el rol
        const consulta4 = "DELETE FROM roles WHERE id = ?";
        const result4 = await query(consulta4,[rol_id]);
        
        if (result4.affectedRows === 0) {
            throw new Error("No se pudo eliminar el rol.", 404);
        }

        
        await commit();

        // respuesta
        return res.status(200).json({
             success: true,
            message: "Rol Eliminado de forma exitosa "
        })
        
    } catch (error) {
        console.error(error);
        
        return res.status(error.status || 500).json({
            success:false,
            message: error.status ? error.message : "Error interno del servidor"
        });
        
    }
});

module.exports = Router