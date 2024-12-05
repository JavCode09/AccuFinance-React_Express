const express = require("express");
const Router = express.Router();
const tabla = 'categories';
//Conexion a BD
const connection = require("../conexion");


Router.get("/", async(req,res) => {
    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = `SELECT * FROM ${tabla}`;
            connection.query(consulta , (err,success) => {
                if (err) {
                    console.error(`Error en la consulta, Tabla: ${tabla}`, err);
                    reject(err);
                    return
                }
                resolve(success);
            });
        });
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({message: "Error en mostrar los datos, categories"})
    }
})

Router.post("/add", async (req, res) => {
    const { name_Categoria, descripcion_Categoria } = req.body;
    try {
        const result = await new Promise((resolve, reject) => {
            const consulta = `INSERT INTO ${tabla} (nombre, descripcion) VALUES (?,?)`;
            connection.query(consulta, [name_Categoria, descripcion_Categoria], (err, success) => {
                if (err) {
                    console.error(`Error en la consulta, Tabla ${tabla}: `, err);
                    reject(err);
                    return;
                }
                resolve({
                    id: success.insertId,
                    nombre: name_Categoria,
                    descripcion: descripcion_Categoria,
                    status:'success'
                });
                console.log(`Registro insertado con éxito, Tabla: ${tabla}, server`);
            });
        });
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ message: `Error en la operacion, Tabla: ${tabla}` });
    }
});


module.exports = Router;