const express = require('express');
const Router = express.Router();
const Tabla = 'my_services';

const connection = require("../conexion");


Router.get("/all", (req,res)=> {
    const {id} = req.query;
    const active = 'Active';
    if (!id) {
        return res.status(400).json({message: "El id del Usuario no se encontro."})
    }

        //Consulta
        const consulta = `SELECT  mys.*,
                                  ser.nombre 
                                  FROM ${Tabla} mys
                                  INNER JOIN services ser ON mys.id_services = ser.id 
                                  WHERE mys.id_user = ? AND general_status = ?`;

        connection.query(consulta, [id,active], (err, result) => {
            if (err) {
                console.error(`Error en la consulta  ${Tabla}: ` , err);
                return res.status(500).json({message:"Error al ejecutar la consulta"})
            }

            return res.status(200).json({data: result})

        })  

    })

Router.post("/add", (req,res) => {
    const {idUser, Año, Meses, myServicesPanel,nombre_plan} = req.body;

    //Creamos transacion 
    connection.beginTransaction((err) => {
        if (err) {
            return res.status(400).json({message: "Error al inicializar la transaccion."})
        }

        try {
            
            if(!idUser){ return res.status(400).json({message: "No hay usuario asignado."}) }
            if(!Año || Año === 0){ return res.status(400).json({message: "No hay Año asignado."}) }
            
            if (!Array.isArray(Meses) || Meses.length === 0) {
                return res.status(400).json({ message: "No hay Meses asignados." });
            }
            if (!Array.isArray(myServicesPanel) || myServicesPanel.length === 0) {
                return res.status(400).json({ message: "No hay servicios asignados." });
            }
            
            if(!nombre_plan){ return res.status(400).json({message: "Asigna un nombre a tu Plan."}) }
    
            const consulta = "INSERT INTO planes (nombre_plan,user_id,año,meses,servicios) VALUES (?,?,?,?,?)";
            connection.query(consulta, [nombre_plan, 
                                        idUser, 
                                        Año,  
                                        JSON.stringify(Meses),
                                        JSON.stringify(myServicesPanel)] , (err,result) => {
                if (err) {

                    //Si es duplicado el nombre
                    if (err.code === 'ER_DUP_ENTRY') {
                        return connection.rollback(()=>{
                            res.status(409).json({message: "Este nombre de plan ya está asignado a tu cuenta."});
                        })
                    }
                    // si es otro error
                    return connection.rollback(() => {
                        res.status(500).json({message: "Error al crear el plan."})
                    })
                }

                //Si todo sale bien has aqui ahora insertamos en planes de pago
                // const consulta2 = "";

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