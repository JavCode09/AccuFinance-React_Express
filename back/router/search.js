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

Router.post("/MyServices", async(req,res)=> {
    const {searchQuery} = req.body;
    try {
        if (!searchQuery || searchQuery.trim() === "") {
            return res.status(400).json({ message: "El parámetro 'searchQuery' es requerido." });
        }

        //pasamos lo que se escribio en el buscador a sin espacios en los lados y a minusculas
        const dataquery = searchQuery.trim().toLowerCase();
        const datosValidos = ['active','inactive']; //Array para comprar la busqueda en minusculas

        //Creamos la consulta principal
        let consulta = `SELECT
                        my_services.*, services.nombre
                        FROM my_services 
                        INNER JOIN services ON services.id = my_services.id_services
                        `;
        //Creamos un array bacio para agregar la busqueda o lo que s eva a buscar
        let parametrosAbuscar = [];

        //Verificamos si lo que escribió el usuario coincide con alguno de los estados válidos que tú definiste en el array (datosValidos)
        if(datosValidos.includes(dataquery)){
            consulta += 'WHERE my_services.general_status = ?';
            //Ahora tomamos de la busqueda la primera letra y la pasamos a mayusculas por que asi esta en la BD 
            //Despues tomamos el resto de la busqueda menos la primera letra ejem: active -> ctive
            //Por ultimo concatenamos la letra mayuscula y la palabra 👉 I + nactive → Inactive  y push lo empuja o lo guarda en el array bacio

            parametrosAbuscar.push(dataquery.charAt(0).toUpperCase() + dataquery.slice(1));
        }else{
            consulta += "WHERE services.nombre LIKE ?";
            parametrosAbuscar.push(`%${searchQuery}%`);
        }

        connection.query(consulta,parametrosAbuscar, (err,success) => {

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
