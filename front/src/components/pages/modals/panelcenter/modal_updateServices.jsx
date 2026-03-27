import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

// Jquery y select2
import $, { initSelect2, destroySelect2 } from '../../../../utils/jqueryYselect2';

// API
import { APIupdateServicePlan } from '../../../api/newSystemCpanle';

//Data del login
import { UserContext } from '../../../../contexts/UserContext';

const ModalUpdateServices = ({ showModal_Update, closeModal_update, category, getDataUpdate }) => {

    //Data login
    const {userData} = useContext(UserContext)

    const [EstadosS, setEstadosS] = useState([]);
    const Estados = useRef(null);

    const [DataCategory, setDataCategory] = useState({
        id_payment: "",
        monto: "",
        service_status: '',
        paid_at: "",
        due_date: ""
    });

     // Función para bucle de añosfecha_fin_pago
    const functionEstados = () => {
        const opciones = ["Pending", "Paid", "Overdue"]; // tus estados
        setEstadosS(opciones);
    };

    // ✅ Este useEffect ahora depende SOLO de category (no del modal)
    useEffect(() => {
        functionEstados();
        if (category) {
        setDataCategory({
                id_payment: category.id_payment || "",
                monto: category.monto || "",
                service_status: category.service_status || "",
                paid_at: category.paid_at || "",
                due_date: category.due_date || "",
            });
        }

        // Inicializa Select2 solo si el modal está visible
        if (showModal_Update) {
            initSelect2(Estados, { placeholder: "Selecciona un estado" });

            $(Estados.current).on('change',function (e){
                const valueRef = $(this).val();
                setDataCategory(prev => ({
                ...prev,
                service_status:valueRef
                }));
            });
        }

        // 🧹 Limpieza al desmontar o cerrar modal
        return () => {
        $(Estados.current).off('change');
        destroySelect2(Estados);
        };
    }, [showModal_Update]);

    const fechaDate = (fechaT) => {
        if (!fechaT) return "";
        return fechaT.split("T")[0];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataCategory(prev => ({
        ...prev,
        [name]: value
        }));
    };    

    const API_UbdateService = async (e) => {
        e.preventDefault();

        if (isNaN(DataCategory.monto) || DataCategory.monto === '') {
        alert("El campo 'Monto' debe ser un número");
        return;
        }

        // console.log("🟢 Enviando actualización:", DataCategory);

        try {
        const APIupdate = await APIupdateServicePlan(DataCategory);
        if (APIupdate && APIupdate.message) {
            alert(`✅ Status: Éxito\n📝 Mensaje: ${APIupdate.message}`);

            setDataCategory({
                id_payment: "",
                monto: "",
                service_status: '',
                paid_at: "",
                due_date: ""
            });

            getDataUpdate({
                idplan: category.id_plan , 
                idUsuario: userData.id, 
                mesid: category.mes
            })

            closeModal_update();
        }
        } catch (error) {
            if (error.response && error.response.status === 500 && error.response.data) {
                alert(`⚠️ ${error.response.data.message}`);
            } else {
                alert("❌ Error: No se pudo actualizar el servicio. Intenta de nuevo.");
            }
        }
    };

    return (
        <Modal show={showModal_Update} onHide={closeModal_update}>
        <Modal.Header closeButton>
            <Modal.Title>Actualiza tu servicio</Modal.Title>
        </Modal.Header>
        <form onSubmit={API_UbdateService}>
            <Modal.Body>
            <input type="hidden" name="id_payment" value={DataCategory.id_payment} />

            <div className="mb-3">
                <label htmlFor="monto" className='form-label label'>Monto a pagar</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    id='monto'
                    name='monto'
                    value={DataCategory.monto}
                    className='form-control input'
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="service_status" className='form-label label'>Estado</label>
                <select
                    name="service_status"
                    id="service_status"
                    required
                    className='form-select mb-3'
                    value={DataCategory.service_status}
                    ref={Estados}
                    onChange={handleChange}
                >
                    {EstadosS.map((estado, index) => (
                        <option key={index} value={estado}>{estado}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="paid_at" className='form-label label'>Fecha de pago</label>
                <input
                    type="date"
                    id='paid_at'
                    name='paid_at'
                    value={fechaDate(DataCategory.paid_at)}
                    className='form-control input'
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="due_date" className='form-label label'>Fecha de vencimiento</label>
                <input
                    type="date"
                    id='due_date'
                    name='due_date'
                    value={fechaDate(DataCategory.due_date)}
                    className='form-control input'
                    onChange={handleChange}
                />
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant='secondary' onClick={closeModal_update}>Cancelar</Button>
            <Button variant='primary' type='submit'>Actualizar</Button>
            </Modal.Footer>
        </form>
        </Modal>
    );
};

export default ModalUpdateServices;
