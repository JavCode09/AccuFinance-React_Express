const express = require("express");
const Router = express.Router();
const connection = require("../conexion");

const tabla = "my_services";

Router.get('/all', async(req,res) => {
    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = `SELECT
                                my_services.*,
                                services.nombre
                            FROM ${tabla}
                            INNER JOIN services ON ${tabla}.id_services = services.id`;
            connection.query(consulta, (err, success) => {
                if (err) {
                    console.error(`Error en la consulta, Tabla: ${tabla} `, err);
                    reject(err)
                    return
                }
                resolve(success);
            })
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500),json({message: `Error en mostrar los datos, Tabla ${tabla}: `})
        console.log(error);
        
    }
})

Router.get("/AllServices", async(req,res) => {
    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = "SELECT id,nombre FROM services";
            connection.query(consulta,(err,success) => {
                if (err) {
                    console.error(`Error en la consulta, Tabla ${tabla}: `, err);
                    reject(err);
                    return
                }
                resolve(success);
            })
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: `Error en mostrar los datos,Tabla: ${tabla}`})
        console.log(error);
    }
})

Router.post("/AddMyService", async(req,res) => {
    //Traemos la informacion
    const  {Servicio,Id_user,Descripcion,Monto,Dia_pago,Fecha_inicio} = req.body;

     // Validar si alguna variable está vacía o indefinida
     if (!Servicio) return res.status(400).json({message: "El campo 'Servicio' está vacío" });
     if (!Id_user) return res.status(400).json({ message: "El campo 'Id_user' está vacío" });
     if (!Descripcion) return res.status(400).json({ message: "El campo 'Descripcion' está vacío" });
     if (!Monto) return res.status(400).json({ message: "El campo 'Monto' está vacío" });
     if (!Dia_pago) return res.status(400).json({ message: "El campo 'Dia_pago' está vacío" });
     if (!Fecha_inicio) return res.status(400).json({ message: "El campo 'Fecha_inicio' está vacío" });
    
    // Iniciar Transacción 
    connection.beginTransaction(async(err)=> {
        if (err) {
            return res.status(500).json({ message: "Error al iniciar la transacción. "});
        }
        
        try {
            //Consulta
            const result = await new Promise((resolve,reject) => {
            const consulta = `INSERT INTO ${tabla} (id_services,id_user,descripcion,monto,dia_pago,fecha_inicio) VALUES (?,?,?,?,?,?)`;
                connection.query(consulta, [Servicio,Id_user,Descripcion,Monto,Dia_pago,Fecha_inicio], (err, success) => {
                    if (err) {
                        console.error(`Error en la consulta Tabla ${tabla}: `,  err);
                        reject(err);
                        return
                    }
                    resolve(success);
                });
            })

            // Confirmamos transacción 
            connection.commit((err) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ message: "Error al confirmar la transacción."})
                    })
                }
                return res.status(200).json({ message: "!Éxito! Nuevo servicio agregado"})
            })
        } catch (error) {
            connection.rollback(() => {
                res.status(500).json({message:"Ocurrio un error al tratar de guardar el servicio."})
                // console.log(error);
                
            })
        }
    })
})

//Select , Mostrar la informacion en el modal acrtualizar
Router.get("/GetMyService", (req, res) => {
    const { id_Myservice } = req.query;

    if (!id_Myservice) {
        return res.status(400).json({ message: "El id del servicio no se encontró." });
    }

    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: "Error al iniciar la transacción." });
        }

        const consulta = `
            SELECT ${tabla}.*, services.nombre
            FROM ${tabla} 
            INNER JOIN services ON ${tabla}.id_services = services.id
            WHERE ${tabla}.id_myservices = ?
        `;

        connection.query(consulta, [id_Myservice], (err, result) => {
            if (err) {
                console.error(`Error en la consulta ${tabla}:`, err);
                return connection.rollback(() => {
                    res.status(500).json({ message: "Error al ejecutar la consulta." });
                });
            }

            // Confirmamos la transacción solo si la consulta es exitosa
            connection.commit((err) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ message: "Error al confirmar la transacción." });
                    });
                }

                return res.status(200).json({ data: result });
            });
        });
    });
});

//Update
Router.put("/updateMyServices", (req,res)=> {
    const {id_myservices,idServicio,id_user,descripcion,monto,diaPago,fechaInicio} = req.body;

    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({message:"Error al iniciar la transaccion"});
        }
 
        // Validar si alguna variable está vacía o indefinida
        if (!id_myservices){return res.status(400).json({message:"No se encontro registro. "})};
        if (!idServicio){return res.status(400).json({message:"Selecciona un Servicio. "})};
        if (!id_user){return res.status(400).json({message:"No se encontro al usuario relacionado. "})};
        if (!monto || isNaN(parseFloat(monto))){return res.status(400).json({message:"El campo monto esta vacio o no es numero. "})};
        if (!diaPago || isNaN(Number(diaPago)) || !Number.isInteger(Number(diaPago))){return res.status(400).json({message:"El campo Dia de Pago está vacio o no es un número "})};
        if (!fechaInicio){return res.status(400).json({message:"El campo fecha de inicio está vacia. "})};

        //Consulta Update
        const consulta = `UPDATE ${tabla} SET id_services = ?, descripcion=?, monto=?, dia_pago=?, fecha_inicio=? WHERE  id_myservices =? AND id_user=?`;
        connection.query(consulta, [idServicio,descripcion,monto,diaPago,fechaInicio,id_myservices,id_user], (err,result) => {
            if (err) {
                console.error(`Error en la consulta ${tabla}:`, err);
                return res.status(500).json({message:"Error al ejecutar la consulta."})
            };

            // Si no se actualizó ninguna fila, significa que el id_user no fue encontrado
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "No se encontró el registro." });
            }
            //Confirmamos la transaccion si se realiza la cosnulta de forma correcta
            connection.commit((err) => {
                if (err) {
                    return connection.rollback(()=>{
                        res.status(500).json({message:"Error al confirmar la transaccion"});
                    })
                }

                return res.status(200).json({message:"!Servicio Actualizado con exito!."})
                // return res.status(200).json({ data: result }); //Este trae la informacion del registro actualizado
            })
        })
    })
})

//Delete
Router.delete("/deleteMyService", async(req,res)=>{
    const {idDelete,name} = req.body;
    console.log(idDelete);
    
    connection.beginTransaction((err)=> {
        if (err) {
            return res.status(500).json({message:"Error al iniciar la transaccion"})
        }

        if (!idDelete) {
            return res.status(400).json({message:"No se encontro el identificador del Servicio."})
        }
    
        const consulta = "DELETE FROM my_services WHERE id_myservices = ?";
        connection.query(consulta,[idDelete], (err,success)=> {
            if (err) {
                console.error("Error en la consulta: ", err);
                return res.status(500).json({message:"Error al ejecutar la consultas."});   
            }

            //Confirmar transaccion
            connection.commit((err) => {
                if(err){
                    return connection.rollback(() => {
                        res.status(500).json({message:"Erro al confirmar la transacicon."})
                    })
                }
                return res.status(200).json({message:"¡Servicio Eliminado. !"})
            })
        })
    })
})


module.exports = Router;