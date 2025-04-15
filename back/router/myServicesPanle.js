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

module.exports = Router