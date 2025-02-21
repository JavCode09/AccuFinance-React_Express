require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();

const corsOption = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

// LLamos la verificacion el JSW para mas proteccion y seguridad
const verifyToken = require("./middlewares/verifyToken");

app.use(cors(corsOption));

//middleware para parsear json
app.use(express.json());

//asignamos puerto
const port = process.env.PORT;

//middleware para requerimiento del registro
app.use("/Registro" ,  require("./router/registro"));

//middleware para requerimiento del login
app.use("/Login" ,  require("./router/registro"));

// Rutas protegidas (aplicar verifyToken) Registro y Login
app.use("/Protected_main", verifyToken,require("./router/main")); // Rutas protegidas

// Modulos ------> 
app.use("/categories",verifyToken, require("./router/categories"));

app.use("/services",verifyToken, require("./router/services"));

app.use("/myServices", require("./router/myServices"));

//Buscador de modulos simple
app.use("/search",verifyToken, require("./router/search"));

app.listen(port, () => {
    console.log("Servidor activo en PORT: ", port);
    
})