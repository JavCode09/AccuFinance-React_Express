const express = require('express');
const Router = express.Router();
const Tabla = 'my_services';

const connection = require("../conexion");


Router.get("/all", (req,res)=> {
    const {id} = req.query;

    if (!id) {
        return res.status(400).json({message: "El id del Usuario no se encontro."})
    }

        //Consulta
        const consulta = `SELECT  mys.*,
                                  ser.nombre 
                                  FROM ${Tabla} mys
                                  INNER JOIN services ser ON mys.id_services = ser.id 
                                  WHERE mys.id_user = ?`;

        connection.query(consulta, [id], (err, result) => {
            if (err) {
                console.error(`Error en la consulta  ${Tabla}: ` , err);
                return res.status(500).json({message:"Error al ejecutar la consulta"})
            }

            return res.status(200).json({data: result})

        })  

    })

Router.post("/add", (req,res) => {
    const {nombre_plan, idUser, Año, Meses, myServicesPanel} = req.body;

    //Creamos transacion 
    connection.beginTransaction((err) => {
        if (err) {
            return res.status(400).json({message: "Error al inicializar la transaccion."})
        }

        try {
            
            if(!idUser){ return res.status(400).json({message: "No hay usuario asignado."}) }
            if(!Año){ return res.status(400).json({message: "No hay Año asignado."}) }
            if(!Meses){ return res.status(400).json({message: "No hay Meses asignados."}) }
            if(!myServicesPanel){ return res.status(400).json({message: "No hay servicios asignados."}) }
    
            const consulta = "INSERT INTO plan_de_pagos (nombre_plan,user_id,año,meses,servicios) VALUES (?,?,?,?,?)";
            connection.query(consulta, [nombre_plan, 
                                        idUser, 
                                        Año,  
                                        JSON.stringify(Meses),
                                        JSON.stringify(myServicesPanel)] , (err,result) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({message: "Error al crear el plan de pagos."})
                    })
                }

                //Si todo sale bien, hacemos commit
                connection.commit((commitErr)=> {
                    if (commitErr) {
                        return connection.rollback(()=> {
                            res.status(500).json({message: "Error al confirmar la transaccion."})
                        })
                    }

                    res.status(200).json({data: result, message:"Plan de pagos creado exitosamente."})
                })
            });
        } catch (error) {
            connection.rollback(() => {
                res.status(500).json({ message: "Error inesperado.", error });
            });
        }
    });
    
})



module.exports = Router