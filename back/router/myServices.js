const express = require("express");
const Router = express.Router();
const connection = require("../conexion");

const tabla = "my_services";

Router.get('/all', async(req,res) => {
    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = `SELECT
                                my_services.*,
                                services.nombre
                            FROM ${tabla}
                            INNER JOIN services ON ${tabla}.id_services = services.id`;
            connection.query(consulta, (err, success) => {
                if (err) {
                    console.error(`Error en la consulta, Tabla: ${tabla} `, err);
                    reject(err)
                    return
                }
                resolve(success);
            })
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500),json({message: `Error en mostrar los datos, Tabla ${tabla}: `})
        console.log(error);
        
    }
})

Router.get("/AllServices", async(req,res) => {
    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = "SELECT * FROM services";
            connection.query(consulta,(err,success) => {
                if (err) {
                    console.error(`Error en la consulta, Tabla ${tabla}: `, err);
                    reject(err);
                    return
                }
                resolve(success);
            })
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: `Error en mostrar los datos,Tabla: ${tabla}`})
        console.log(error);
    }
})

Router.post("/AddMyService", async(req,res) => {
    //Traemos la informacion
    const  {Servicio,Id_user,Descripcion,Monto,Dia_pago,Fecha_inicio} = req.body;

     // Validar si alguna variable está vacía o indefinida
     if (!Servicio) return res.status(400).json({message: "El campo 'Servicio' está vacío" });
     if (!Id_user) return res.status(400).json({ message: "El campo 'Id_user' está vacío" });
     if (!Descripcion) return res.status(400).json({ message: "El campo 'Descripcion' está vacío" });
     if (!Monto) return res.status(400).json({ message: "El campo 'Monto' está vacío" });
     if (!Dia_pago) return res.status(400).json({ message: "El campo 'Dia_pago' está vacío" });
     if (!Fecha_inicio) return res.status(400).json({ message: "El campo 'Fecha_inicio' está vacío" });
    
    try {
        const result = await new Promise((resolve,reject) => {
            const consulta = "INSERT INTO my_services (id_services,id_user,descripcion,monto,dia_pago,fecha_inicio) VALUES (?,?,?,?,?,?)";
            connection.query(consulta, [Servicio,Id_user,Descripcion,Monto,Dia_pago,Fecha_inicio], (err, success) => {
                if (err) {
                    console.error(`Error en la consulta Tabla ${tabla}: `,  err);
                    reject(err);
                    return
                }
                resolve({
                    status: 'success',
                    mensaje: "¡Exitoso!, Nuevo servicio agregado",
                }) 
               
            });
        })
        res.status(200).json({message: result})
    } catch (error) {
        res.status(500).json({
            message:"Ocurrio un error al tratar de guardar el servicio."
        })
    }
})

module.exports = Router;