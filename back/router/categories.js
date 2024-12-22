const express = require("express");
const Router = express.Router();
const tabla = 'categories';
//Conexion a BD
const connection = require("../conexion");

//Selct
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

//Add
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

// Update (actualizacion de datos)
Router.put("/update", async (req,res) => {
    const {idCategoria,nameCategoria,descripcionCategoria} = req.body;
    try {
        const result = await new Promise((resolve, reject) => {
            const consulta = `UPDATE ${tabla} SET nombre = ?, descripcion = ? WHERE id = ?`;
            connection.query(consulta, [nameCategoria,descripcionCategoria,idCategoria], (err,success) => {
                if (err) {
                    console.error(`Error en la consulta, Tabla: ${tabla}: `, err);
                    reject(err);
                    return
                }
                if (success.affectedRows === 0) {
                    reject(new Error("Categoría no encontrada"));
                    return;
                }
                resolve({
                    id: idCategoria,
                    nombre: nameCategoria,
                    descripcion: descripcionCategoria,
                    status: "success",
                });
                console.log(`Registro Actualizado con éxito, Tabla: ${tabla}, server`);
            })
        })
        res.status(200).json({ message: result});
    } catch (error) {
        res.status(500).json({ message: `Error en la operacion, Tabla: ${tabla}` + error });
    }
})

// Delete (Eliminacion de datos)
Router.delete("/delete", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "ID es obligatorio para eliminar la categoría" });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const consulta = `DELETE FROM ${tabla} WHERE id = ?`;
            connection.query(consulta, [id], (err, success) => {
                if (err) {
                    console.error(`Error en la consulta, tabla ${tabla}: `, err);
                    reject(err);
                    return;
                }
                if (success.affectedRows === 0) {
                    reject(new Error("Categoría no encontrada"));
                    return;
                }
                resolve({
                    id: id,
                    status:'success',  
                });
            });
        });

        res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error en la operación:", error);
        res.status(500).json({ message: `Error en la operación, Tabla: ${tabla}`, error: error.message });
    }
});

module.exports = Router;