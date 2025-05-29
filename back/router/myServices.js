const express = require("express");
const Router = express.Router();
const connection = require("../conexion");
const tabla = "my_services";

const {query, beginTransaction, commit, rollback } = require("../conexion");

Router.get('/all', async (req, res) => {
    try {
        const sql = `
            SELECT
                my_services.*,
                services.nombre
            FROM ${tabla}
            INNER JOIN services ON ${tabla}.id_services = services.id
        `;
        const result = await query(sql);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error al mostrar los datos de la tabla ${tabla}:`, error);
        res.status(500).json({ message: `Error al mostrar los datos de la tabla ${tabla}` });
    }
});

Router.get("/AllServices", async (req, res) => {
    try {
        const sql = "SELECT id, nombre FROM services";
        const result = await query(sql);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error al mostrar los datos de la tabla services:`, error);
        res.status(500).json({ message: "Error al mostrar los datos de la tabla services" });
    }
});


Router.post("/AddMyService", async (req, res) => {
    const { Servicio, Id_user, Descripcion, Monto, Dia_pago, Fecha_fin } = req.body;

    // Validación de campos
    if (!Servicio) return res.status(400).json({ message: "El campo 'Servicio' está vacío" });
    if (!Id_user) return res.status(400).json({ message: "El campo 'Id_user' está vacío" });
    if (!Descripcion) return res.status(400).json({ message: "El campo 'Descripcion' está vacío" });
    if (!Monto) return res.status(400).json({ message: "El campo 'Monto' está vacío" });
    if (!Dia_pago) return res.status(400).json({ message: "El campo 'Dia_pago' está vacío" });
    if (!Fecha_fin) return res.status(400).json({ message: "El campo 'Fecha_fin' está vacío" });

    const tabla = "my_services"; // Asegúrate de definir correctamente el nombre de la tabla

    try {
        // Iniciar transacción
        await beginTransaction();

        // Ejecutar la consulta
        const sql = `INSERT INTO ${tabla} (id_services, id_user, descripcion, monto, dia_pago, fecha_fin_pago) VALUES (?, ?, ?, ?, ?, ?)`;
        await query(sql, [Servicio, Id_user, Descripcion, Monto, Dia_pago, Fecha_fin]);

        // Confirmar la transacción
        await commit();
        return res.status(200).json({ message: "¡Éxito! Nuevo servicio agregado" });
    } catch (error) {
        // Revertir la transacción en caso de error
        await rollback();
        console.error("Error al guardar el servicio:", error);
        return res.status(500).json({ message: "Ocurrió un error al tratar de guardar el servicio." });
    }
});

//Select , Mostrar la informacion en el modal acrtualizar
Router.get("/GetMyService", async (req, res) => {
    const { id_Myservice } = req.query;

    if (!id_Myservice) {
        return res.status(400).json({ message: "El id del servicio no se encontró." });
    }

    try {
        const sql = `
            SELECT ${tabla}.*, services.nombre
            FROM ${tabla}
            INNER JOIN services ON ${tabla}.id_services = services.id
            WHERE ${tabla}.id_myservices = ?
        `;
        const result = await query(sql, [id_Myservice]);
        res.status(200).json({ data: result });
    } catch (error) {
        console.error(`Error al ejecutar la consulta en la tabla ${tabla}:`, error);
        res.status(500).json({ message: "Error al obtener el servicio." });
    }
});

//Update
Router.put("/updateMyServices", async (req, res) => {
    const { id_myservices, idServicio, id_user, descripcion, monto, diaPago, general_status, fecha_fin_pago } = req.body;

    // Validaciones
    if (!id_myservices) return res.status(400).json({ message: "No se encontró el registro." });
    if (!idServicio) return res.status(400).json({ message: "Selecciona un Servicio." });
    if (!id_user) return res.status(400).json({ message: "No se encontró al usuario relacionado." });
    if (!monto || isNaN(parseFloat(monto))) return res.status(400).json({ message: "El campo monto está vacío o no es un número." });
    if (!diaPago || isNaN(Number(diaPago)) || !Number.isInteger(Number(diaPago))) return res.status(400).json({ message: "El campo Día de Pago está vacío o no es un número." });
    if (!general_status || general_status == 0) return res.status(400).json({ message: "El campo Status está vacío." });
    if (!fecha_fin_pago) return res.status(400).json({ message: "El campo fecha fin de pago está vacío." });

    try {
        const sql = `
            UPDATE ${tabla}
            SET id_services = ?, descripcion = ?, monto = ?, dia_pago = ?, general_status = ?, fecha_fin_pago = ?
            WHERE id_myservices = ? AND id_user = ?
        `;

        const result = await query(sql, [idServicio, descripcion, monto, diaPago, general_status, fecha_fin_pago, id_myservices, id_user]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el registro." });
        }

        return res.status(200).json({ message: "¡Servicio actualizado con éxito!" });
    } catch (error) {
        console.error(`Error al actualizar en la tabla ${tabla}:`, error);
        return res.status(500).json({ message: "Error al ejecutar la actualización." });
    }
});

//Delete
Router.delete("/deleteMyService", async (req, res) => {
    const { idDelete } = req.body;

    if (!idDelete) {
        return res.status(400).json({ message: "No se encontró el identificador del servicio." });
    }

    try {
        const sql = "DELETE FROM my_services WHERE id_myservices = ?";
        const result = await query(sql, [idDelete]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el servicio para eliminar." });
        }

        return res.status(200).json({ message: "¡Servicio eliminado!" });
    } catch (error) {
        console.error("Error al eliminar servicio:", error);
        return res.status(500).json({ message: "Error al ejecutar la eliminación." });
    }
});



module.exports = Router;