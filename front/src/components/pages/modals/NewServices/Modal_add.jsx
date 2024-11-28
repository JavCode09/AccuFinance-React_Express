import React from 'react';
import { Button,Modal } from 'react-bootstrap';

const Modal_newServices = ({showModal,closeModal}) => {
    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Servicio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="">
                    <div className="container_input">
                        <label htmlFor="Nombre">Nombre</label>
                        <input type="text" placeholder='Nombre' />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                <Button variant='primary'>Agregar</Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default Modal_newServices;