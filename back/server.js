require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();

const corsOption = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

// LLamos la verificacion el JWT para mas proteccion y seguridad
const verifyToken = require("./middlewares/verifyToken");

app.use(cors(corsOption));

//middleware para parsear json
app.use(express.json());

//asignamos puerto
const port = process.env.PORT;

//middleware para requerimiento del registro y login (inicio see sesion)
app.use("/auth" , require("./router/auth"));

// Rutas protegidas (aplicar verifyToken) Registro y Login
app.use("/api", verifyToken,require("./router/main")); // Rutas protegidas

// Modulos ------> 
app.use("/categories",verifyToken, require("./router/categories"));

app.use("/services",verifyToken, require("./router/services"));

app.use("/myServices",verifyToken , require("./router/myServices"));

app.use("/myServicesPanle", require("./router/myServicesPanle"));

//Buscador de modulos simple
app.use("/search",verifyToken, require("./router/search"));

app.listen(port, () => {
    console.log("Servidor activo en PORT: ", port);
    
})