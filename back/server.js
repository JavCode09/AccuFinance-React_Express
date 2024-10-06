require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();

const corsOption = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOption));

//middleware para parsear json
app.use(express.json());

//asignamos puerto
const port = process.env.PORT;

//middleware para requerimiento del registro
app.use("/Registro" ,  require("./router/registro"));

//middleware para requerimiento del login
app.use("/Login" ,  require("./router/registro"));


app.listen(port, () => {
    console.log("Servidor activo en PORT: ", port);
    
})