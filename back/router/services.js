const express = require('express');
const Router = express.Router();
const tabla = 'services';

const connection = require("../conexion");


//Select
Router.get("/all", async(req,res) => {
    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = `
                SELECT s.*, c.nombre AS nombre_categoria
                FROM ${tabla} s
                JOIN categories c ON s.categoria = c.id
            `;
            connection.query(consulta,(err,success)=> {
                if (err) {
                    console.error(`Error en la consulta, Tabla: ${tabla} `, err);
                    reject(err);
                    return;
                }
                resolve(success);
            })
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: `Error en mostrar los datos,Tabla: ${tabla}`})
        console.log(error);
        
    }
});

// campo select
Router.post("/select", async(req,res) => {
    try {
        const result = await new Promise((resolve, reject)=> {
            const consulta =  "SELECT id,nombre FROM categories";
            connection.query(consulta, (err, success) =>{
                if (err) {
                    console.error(`Error en la consulta, Tabla: ${tabla}` . err);
                    reject(err);
                    return
                }
                resolve(success);
            })
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: `Error en obtener registros, Tabla: ${tabla}`})
        console.error("Error al obtener las categorías:", error);
        
    }
})

//Insert
Router.post("/add", async(req,res)=>{
      const { nameNew_servicio, categorieNewService, descripcionNewService } = req.body;
    try {
        const result = await new Promise((resolve,reject)=> {
             //Si no y error buscamos en la tabla categorias el nombre del id seleccionado
                // y lo mandamos a la vista para mostrarlo
                const consultaSelect='SELECT nombre  FROM categories WHERE id = ?';
                connection.query(consultaSelect,categorieNewService ,(err,rows) => {
                    if (err) {
                        console.error("Error al buscar la categoría:", err);
                        reject(err);
                        return;
                    }

                    if (rows.length === 0) {
                        reject(new Error("Categoría no encontrada"));
                        return;
                    }

                    const nombreCategoria = rows[0].nombre;

                    const consulta = `INSERT INTO ${tabla} (categoria,nombre,descripcion) VALUES (?,?,?)`; 
                    connection.query(consulta,[categorieNewService,nameNew_servicio,descripcionNewService], (err,success) => {
                        if (err) {
                            console.error(`Error en la consulta, Tabla ${tabla}: `, err);
                            reject(err);
                            return;
                        }
                        resolve({
                            id: success.insertId,
                            nombre_categoria: nombreCategoria,
                            nombre: nameNew_servicio,
                            descripcion: descripcionNewService,
                            status: 'success'
                        })
                
                        console.log(`Registro insertado con éxito, Tabla: ${tabla}, server`);
                    });
                })
            });
        res.status(200).json({message: result})
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") { //Si es duplicacion, que ya existe ese nombre (la tabla tiene unique en nombre)
            res.status(409).json({ 
                message: "El nombre del servicio ya existe. Por favor, usa un nombre diferente." 
            });
        } else {
            res.status(500).json({ 
                message: "Ocurrió un error al insertar el servicio." 
            });
        }
        
    }
})

//Update
Router.put("/update", async (req, res) => {
    const { id, id_categoria, nombre, descripcion } = req.body;
    try {
        let consulta; // Declaración de la variable `consulta` fuera del bloque if-else
    
        const result = await new Promise((resolve, reject) => {
            // Asignación directa sin `const`
            consulta = `UPDATE ${tabla} SET categoria = ?, nombre = ?, descripcion = ? WHERE id = ?`;
            connection.query(consulta, [id_categoria, nombre, descripcion, id], (err, success) => {
                if (err) {
                    console.error(`Error en la consulta UPDATE, Tabla: ${tabla}:`, err);
                    reject(err);
                    return;
                }
    
                // Si no se actualizó ninguna fila, significa que el ID no existe
                if (success.affectedRows === 0) {
                    return reject(new Error("No se encontró el registro a actualizar."));
                }
    
                // Segunda consulta para obtener el nombre de la categoría
                const consulta2 = "SELECT id, nombre FROM categories WHERE id = ?";
                    connection.query(consulta2, [id_categoria], (err, rows) => {
                    if (err) {
                        console.error(`Error en la consulta SELECT, Tabla: categories:`, err);
                        reject(err);
                    } else {
                        resolve({
                            id: id,
                            nombre: nombre,
                            id_categoria: rows[0].id,  // Corregido: `rows[0]`
                            nombre_categoria: rows[0].nombre, // Corregido: `rows[0]`
                            descripcion: descripcion,
                            status: "success",
                        });
                        console.log(`Registro Actualizado con éxito, Tabla: ${tabla}`);
                    }
                });
            });
        });
    
        res.status(200).json({ message: result });
    
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") { 
            res.status(409).json({ 
                message: "El nombre del servicio ya existe. Por favor, usa un nombre diferente." 
            });
        } else {
            res.status(500).json({ 
                message: error.message || "Ocurrió un error al actualizar el servicio." 
            });
        }
    }
});

Router.delete("/delete", async(req,res) => {
    const {id} = req.body;

    if (!id) {
       return res.status(400).json({message: "El ID del servicio es obligatorio para eliminar"})
    }

    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = `DELETE FROM ${tabla} WHERE id = ?`;
            connection.query(consulta,[id],(err,success) => {
                if (err) {
                    console.error(`Error en la consulta, tabla ${tabla}: `, err);
                    reject(err);
                    return
                }
                if (success.affectedRows === 0) {
                    reject(new Error("NewService no encontrado"));
                    return
                }
                resolve({
                    id: id,
                    status:'success',
                })
            })
        })
        res.status(200).json({message:result})
    } catch (error) {
        console.error("Error en la operación:", error);
        res.status(500 ).json({message:`Error en la operacion, Tabla:  ${tabla}: `,  error: error.message })
    }
})

module.exports = Router;