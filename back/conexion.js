//Conexion MySQL

require("dotenv").config();
const mysql = require("mysql");

const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
})

//mARCAMOS LA CONEXION A LA bd
conexion.connect((err) => {
    if (err) {
        console.log("Conexion fallida a la BD!");
        return;
    }
    console.log("Conexion exitosa a la BD!");
});

module.exports = conexion;