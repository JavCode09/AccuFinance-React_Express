const express = require('express');
const Router = express.Router();
const tabla = 'services';

//Conexion a BD
const {query, beginTransaction, commit, rollback } = require("../conexion");


//Select
Router.get("/all", async (req, res) => {
    try {
        const consulta = `
            SELECT s.*, c.nombre AS nombre_categoria
            FROM ${tabla} s
            JOIN categories c ON s.categoria = c.id
        `;
        const result = await query(consulta);
        
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error en mostrar los datos, Tabla: ${tabla}`, error);
        res.status(500).json({ message: `Error en mostrar los datos, Tabla: ${tabla}` });
    }
});

// campo select
Router.post("/select", async (req, res) => {
    try {
        const consulta = "SELECT id, nombre FROM categories";
        const result = await query(consulta);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).json({ message: "Error en obtener registros, Tabla: categories" });
    }
});

//Insert
Router.post("/add", async (req, res) => {
    const { nameNew_servicio, categorieNewService, descripcionNewService } = req.body;

    try {
        // Obtener el nombre de la categoría
        const consultaSelect = "SELECT nombre FROM categories WHERE id = ?";
        const rows = await query(consultaSelect, [categorieNewService]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        const nombreCategoria = rows[0].nombre;

        // Insertar el nuevo servicio
        const consultaInsert = `INSERT INTO ${tabla} (categoria, nombre, descripcion) VALUES (?, ?, ?)`;
        const result = await query(consultaInsert, [categorieNewService, nameNew_servicio, descripcionNewService]);

        res.status(200).json({
            message: {
                id: result.insertId,
                nombre_categoria: nombreCategoria,
                nombre: nameNew_servicio,
                descripcion: descripcionNewService,
                status: 'success'
            }
        });

        console.log(`Registro insertado con éxito, Tabla: ${tabla}, server`);

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                message: "El nombre del servicio ya existe. Por favor, usa un nombre diferente."
            });
        } else {
            console.error("Error al insertar el servicio:", error);
            res.status(500).json({
                message: "Ocurrió un error al insertar el servicio."
            });
        }
    }
});

//Update
Router.put("/update", async (req, res) => {
    const { id, id_categoria, nombre, descripcion } = req.body;

    try {
        // Actualizar el servicio
        const updateQuery = `UPDATE ${tabla} SET categoria = ?, nombre = ?, descripcion = ? WHERE id = ?`;
        const result = await query(updateQuery, [id_categoria, nombre, descripcion, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el registro a actualizar." });
        }

        // Obtener el nombre de la categoría
        const selectCategoria = "SELECT id, nombre FROM categories WHERE id = ?";
        const rows = await query(selectCategoria, [id_categoria]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        const nombreCategoria = rows[0].nombre;

        res.status(200).json({
            message: {
                id,
                nombre,
                id_categoria: rows[0].id,
                nombre_categoria: nombreCategoria,
                descripcion,
                status: "success"
            }
        });

        console.log(`Registro actualizado con éxito, Tabla: ${tabla}`);

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                message: "El nombre del servicio ya existe. Por favor, usa un nombre diferente."
            });
        } else {
            console.error("Error al actualizar el servicio:", error);
            res.status(500).json({
                message: error.message || "Ocurrió un error al actualizar el servicio."
            });
        }
    }
});

Router.delete("/delete", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "El ID del servicio es obligatorio para eliminar" });
    }

    try {
        const deleteQuery = `DELETE FROM ${tabla} WHERE id = ?`;
        const result = await query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        res.status(200).json({
            message: {
                id,
                status: "success"
            }
        });

        console.log(`Registro eliminado con éxito, Tabla: ${tabla}`);
    } catch (error) {
        console.error("Error en la operación:", error);
        res.status(500).json({
            message: `Error en la operación, Tabla: ${tabla}`,
            error: error.message
        });
    }
});

module.exports = Router;