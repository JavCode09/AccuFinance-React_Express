const express = require('express');
const Router = express.Router();
const my_services = 'my_services';
const planes = 'planes';
const planes_de_pago = 'planes_de_pago';

const {query, beginTransaction, commit, rollback } = require("../conexion");

Router.get("/all", async(req,res)=> {
    const {id} = req.query;
    const active = 'Active';
    if (!id) {
        return res.status(400).json({message: "El id del Usuario no se encontro."})
    }

    try {
      //Consulta
      const consulta = `SELECT  mys.*,
                                  ser.nombre 
                                  FROM ${my_services} mys
                                  INNER JOIN services ser ON mys.id_services = ser.id 
                                  WHERE mys.id_user = ? AND general_status = ?`;

      const result = await query(consulta, [id,active]);
      return res.status(200).json({data: result})
    } catch (error) {
      console.error(`Error en la consulta ${my_services}:`, error);
      return res.status(500).json({ message: "Error al ejecutar la consulta" });
    }
})




Router.post("/add", async (req, res) => {
    const { idUser, Año, Meses, myServicesPanel, nombre_plan } = req.body;
  
    try {
      await beginTransaction();
  
      if (!idUser) return res.status(400).json({ message: "No hay usuario asignado." });
      if (!Año || Año === "0") return res.status(400).json({ message: "No hay Año asignado." });
      if (!Array.isArray(Meses) || Meses.length === 0 || Meses.includes("0"))
        return res.status(400).json({ message: "No hay Meses asignados." });
      if (!Array.isArray(myServicesPanel) || myServicesPanel.length === 0 || myServicesPanel.includes("0"))
        return res.status(400).json({ message: "No hay servicios asignados." });
      if (!nombre_plan) return res.status(400).json({ message: "Asigna un nombre a tu Plan." });
  
      const insertPlanSQL = "INSERT INTO planes (nombre_plan, user_id, año, meses, servicios) VALUES (?, ?, ?, ?, ?)";
      const result = await query(insertPlanSQL, [
        nombre_plan,
        idUser,
        Año,
        JSON.stringify(Meses),
        JSON.stringify(myServicesPanel),
      ]);
  
      const inInsert = result.insertId;
  
      for (const mes of Meses) {
        for (const servicio of myServicesPanel) {
          const result2 = await query(`SELECT monto, fecha_fin_pago FROM ${my_services} WHERE id_myservices = ?`, [servicio]);
  
          if (result2.length === 0) {
            throw new Error("Servicio no encontrado.");
          }
  
          const { monto, fecha_fin_pago } = result2[0];
  
          const insertPagoSQL = `
            INSERT INTO ${planes_de_pago} (id_plan, user_id, año, mes, monto, my_service, due_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          await query(insertPagoSQL, [inInsert, idUser, Año, mes, monto, servicio, fecha_fin_pago]);
        }
      }
  
      await commit();
      return res.status(200).json({ data: result, message: "Plan de pagos creado exitosamente." });
  
    } catch (error) {
      console.error("❌ Error:", error);
      await rollback();

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "El nombre del plan ya existe, por favor cámbialo." });
      }

      return res.status(500).json({ message: error.message || "Error inesperado al crear el plan." });
    }
});


// Select Planes del usuario
Router.get("/allPlan", async(req, res) => {
  const {idUser} = req.query;

  if(!idUser){ return res.status(400).json({message:"No se encontro al usuario."}) }

  try {
    const consulta = `SELECT * FROM ${planes} WHERE user_id = ?`;
    const result = await query(consulta, [idUser]);
    return res.status(200).json({data: result})
  } catch (error) {
    console.error("Error en la consulta: " , error);
    return res.status(500).json({message:"Error al obtener los planes de pago."})
    
  }
})



module.exports = Router