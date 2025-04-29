import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const UpdateModalPlanes = ({showModal_Update, closeModal_update}) => {
    return ( 
       <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header>
                <Modal.Title>Actualiza tu Plan de pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Contenido del modal</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={closeModal_update}>Cancelar</Button>
                <Button variant='primary'>Actualizar</Button>
            </Modal.Footer>
       </Modal>
     );
}
 
export default UpdateModalPlanes;