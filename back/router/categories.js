const express = require("express");
const Router = express.Router();
const tabla = 'categories';
//Conexion a BD
const {query, beginTransaction, commit, rollback } = require("../conexion");

//Selct
Router.get("/", async (req, res) => {
    try {
        const result = await query(`SELECT * FROM ${tabla} ORDER BY id DESC`);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error al consultar la tabla ${tabla}:`, error);
        res.status(500).json({ message: "Error al mostrar los datos." });
    }
});



//Add
Router.post("/add", async (req, res) => {
    const { name_Categoria, descripcion_Categoria } = req.body;

    if (!name_Categoria || !descripcion_Categoria) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        const consulta = `INSERT INTO ${tabla} (nombre, descripcion) VALUES (?, ?)`;
        const result = await query(consulta, [name_Categoria, descripcion_Categoria]);

        res.status(200).json({
            id: result.insertId,
            nombre: name_Categoria,
            descripcion: descripcion_Categoria,
            status: "success",
        });
    } catch (error) {
        console.error(`Error al insertar en la tabla ${tabla}:`, error);
        res.status(500).json({ message: `Error en la operación (tabla: ${tabla}).` });
    }
});  


// Update (actualizacion de datos)
Router.put("/update", async (req, res) => {
    const { idCategoria, nameCategoria, descripcionCategoria } = req.body;

    // Validaciones básicas
    if (!idCategoria || !nameCategoria || !descripcionCategoria) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        const consulta = `UPDATE ${tabla} SET nombre = ?, descripcion = ? WHERE id = ?`;
        const result = await query(consulta, [nameCategoria, descripcionCategoria, idCategoria]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Categoría no encontrada." });
        }

        res.status(200).json({
            id: idCategoria,
            nombre: nameCategoria,
            descripcion: descripcionCategoria,
            status: "success",
        });

        console.log(`Registro actualizado con éxito, Tabla: ${tabla}`);
    } catch (error) {
        console.error(`Error al actualizar la tabla ${tabla}:`, error);
        res.status(500).json({ message: `Error en la operación, Tabla: ${tabla}` });
    }
});

// Delete (Eliminacion de datos)
Router.delete("/delete", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "ID es obligatorio para eliminar la categoría" });
    }

    try {
        const consulta = `DELETE FROM ${tabla} WHERE id = ?`;
        const result = await query(consulta, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        res.status(200).json({ 
            id: id,
            status: 'success',
            message: "Categoría eliminada exitosamente"
        });
    } catch (error) {
        console.error("Error en la operación:", error);
        res.status(500).json({ 
            message: `Error en la operación, Tabla: ${tabla}`, 
            error: error.message 
        });
    }
});

module.exports = Router;