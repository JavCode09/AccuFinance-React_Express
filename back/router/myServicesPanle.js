const express = require('express');
const HttpError = require("../utils/HttpError")
const Router = express.Router();

// Tablas
const my_services = 'my_services';
const planes = 'planes';
const planes_de_pago = 'planes_de_pago';
const plan_monthly_income = 'plan_monthly_income';
const plan_month_status = 'plan_month_status';

// Conexion a bd junto cin transaccion comit y rollback
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
    const { idUser, Año, Meses, myServicesPanel, nombre_plan, ingreso_Mensul } = req.body;
  
    try {
      await beginTransaction();
  
      if (!idUser) return res.status(400).json({ message: "No hay usuario asignado." });
      if (!Año || Año === "0") return res.status(400).json({ message: "No hay Año asignado." });
      if (!Array.isArray(Meses) || Meses.length === 0 || Meses.includes("0"))
        return res.status(400).json({ message: "No hay Meses asignados." });
      if (!Array.isArray(myServicesPanel) || myServicesPanel.length === 0 || myServicesPanel.includes("0"))
        return res.status(400).json({ message: "No hay servicios asignados." });
      if (!ingreso_Mensul) return res.status(400).json({ message: "Coloca un ingeso mensul, este puede ser editado mas adelante." });
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
  
      //Insertamos los meses en la tabla plan_month_income (Tabla de ingresos mensual del plan)
      for(const mes1 of Meses){
        // 🔹 Calcular el último día del mes
        // new Date(año, mes, 0) devuelve el último día del mes anterior al que pongas
        const lastDay = new Date(Año, mes1, 0);
        
        // 🔹 Formatear la fecha como YYYY-MM-DD (para MySQL)
        const due_date = lastDay.toISOString().split('T')[0];

        // console.log(due_date);
        
        // //Insertamos
        const consulta = "INSERT INTO plan_monthly_income (id_plan, monthly_income, month, due_date ) VALUES (?,?,?,?) ";
        const resultpmi = await query(consulta,[inInsert,ingreso_Mensul,mes1,due_date]); 

        if (!resultpmi || resultpmi.affectedRows === 0) {
          throw new Error("Error al insertar meses en la tabla plan_monthly_income.");
        }

      }

      // Insertamos los servicios por mes 
      for (const mes of Meses) {

        for (const servicio of myServicesPanel) {
          const result2 = await query(`SELECT monto, dia_pago FROM ${my_services} WHERE id_myservices = ?`, [servicio]);
  
          if (result2.length === 0) {
            throw new Error("Servicio no encontrado.");
          }
  
          const { monto, dia_pago } = result2[0];
  
          // Construir la fecha completa tipo DATE para MySQL
          // Año y mes vienen de tus variables Año y mes
          // Asegurarse que mes y dia tengan dos dígitos
          const mesStr = String(mes).padStart(2, '0');       // 1 → "01"
          const diaStr = String(dia_pago).padStart(2, '0');  // 5 → "05"
          const fecha_fin_pago = `${Año}-${mesStr}-${diaStr}`;  // Formato YYYY-MM-DD

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

      return res.status(500).json({ message: "Error al crear tu nuevo plan de pago. Si el problema persiste, comunícate con soporte." });
    }
});


// Select Planes del usuario
Router.get("/allPlan", async(req, res) => {
  const {idUser} = req.query;

  if(!idUser){ return res.status(400).json({message:"No se encontro al usuario."}) }

  try {
    const consulta = `SELECT * FROM ${planes} WHERE user_id = ? ORDER BY id_plan DESC`;
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
    const consulta = `SELECT planesp.*,
                      pl.nombre_plan,
                      pl.año,
                      serv.nombre,
                      ms.descripcion,
                      ms.dia_pago
                      FROM ${planes_de_pago} planesp
                      INNER JOIN planes pl ON pl.id_plan = planesp.id_plan
                      INNER JOIN my_services ms ON ms.id_myservices = planesp.my_service
                      INNER JOIN services serv ON serv.id = ms.id_services
                      WHERE planesp.id_plan = ? AND planesp.user_id = ? AND planesp.mes = ? ORDER BY ms.dia_pago ASC`;
    const result = await query(consulta, [idPlan, id_user, mes]);

    if (result.length === 0) {
      throw new Error("No se encontro ningun registro.");
    }

    // Conusltamos la tabla de monto mensual
    const consulta2 = `SELECT id AS id_monthly_income, 
                              monthly_income 
                              FROM ${plan_monthly_income} 
                              WHERE id_plan = ? AND month = ?`;
    const result2 = await query(consulta2,[idPlan, mes]);

    if (result2.length === 0) {
      throw new Error("No se encontro ningun registro 2.");
    }

    return res.status(200).json({data:result, data2:result2})
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
    
    if (!id_plan) {
      throw new Error("El id plan está vacío.");
    }

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
      throw new Error("Plan no encontrado en la consulta.");
    }

    let nuevosMeses= null;

    //Obtenemos el año actual del plan si el año es diferente actualizamos plan y planes de pago relacionados 
    const consultaSpl = `SELECT año FROM ${planes} WHERE id_plan = ?`;
    const resultSpl = await query(consultaSpl,[id_plan]);

    if (!resultSpl || resultSpl.affectedRows === 0) {
      throw new Error("Error al buscar el plan en la tabla planes");
    }

    let añoDB = resultSpl[0].año;

    if (!Array.isArray(DataNewMeses) || DataNewMeses.length === 0) {
      // throw new Error("No hay meses seleccionados.");

      //Si no hay meses actualizamos solo los campos.
      const consultaSM = `UPDATE ${planes} SET nombre_plan = ? , año = ? WHERE id_plan = ?`;
      const resultSM = await query(consultaSM, [nombre_plan,año,id_plan]);

      if (!resultSM || resultSM.affectedRows === 0) {
        throw new Error("Error al actualizar el plan de pagos.");
      }

      //Actualizamos todos los 
      if (añoDB !== año) {
        //Si no hay meses actualizamos solo los campos.
        const consultaUpl = `UPDATE ${planes_de_pago} SET año = ? WHERE id_plan = ?`;
        const resultUpl = await query(consultaUpl, [año,id_plan]);

        if (!resultUpl || resultUpl.affectedRows === 0) {
          throw new Error("Error al actualizar el o los plan de pagos generales campo año.");
        }
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
      const consulta2 = `UPDATE ${planes} SET nombre_plan = ?, año = ?, meses = ? WHERE id_plan = ?`;
      const result2 = await query(consulta2, [nombre_plan, año, mesesFinal, id_plan]);
  
      // Validar que la actualización se haya realizado
      if (!result2 || result2.affectedRows === 0) {
        throw new Error("No se pudo actualizar el plan.");
      }

      //Por cad ames nuevo inserta los servicios
      for(let newMesA of DataNewMeses){

         // new Date(año, mes, 0) devuelve el último día del mes anterior al que pongas
        const lastDay = new Date(año, newMesA, 0);
        
        // 🔹 Formatear la fecha como YYYY-MM-DD (para MySQL)
        const due_date = lastDay.toISOString().split('T')[0];

        // console.log(due_date);

        //Insertamos los meses nuevos en la tabla plan_monthly_income
        const conusltaSelectM= `SELECT COUNT(*) AS cantidad FROM ${plan_monthly_income} WHERE id_plan = ? AND month = ? `; 
        const resultSelectM = await query(conusltaSelectM, [id_plan, newMesA]);

        if (resultSelectM[0].cantidad === 0) {
          //No encontro el mes lo insertamos
          const consultaInsertM = `INSERT INTO ${plan_monthly_income} (id_plan , month, due_date) VALUES (?,?,?)`;
          const resultInsertM = await query(consultaInsertM,[id_plan, newMesA, due_date]);

          if(!resultInsertM || resultInsertM.affectedRows === 0){
            throw new Error("Error al insertar meses nuevos en la tabla planes_monthly_income");
            
          }
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
  
          //Cada nuevo mes insertado se procesa 
          const consulta4 = `INSERT INTO ${planes_de_pago} (id_plan, user_id, año, mes, monto, my_service, due_date) VALUE (?,?,?,?,?,?,?)`;
          const result4 = await query(consulta4,[id_plan, user_id, año, newMesA, ServiciosMonto, servicios, ServiciosFechaF]);
  
          if (!result4 || result4.affectedRows === 0 ) {
            throw new Error("Error al insertar el servicio nuevo a planes de pago.")
          }
  
        }
      }
      
      //Actualizamos todos los servicios el cmapo año si cambio
      if (añoDB !== año) {
        //Si no hay meses actualizamos solo los campos.
        const consultaUpl = `UPDATE ${planes_de_pago} SET año = ? WHERE id_plan = ?`;
        const resultUpl = await query(consultaUpl, [año,id_plan]);

        if (!resultUpl || resultUpl.affectedRows === 0) {
          throw new Error("Error al actualizar el o los plan de pagos generales campo año 2.");
        }
      }
    }

    // Confirmar transacción
    await commit();
    return res.status(200).json({
      message: "Plan actualizado correctamente.",
      meses: nuevosMeses ?? JSON.parse(result[0].meses), // usa los meses actuales si no hubo nuevos
      id_plan: id_plan // 👈 esto es lo que te faltaba
    });

  } catch (error) {
    console.error("Error en /udt:", error.message);
    await rollback();
    return res.status(500).json({ message: "Error al actualizar tu plan de pago. Si el problema persiste, comunícate con soporte." });
  }
});

Router.post("/insertNewS" ,  async(req,res) => {
  const {idplan, idUsuario, mesid, servicios} = req.body;

  try {
    await beginTransaction();

    if(!idplan){ throw new Error("No se encontró el plan. "); }
    if(!idUsuario){ throw new Error("No se encontró al usuario. "); }
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

      // console.log(serviciosActualizados); //imprime el array

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
        // console.log("ID del servicio:", servicio);
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
      // console.log('servicios duplicados:  ' , servicios);

      //Recorremos los servicios a agregar (este es en caso de que ya en la tabla planes existan los serviciois pero no en el mes correspondietne)
      for (let servicio of servicios) {
        // console.log("Servicio: " , servicio);
       
        const consulta5 = `SELECT * FROM ${planes_de_pago} WHERE id_plan = ? AND  user_id = ? AND mes = ? AND my_service = ?`;
        const result5 = await query(consulta5, [idplan ,idUsuario, mesid, servicio])

        if (result5.length === 0) {
          // Obtenemos los datos del nuevo servicio 
          const  consulta6 = `SELECT monto, fecha_fin_pago FROM ${my_services} WHERE id_myservices = ?`;
          const result6 = await query(consulta6, [servicio]);

          if (result6.length === 0) {
            throw new Error("No se encontraron registros.")
          }
          // Obtenemos monto
          const monto = result6[0].monto;
          const fecha_fin_pago = result6[0].fecha_fin_pago;

          //Si no existen insertamos
          const consulta7 = `INSERT INTO ${planes_de_pago} (id_plan, user_id, año, mes, monto, my_service, due_date) VALUES (?,?,?,?,?,?,?)`;
            const result7 = await query(consulta7, [idplan
                                              , idUsuario
                                              , año
                                              , mesid
                                              , monto
                                              , servicio
                                              , fecha_fin_pago])
          if (!result7 || result7.affectedRows === 0) {
            throw new Error("Error en la inserción de los servicios. ") 
          }
        }else{

          throw new Error("Tienes servicios duplicados, Intentalo de nuevo"); 
        }
      }

    }

    await commit(); // ✅ SOLO UNA VEZ

    return res.status(200).json({
      message: "Servicios agregados."
    });

  } catch (error) {
    console.error("Error:", error.message);
    await rollback();
    return res.status(500).json({ message: "Error al agregar el/los servicio. Si el problema persiste, comunícate con soporte." });
  }
})

Router.delete("/deleteplan", async(req, res) => {
  const {id_plan} = req.body;

  
  try {
    await beginTransaction();
    
    //validamos si el id del plan existe
    if(!id_plan){ throw new Error("No se encontro el plan de pagos.");};

    //Consulta para eliminar todo lo relacionado al plan de pagos
    //solo eliminamos de planes ya que planes_de_pago tiene forein key cascade
    // Por lo mismo es que no es necesario eliminar con consulta, se eliminan en cascada automatico
    const consulta1 = `DELETE FROM ${planes} WHERE id_plan = ?`; 
    const resultado1 = await query(consulta1, [id_plan]);

    // throw new Error("Prueba forzada de error.");
    
    if(resultado1.affectedRows === 0){
      throw new Error("No se encontró el plan de pagos para eliminar en la tabla planes.");
    }
    
    await commit();

    // console.log("Se eliminó el plan de pagos exitosamente.");
    return res.status(200).json({message:"Tu plan de pago fue eliminado exitosamente."})
  } catch (error) {
    console.error("Error:" , error.message);
    await rollback();
    return res.status(500).json({message: "Error al eliminar tu plan de pago. Si el problema persiste, comunícate con soporte."})
    
  }
})

// Actualizacion de estado de cada servicio dentro del mes en cuestion
Router.put("/valida", async(req,res)=> {
  const {id_payment, id_plan, service_status, nombre} = req.body;

  try {
    await beginTransaction();

    // ✅ Generar fecha en UTC desde el backend
    const currentDateAuto = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    if(!id_payment){ throw new Error("El dato id_payment esta vacio")}
    if(!service_status){ throw new Error("El dato service_status esta vacio")}
    if(!currentDateAuto){ throw new Error("El dato currentDateAuto esta vacio")}
    if(!nombre){ throw new Error("El dato nombre esta vacio")}

    // Actualizar el plan de pagos
    const consulta = `UPDATE ${planes_de_pago} SET service_status = ?, paid_at = ? WHERE id_payment = ? AND id_plan = ? `;
    const result  = await query(consulta, [service_status, currentDateAuto, id_payment, id_plan]);
      
    if (!result || result.affectedRows === 0) {
        throw new Error("No se pudo actualizar el plan.")
    }

    await  commit();
    
    return res.status(200).json({message:`Tu servicio: ${nombre} esta pagado`})
  } catch (error) {
    console.error("Error:", error.message);
    await rollback();
    return res.status(500).json({ message: "Error al validar el servicio. Si el problema persiste, comunícate con soporte." });
  }
})


//Update de servicios de un mes dentro del plan de pago
Router.put("/updateplan", async(req,res) => {
  const {due_date,id_payment,monto,paid_at,service_status} = req.body;

  //Comensamos transaccion
  try {
    await beginTransaction();

    if(!id_payment){ throw new Error("No se encontro el id_payment");}
    if(!monto){ throw new Error("No se encontro el monto a pagar");}
    // if(!paid_at){ throw new Error("No se encontro el la fecha ");}
    if(!service_status){ throw new Error("No se encontro el estado");}
    if(!due_date){ throw new Error("No se encontro la fecha de vencimiento");}


    // Validar y formatear fechas
    let formattedpaid_at = null;
    if (paid_at && paid_at !== '0000-00-00' && paid_at !== '0000-00-00 00:00:00') {
      formattedpaid_at = paid_at.split('T')[0];
    }

    // Convertir due_date de formato ISO a 'YYYY-MM-DD'
    // const formattedpaid_at = paid_at?.split('T')[0] || paid_at;
    const formattedDueDate = due_date?.split('T')[0] || due_date;

    // console.log({
    //   id_payment:id_payment,
    //   monto:monto,
    //   paid_at:formattedpaid_at,
    //   service_status:service_status,
    //   due_date:formattedDueDate,
    // });
  
    //Actualizamos
    const consulta = `UPDATE ${planes_de_pago} SET monto = ?, service_status = ?, paid_at= ?, due_date = ? WHERE id_payment = ?`;
    const result = await query(consulta, [monto,service_status,formattedpaid_at,formattedDueDate,id_payment]);

    if (!result || result.affectedRows === 0) {
      throw new Error("Error al actualizar el servicos.");
    }
    
    // console.log("Actualizacion");
    await commit();

    return res.status(200).json({message:"Se actualizo el servico."})
    
  } catch (error) {
    
    console.error("Error:", error.message);
    await rollback();
    return res.status(500).json({ message: "Error al actualizar el servicio. Si el problema persiste, comunícate con soporte."});
  }
})

Router.delete("/deleteService", async(req,res) => {
  const {id,id_plan,my_service} = req.body;

  try {
    await beginTransaction();

    if (!id) {
      throw new Error("No se encontró el servicio a eliminar. Inténtalo más tarde.");
    }
    
    if (!id_plan) {
      throw new Error("No se encontró el plan del servicio a eliminar. Inténtalo más tarde.");
    }

    if (!my_service) {
      throw new Error("No se encontró el identificador a eliminar. Inténtalo más tarde.");
    }

    //Consulta de eliminacion 
    const consulta = `DELETE FROM ${planes_de_pago} WHERE id_payment = ?`;
    const result = await query  (consulta,[id]);

    if (!result || result.affectedRows === 0) {
      throw new Error("No se pudo eliminar el servicio, probablemente no existe.");
    }

    //Verificamos tomando tods los servicios del plan y verificando si ya no queda ninguno 

    // Primero verificamos si existen mas servicios iguales en el mismo plan anual
    const consulta2 = `SELECT COUNT(*) AS total1 FROM ${planes_de_pago} WHERE id_plan = ? AND my_service = ?`;
    const result2 = await query(consulta2, [id_plan, my_service]);

    // Validar error o resultado vacío (por seguridad)
    if (!result2 || result2.length === 0) {
      throw new Error("Error al ejecutar la consulta en planes_de_pago.");
    }

    // Validar si no hay coincidencias
    if (result2[0].total1 === 0) {
      // Aquí va tu otra consulta ya que como no entro registros eliminamos de planes el servicio
      const consulta3 = `SELECT servicios FROM ${planes} WHERE id_plan = ? `;
      const result3 = await query(consulta3,[id_plan]);

      if (!result3 || result3.length === 0) {
        throw new Error("Error al ejecutar la consulta planes.");
      }

      if (result3[0].servicios === 0) {
        throw new Error("No se encontro servicios");
      }

      // Obtenemos servicios
      let serviciosA = result3[0].servicios;

      // Si viene como string, lo convertimos a array
      if (typeof serviciosA === 'string') {
        try {
          serviciosA = JSON.parse(serviciosA);
        } catch (e) {
          throw new Error('El campo servicios no contiene un JSON válido.');
        }
      }

      // Verificamos que realmente sea un array
      if (!Array.isArray(serviciosA)) {
        throw new Error('El campo servicios no es un array.');
      }
      
      let my_serviceS = String(my_service);
      
      // 2️⃣ Quitamos el servicio si existe
      const index = serviciosA.indexOf(my_serviceS);
      if (index !== -1) {
        serviciosA.splice(index, 1);
      }
      
      // 3️⃣ Convertimos el array a JSON nuevamente
      const serviciosActualizados = JSON.stringify(serviciosA);
      console.log("Actualiza: " + serviciosActualizados);
      
      // 4️⃣ Actualizamos en la BD
      const consulta4 = `UPDATE ${planes} SET servicios = ? WHERE id_plan = ?`;
      const result4 = await query(consulta4,[serviciosActualizados,id_plan]);

      if (!result4 || result4.affectedRows === 0) {
        throw new Error("Error al ejecutar la consulta para actuaslizar servicios en planes");
      }
    } 

    await commit();

    return res.status(200).json({message:"Servicio Eliminado"})

  } catch (error) {

    console.error("Error:", error.message);
    await rollback();
    return res.status(500).json({ message: "Error al eliminar el servicio. Si el problema persiste, comunícate con soporte."});
  }
})


Router.delete("/deleteMespanel", async(req,res)  => {
  const {id_plan, idUsuario, mes} = req.body;
  
  try {
    await beginTransaction();

    //Validamos informacion
    if(!id_plan){ throw new Error("No se encontro el id_plan"); }
    if(!idUsuario){ throw new Error("No se encontro el idUsuario"); }
    if(!mes){ throw new Error("No se encontro el mes"); }
    
    // Eliminamos todos los servicios del mismo relacionados
    const consulta = `DELETE FROM ${planes_de_pago} WHERE id_plan = ? AND user_id = ? AND mes = ?`;
    const result = await query(consulta,[id_plan, idUsuario, mes]);

    if (!result || result.affectedRows === 0) {
      throw new Error("Error al ejecutar la consulta delete en planes de pago.");
    }

    // Eliminamos el mes realcionado del plan
    const consulta2 = `SELECT meses FROM ${planes} WHERE id_plan = ?`;
    const result2 = await query(consulta2,[id_plan]);

    if(!result2 || result2.length === 0){
      throw new Error("Error al obtener la informacion de meses. No encontro ningun dato");  
    }

    let mesesDB = result2[0].meses;

    if (typeof mesesDB === "string") {
      try {
        mesesDB = JSON.parse(mesesDB); //Parseo de string a arry u objeto
      } catch (error) {
         throw new Error("Error al interpretar los meses desde la base de datos.");
      }
    }
    // console.log("Meses antes de actualizar: " ,mesesDB);
    
    //Buscamos el mes en el array
    const index = mesesDB.indexOf(String(mes)); //Convierte a string si mes es numero

    if (index === -1) {
       throw new Error(`No se encontró el mes ${mes} en el plan.`);
    }

    // Eliminamos el mes del array
    mesesDB.splice(index, 1);
    // console.log("Meses después de actualizar:", mesesDB);

    //Lo pasamos de nuevo de Array a -> texto json 
    let arrayFinal = JSON.stringify(mesesDB);

    //Actualizamos meses en el plan de pagos
    const consulta3 = `UPDATE ${planes} SET meses = ? WHERE id_plan = ?`;
    const result3 = await query(consulta3, [arrayFinal,id_plan]);

    if (!result3 || result3.affectedRows === 0) {
      throw new Error("Error al ejecutar la actualizacion de meses en la tabla planes.");
    }

    //Eliminamos info de mensualidad por mes
    const consulta4 = `DELETE FROM ${plan_monthly_income} WHERE id_plan = ? AND month = ?`;
    const result4 = await query(consulta4, [id_plan, mes]);

    if (!result4 || result4.affectedRows === 0) {
      throw new Error("Error al ejecutar  la eliminacion del registro mensual en la tabla plan_monthly_income.");
    }

    await commit();

    return res.status(200).json({
                            message: "¡Listo! 🗓️ Tu mes y todos sus servicios asociados se han eliminado correctamente.",
                            meses:mesesDB,
                            id_plan: id_plan
                          })
  } catch (error) {
    console.error("Error:", error.message);
    await rollback();
    return res.status(500).json({message: "Error al eliminar el mes de tu plan. Si el problema persiste, comunícate con soporte."})    
  }

})

Router.get("/allStatusMes", async(req,res) => {
  const {idp} = req.query;
  try {

    await beginTransaction();

    if(!idp){throw new Error("No se encontro el id_plan."); }

    //Recorremos los datos para obtener el estado del mes y hacer las actualizaciones posibles de estado
    const consulta1 = `SELECT month, due_date FROM  ${plan_monthly_income} WHERE id_plan = ? `;
    const result1 = await query(consulta1,[idp]);

    if (!result1 || result1.length === 0) {
        throw new Error("No hay meses en este plan.");
    }

    const today = new Date(); // fecha actual
    const currentMonth = today.getMonth() + 1; // Enero = 0 → +1
    const currentYear = today.getFullYear();

    // Formateamos a YYYY-MM-DD si due_date está en DATE
    const todayString = today.toISOString().split('T')[0];

    // Recorremos los meses
    for (let row of result1) {
        const dueDate = new Date(row.due_date);
        const dueMonth = dueDate.getMonth() + 1;
        const dueYear = dueDate.getFullYear();
        
        const mesBD = row.month;

        if (dueYear < currentYear || (dueYear === currentYear && dueMonth < currentMonth)) {

            // Verificamos si es  finalizado o patrasado comrpbando que lso servicios del mes estan pagados si no el estatus es atrazado
            const consulta2 = `
                SELECT COUNT(*) AS total,
                      SUM(CASE WHEN service_status IN ('Paid','Canceled') THEN 1 ELSE 0 END) AS total_valid
                FROM ${planes_de_pago}
                WHERE id_plan = ? AND mes = ?
            `;
            const [result2] = await query(consulta2, [idp, mesBD]);

            if (!result2) { 
                throw new Error("No se encontraron servicios con el id plan y mes relacionados."); 
            }

            // Verificamos si todos los servicios son Paid o Canceled
            const statusGeneral = result2.total === result2.total_valid;
            
            //Si statusGeneral es true es que todos los servicios estan pagados o cancelados loc aul el estaus del mes queda como finalizado
            if (statusGeneral) {
              const consulta3 = `UPDATE ${plan_monthly_income} SET status_mes = ? WHERE id_plan = ? AND month = ?`;
              const result3 = await query(consulta3,[3,idp,mesBD]);

              if (!result3 || result3.affectedRows === 0) {
                throw new Error("Error al actualizar el estatus del mes en tabla plan_monthly_income, consulta 3 de allStatusMes");
              }

            }else{
              //Si statusGeneral es false es que los servicios o algunos estan con estatus vencidos, pendientes etc por lo tanto el mes queda como atrasado
              const consulta4 = `UPDATE ${plan_monthly_income} SET status_mes = ? WHERE id_plan = ? AND month = ?`;
              const result4 = await query(consulta4,[4,idp,mesBD]);

              if (!result4 || result4.affectedRows === 0) {
                throw new Error("Error al actualizar el estatus del mes en tabla plan_monthly_income, consulta 4 de allStatusMes");
              }    
            }

        } else if (dueYear === currentYear && dueMonth === currentMonth) {
          // Due date === fecha actual → hacer otra consulta
          const consulta5 = await query(`UPDATE ${plan_monthly_income} SET status_mes = ? WHERE id_plan = ? AND month = ?`, [2, idp, mesBD]);
          if (!consulta5  || consulta5.affectedRows === 0) {
            throw new Error("Error al ejecutar la actualizacion del mes a En proceso, consulta 5 de allStatusMes");
            
          }
        } else {
          // Due date futura → estado pendiente
          const consulta6 = await query(`UPDATE ${plan_monthly_income} SET status_mes = ? WHERE id_plan = ? AND month = ?`, [1, idp, mesBD]);
          if (!consulta6  || consulta6.affectedRows === 0) {
            throw new Error("Error al ejecutar la actualizacion del mes a PENDIENTE, consulta 6 de allStatusMes");
            
          }
        }
    }



    const consulta = `SELECT 
                        plin.month, 
                        plin.status_mes,
                        plstatus.name
                      FROM ${plan_monthly_income} plin
                      LEFT JOIN ${plan_month_status} plstatus ON plin.status_mes = plstatus.id
                      WHERE plin.id_plan = ?`;

    const result = await query(consulta,[idp]);

    if (!result || result.length === 0) {
        return res.status(200).json({message:"No se encontraron estados para este plan."})
    }
    // throw new Error("Error forzado.");
    // console.log(result);

    //Recorremos los datos para obtener el estado en nombre y agregarlo al array
    await commit();

    return res.status(200).json({ data: result})
  } catch (error) {
    console.error("Error: ", error.message);
    await rollback();
    return res.status(500).json({message: "Error al obtener los estados de los meses. Si el problema persiste, comunícate con soporte."})
  }
})

Router.post("/selectMes", async (req, res) => {
  try {

    const { id_plan, mes } = req.body;

    if (!id_plan) {
      return res.status(400).json({ message: "No se reconoce el id del plan." });
    }

    if (!mes) {
      return res.status(400).json({ message: "No se reconoce el mes." });
    }

    const consulta1 = `
      SELECT monthly_income 
      FROM ${plan_monthly_income} 
      WHERE id_plan = ? AND month = ?
    `;

    const result = await query(consulta1, [id_plan, mes]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No se encontró el monto mensual." });
    }

    return res.status(200).json({
      success: true,
      message: "Datos obtenidos correctamente",
      data: {
        monthly_income: result[0].monthly_income
      }
    });

  } catch (error) {

    console.error("selectMes error:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      data: null
    });

  }
});

Router.put("/updateMes", async(req,res) => {
  const  {id_plan, mes, monto_mensual} = req.body;

  try {
      await beginTransaction();

      if (!id_plan) {throw new HttpError("No se encontro el id del plan." , 400)}
      if (!mes) {throw new HttpError("No se encontro el mes.", 400)}
      if (!monto_mensual) {throw new HttpError("No se encontro el monto_mensual.", 400)}

      //Consulta para actualizar meses
      const consulta1 = `UPDATE ${plan_monthly_income} SET monthly_income = ? WHERE id_plan = ? AND month = ?`;
      const result = await query(consulta1, [monto_mensual,id_plan,mes]);

      if (!result || result.affectedRows === 0) {
        throw new HttpError("Advertencia: no se actualizó ninguna fila. Puede que el valor ya fuera el mismo o que la fila no exista.");
      }

      await commit();

      return res.status(200).json({
        success: true,
        message: "Mes actualizado",
        data: null
      })

  } catch (error) {
    await rollback();

    console.error(error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : "Error interno del servidor",
      data: null
    });
    
  }
});



module.exports = Router