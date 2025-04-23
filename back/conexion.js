//Conexion MySQL

require("dotenv").config();
const mysql = require("mysql");
const util = require("util");

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

// Promisificamos funciones ligadas con la conexion a la BD 
const query = util.promisify(conexion.query).bind(conexion);
const beginTransaction = util.promisify(conexion.beginTransaction).bind(conexion);
const commit = util.promisify(conexion.commit).bind(conexion);
const rollback = util.promisify(conexion.rollback).bind(conexion);

module.exports = {
    query,
    beginTransaction,
    commit,
    rollback
};