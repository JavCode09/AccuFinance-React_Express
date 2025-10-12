import React from 'react';
import { Modal,Button } from 'react-bootstrap';

//API 
import { APIdeleteServicePxM } from '../../../api/newSystemCpanle';

const ModalDeleteServicePanel = ({showModalDelete, clseModalDelete, category, getDataDelete}) => {

    // Formato de fechas
    const currentDate = new Date().toISOString().split('T')[0];

    const paid_at = category.paid_at &&
                category.paid_at !== '0000-00-00' &&
                category.paid_at !== '0000-00-00 00:00:00' &&
                category.paid_at.trim() !== ''
    ? new Date(category.paid_at).toLocaleDateString()
    : "Sigue pendiente";


    const APIdeleteServicePanel = async (e) => {
        e.preventDefault();

        // console.log("Entro a la api.");
        try {
            const responseDelete = await APIdeleteServicePxM(category.id_payment);
            if (responseDelete && responseDelete.message) {
                alert(responseDelete.message);

                getDataDelete({
                    idplan: category.id_plan,
                    idUsuario: category.user_id,
                    mesid: category.mes
                })
                
                clseModalDelete();
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data) {
                alert(`⚠️ Error: ${error.response.data.message}`);
            } else {
                alert("❌ Error: No se pudo actualizar el servicio. Intenta de nuevo.");
            }
        }
        
    }

    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Servicio</Modal.Title>
            </Modal.Header>
            <form onSubmit={APIdeleteServicePanel}>
                <Modal.Body>
                    <p>Estás a punto de eliminar este servicio. Al hacerlo, el servicio se borrará de forma <strong>permanente</strong> de su mes asignado.</p>

                    <p><strong>Detalles del pago:</strong></p>
                    <p>
                        <strong>Servicio:</strong> {category.nombre}<br/>
                        <strong>Monto:</strong> ${category.monto}<br/>
                    </p>
                    <hr />
                    <p>
                        <strong>Descripción del servicio:</strong><br />{category.descripcion}<br />
                    </p>
                    <hr />

                    <p>    
                        <strong>Fecha de pago:</strong> {paid_at}<br />
                        <strong>Fecha de eliminación:</strong> {currentDate}
                    </p>

                    <p>Confirma esta acción presionando <strong>"Aprobar"</strong>.</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={clseModalDelete}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Eliminar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default ModalDeleteServicePanel;