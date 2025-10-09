import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { APIvalidarServicos } from '../../../api/newSystemCpanle';

const ModalValidationService = ({ showModal, closeModal, category }) => {

    const currentDate = new Date().toISOString().split('T')[0];
    const service_status = 'Paid';

    //Hook de estado
    const [data1,setdata1] = useState({
        id_payment : '',
        id_plan: '',
        service_status: '',
        currentDateAuto: '',
        nombre: '',
    })

    useEffect(()=>{
        if (category) {
            setdata1({
                id_payment: category.id_payment || '',
                id_plan: category.id_plan || '',
                service_status: service_status || '', //Este si viene de category pero no se ocupa por que es pendiente y ponemos aprovado
                currentDateAuto: currentDate || '',
                nombre: category.nombre || '',
            })
        }
    },[showModal])

    const APIvalidarServicio = async(e) => {
        e.preventDefault();

        // console.log("Info de api: " , data1);
        try {
            const APIvalidarRes = await APIvalidarServicos(data1);
            if (APIvalidarRes && APIvalidarRes.message) {
                alert(`✅ Status: Éxito\n📝 Mensaje: ${APIvalidarRes.message}`);

                //cerrar modal
                closeModal();
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                alert(`⚠️ Error: ${error.response.data.message}`); // Mensaje exacto del backend
            } else {
                alert("❌ Error: No se pudo actualizar el servicio. Intenta de nuevo.");
            }
        }
    }

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Aprobar Pago</Modal.Title>
            </Modal.Header>
            <form onSubmit={APIvalidarServicio}>
                <Modal.Body>
                    <p>Estás a punto de aprobar este pago. Al hacerlo, el estado del servicio cambiará de <strong>pendiente</strong> a <strong>pagado</strong>.</p>

                    <p><strong>Detalles del pago:</strong></p>
                    <p>
                        <strong>Servicio:</strong> {category.nombre}<br/>
                        <strong>Monto:</strong> ${category.monto}<br/>
                    </p>
                        <hr />
                            <strong>Descripción del servicio:</strong> <br />{category.descripcion}<br />
                        <hr />

                    <p>    
                        <strong>Fecha de pago:</strong> {currentDate}
                    </p>

                    <p>Confirma esta acción presionando <strong>"Aprobar"</strong>.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancelar
                    </Button>
                    <Button variant="success" type="submit">
                        Aprobar
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default ModalValidationService;
