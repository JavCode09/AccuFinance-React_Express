const express = require('express');
const Router = express.Router();
const connection = require("../conexion");

//Este router maneja todos lo sposibles busquedas por modulo osea por tabla

// Moduo Categorias
Router.post("/categories", async (req, res) => {
    const { searchQuery } = req.body;
    try {
        // Validar que 'searchQuery' esté presente
        if (!searchQuery || searchQuery.trim() === "") {
            return res.status(400).json({ message: "El parámetro 'searchQuery' es requerido." });
        }
        // console.log(searchQuery);
        
        // Consulta SQL: Buscar en la tabla 'categories' por nombre o descripción
        const consulta = `SELECT * FROM categories WHERE nombre LIKE ? `;

        // Ejecutar la consulta con los valores de búsqueda seguros
        connection.query(consulta, [`%${searchQuery}%`], (err, success) => {
            if (err) {
                // Si hay un error, lo mostramos
                console.error("Error en la consulta: ", err);
                return res.status(500).json({ message: "Error al realizar la búsqueda" });
            }

            // Si la consulta es exitosa, respondemos con los resultados
            return res.status(200).json(success);
        });
    } catch (error) {
        console.error("Error al procesar la búsqueda:", error);
        return res.status(500).json({ message: "Error en mostrar los datos buscados, categories" });
    }
});


// Modulo Servicios
Router.post("/NewService", async(req,res)=>{
    const {searchQuery} = req.body;
    try {
        // Validar que 'searchQuery' esté presente
        if (!searchQuery || searchQuery.trim() === "") {
            return res.status(400).json({ message: "El parámetro 'searchQuery' es requerido." });
        }

        const consulta = `SELECT services.*, categories.nombre AS nombre_categoria
                          FROM services
                          INNER JOIN categories ON services.categoria = categories.id
                          WHERE services.nombre LIKE ?`;
        connection.query(consulta, [`%${searchQuery}%`], (err,success) => {
            if (err) {
                console.error("Error en la consulta: ", err);
                return res.status(500).json({message:"Error al realizar la búsqueda"});
            }
            return res.status(200).json(success)
        })
    } catch (error) {
        console.error("Error al procesar la búsqueda:", error);
        return res.status(500).json({ message: "Error en mostrar los datos buscados, newService" });
    }
})

module.exports = Router;
