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

// Campo select de la opcion agregar
Router.post("/select", async(req,res) => {
    try {
        const result = await new Promise((resolve, reject)=> {
            const consulta =  "SELECT * FROM categories";
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

                    const consulta = "INSERT INTO services (categoria,nombre,descripcion) VALUES (?,?,?)"; 
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
Router.put("/update", async(req,res)=>{
    const {newService_id, 
            newService_categoriaid, 
            newService_categoria, 
            newService_servico, 
            newService_descripcion} = req.body;
    
    try {
    
        const result = await new Promise((resolve,reject) => {
            const consulta = "UPDATE services SET categoria = ?, nombre = ?, descripcion = ? WHERE id = ?";
            connection.query(consulta,[newService_categoriaid,newService_servico,newService_descripcion,newService_id],(err,success) => {
                if (err) {
                    console.error(`Error en la consulta UPDATE, Tabla: ${tabla}: ` , err);
                    reject(err);
                    return
                }

                const consulta2= "SELECT nombre FROM categories WHERE id = ?";
                connection.query(consulta2,[newService_categoriaid],(err,rows) => {
                    if (err) {
                        console.error(`Error en la consulta SELECT, Tabla: ${tabla}: ` , err);
                        reject(err);
                       
                    }else if (rows.length === 0) {
                        reject(new Error("Categoría no encontrada"));
                    }else{

                        const nombreCategoria = rows[0].nombre;
    
                        resolve({
                            id:newService_id,
                            nombre:newService_servico,
                            nombre_categoria:nombreCategoria,
                            descripcion:newService_descripcion,
                            status: "success",
                        })
                        console.log(`Registro Actualizado con éxito, Tabla: ${tabla}, server`);
                    }

                })

            })

        });
        res.status(200).json({message: result});
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") { //Si es duplicacion, que ya existe ese nombre (la tabla tiene unique en nombre)
            res.status(409).json({ 
                message: "El nombre del servicio ya existe. Por favor, usa un nombre diferente." 
            });
        } else {
            res.status(500).json({ 
                message: "Ocurrió un error al actualizar el servicio." 
            });
        }
    }
})

module.exports = Router;