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


// Planes de pago por sesion
Router.post("/planesdp", async(req,res) => {
  const  {idPlan ,id_user, mes} = req.body;

  if (!idPlan) { return res.status(400).json({message:"No se encontro el plan."})}
  if (!id_user) { return res.status(400).json({message:"No se encontro al usuario."})}
  if (!mes) { return res.status(400).json({message:"No se encontro el mes."})}

  try {
    const consulta = `SELECT planes.*,
                      serv.nombre
                      FROM ${planes_de_pago} planes
                      INNER JOIN my_services ms ON ms.id_myservices = planes.my_service
                      INNER JOIN services serv ON serv.id = ms.id_services
                      WHERE planes.id_plan = ? AND planes.user_id = ? AND planes.mes = ?`;
    const result = await query(consulta, [idPlan, id_user, mes]);

    return res.status(200).json({data:result})
  } catch (error) {
    console.error("Error en la consulta: ", error);
    return res.status(500).json({message:"Error al obtener los planes de pago por año."})
  }
})


//Slect meses de un plan de pagos anuales
Router.get("/monthSelect", async(req,res) => {
  const {id_plan,id_user} = req.query;

  try {
    if (!id_plan) { return res.status(400).json({message:"No se encontro este plan de pagos."}); }
    if (!id_user) { return res.status(400).json({message:"No se encontro al al usuario"}) }

    //Consulta para los planes de pago por mes
    const consulta = `SELECT nombre_plan, meses, año FROM ${planes} WHERE id_plan = ? AND user_id = ?`;
    const result = await query(consulta,[id_plan, id_user]);

    //Si no encuentra nada
    if (result.length === 0) {
      return res.status(404).json({message:"No se encontro ningun registro."})
    }
    return res.status(200).json({data:result})
  } catch (error) {
    console.error("Error al obtener al obtener los meses del plan de pago.");
    return res.status(500).json({message:"Error al obtener los planes por año"})
    
  }
})

//Update (Plan depagos seccion anual)
Router.put("/udt", async (req, res) => {
  const { id_plan, nombre_plan, año, DataNewMeses } = req.body;

  try {
    await beginTransaction();

    // Validaciones
    if (!nombre_plan) {
      throw new Error("Nombre del plan está vacío.");
    }

    if (!año) {
      throw new Error("El año está vacío.");
    }

    // Verificamos que exista el plan
    const consulta1 = "SELECT * FROM planes WHERE id_plan = ?";
    const result = await query(consulta1, [id_plan]);

    if (result.length === 0) {
      throw new Error("Plan no encontrado.");
    }

    let nuevosMeses= null;

    if (!Array.isArray(DataNewMeses) || DataNewMeses.length === 0) {
      // throw new Error("No hay meses seleccionados.");

      //Si no hay meses actualizamos solo los campos.
      const consultaSM = "UPDATE planes SET nombre_plan = ? , año = ? WHERE id_plan = ?";
      const resultSM = await query(consultaSM, [nombre_plan,año,id_plan]);

      if (!resultSM || resultSM.affectedRows === 0) {
        throw new Error("Error al actualizar el plan de pagos.");
      }
    }else{

      // Parsear meses existentes
      let mesesExistentes = [];
      try {
        mesesExistentes = JSON.parse(result[0].meses); // columna "meses"
        serviciosExistentes = JSON.parse(result[0].servicios); // columna "meses"
        user_id = JSON.parse(result[0].user_id); // columna user_id
      } catch (e) {
        throw new Error("Error al procesar los meses y/o servicios del plan.");
      }
  
      // Verificar duplicados
      const mesesDuplicados = DataNewMeses.map(String).filter(mes => mesesExistentes.includes(mes));
      if (mesesDuplicados.length > 0) {
        await rollback();
        return res.status(409).json({
          message: "Algunos meses ya existen en el plan.",
          duplicados: mesesDuplicados
        });
      }
  
      // Mezclar meses
      nuevosMeses = [...mesesExistentes, ...DataNewMeses.map(String)];
      const mesesFinal = JSON.stringify(nuevosMeses);
  
      // Actualizar el plan
      const consulta2 = "UPDATE planes SET nombre_plan = ?, año = ?, meses = ? WHERE id_plan = ?";
      const result2 = await query(consulta2, [nombre_plan, año, mesesFinal, id_plan]);
  
      // Validar que la actualización se haya realizado
      if (!result2 || result2.affectedRows === 0) {
        throw new Error("No se pudo actualizar el plan.");
      }

      //Insertamos nuevos servicios existentes del plan al nuevo mes
      for(let servicios of serviciosExistentes){

        //consulatamos el monto de cada servicio
        const consulta3 = "SELECT monto, fecha_fin_pago FROM my_services WHERE id_myservices = ? ";
        const result3 = await query(consulta3, [servicios]);
        
        if (result3.length === 0) {
          throw new Error("Error al consultar el servicio.")
        }
        
        ServiciosMonto = JSON.parse(result3[0].monto);
        ServiciosFechaF = result3[0].fecha_fin_pago;

        const consulta4 = "INSERT INTO planes_de_pago (id_plan, user_id, año, mes, monto, my_service, due_date) VALUE (?,?,?,?,?,?,?)";
        const result4 = await query(consulta4,[id_plan,user_id,año,DataNewMeses,ServiciosMonto,servicios, ServiciosFechaF]);

        if (!result4 || result4.affectedRows === 0 ) {
          throw new Error("Error al insertar el servicio nuevo a planes de pago.")
        }

      }
    }


    // Confirmar transacción
    await commit();
    return res.status(200).json({
      message: "Plan actualizado correctamente.",
      meses: nuevosMeses
    });

  } catch (error) {
    console.error("Error en /udt:", error.message);
    await rollback();
    return res.status(500).json({ message: error.message || "Error al actualizar el plan." });
  }
});

Router.post("/insertNewS" ,  async(req,res) => {
  const {idplan, idUsuario, mesid, servicios} = req.body;

  try {
    await beginTransaction();

    if(!idplan){ throw new Error("No se encontró el plan. "); }
    if(!idUsuario){ throw new Error("No se encontró el al usuario. "); }
    if(!mesid){ throw new Error("No se encontró el mes asignado. "); }
    if (!Array.isArray(servicios) || servicios.length === 0 || servicios.includes("0")){
        throw new Error("No hay servicios asignados." );
    }

    // Optenemos los servicios del pan de pagos
    const consulta1 = "SELECT servicios, año FROM planes WHERE id_plan = ? AND user_id =?";
    const result1 = await query(consulta1, [idplan, idUsuario]);

    if (result1.length === 0) {
      throw new Error("No se encontro el plan de pagos.")
    }

    // Intentar convertir el campo "servicios" a una array
    let serviciosArray ; // variable para guardar el array  parseado

    const año = result1[0].año;
    const seviciosRaw = result1[0].servicios; //este es el string de mi bd en string
    serviciosArray = JSON.parse(seviciosRaw); // converetir a array

    // vamos a comparar los aray el obtenido y el mandado por el formulario
    // si existe el servicio en el array no lo agrega si no existe agregalo

    //Unimos ambos arrays sin duplicados
    const nuevosServicios =  servicios.filter(s => !serviciosArray.includes(s));

    //Si hay servicios nuevos que agregar 
    if(nuevosServicios.length > 0){
      // Unimos los servicios antiguos con los nuevos
      const serviciosActualizados = [...serviciosArray, ...nuevosServicios];

      //Convertimos a JOSN  para guardar en la base de datos
      const serviciosJSON = JSON.stringify(serviciosActualizados)

      console.log(serviciosActualizados);

      // Actualizar el plan de pagos
      const consulta2 = "UPDATE planes SET servicios = ? WHERE id_plan = ? ";
      const result2  = await query(consulta2, [serviciosJSON, idplan]);
      
      if (!result2 || result2.affectedRows === 0) {
          throw new Error("No se pudo actualizar el plan.")
      }

      // Actualizamos los planes de pago. necesitamos el mes y servicios dentro de.
      // Recorremos el array de servicios
      // console.log("Servicios nuevos a insertar:");
      // console.log(JSON.stringify(nuevosServicios, null, 2));
      
      for (let servicio of nuevosServicios) {
        console.log("ID del servicio:", servicio);
        // Obtenemos el monto del nuevo servicio 
        const  consulta3 = `SELECT monto, fecha_fin_pago FROM ${my_services} WHERE id_myservices = ?`;
        const result3 = await query(consulta3, [servicio]);

        if (result3.length === 0) {
          throw new Error("No se encontraron registros.")
        }
        // Obtenemos monto
        const monto = result3[0].monto;
        const fecha_fin_pago = result3[0].fecha_fin_pago;
        
        // Insertamos cada servicio nuevo en el mes nuevo
        const consulta4 = `INSERT INTO ${planes_de_pago} (id_plan, user_id, año, mes, monto, my_service, due_date) VALUES (?,?,?,?,?,?,?)`;
        const result4 = await query(consulta4, [idplan
                                              , idUsuario
                                              , año
                                              , mesid
                                              , monto
                                              , servicio
                                              , fecha_fin_pago])
        if (!result4 || result4.affectedRows === 0) {
          throw new Error("Error en la inserción de los servicios. ") 
        }

      }
    }else{
      console.log(servicios);
      
    }

    await commit();

    console.log("Se actualizo el plan de pagos");
    
  } catch (error) {
    console.error("Error:", error.message);
    await rollback();
    return res.status(500).json({ message: error.message || "Error al insertar servicios." });
  }
})


module.exports = Router