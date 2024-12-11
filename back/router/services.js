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

module.exports = Router;