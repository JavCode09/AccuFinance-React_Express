const express = require("express");
const Router = express.Router();

// Define la ruta POST
Router.get("/", (req, res) => {
    // Envía una respuesta indicando que la petición fue exitosa
    res.status(200).json({
        message: "Petición del servidor exitosa",
        data: req.body // Incluye los datos del cuerpo de la solicitud si los hay
    });
});

module.exports = Router;