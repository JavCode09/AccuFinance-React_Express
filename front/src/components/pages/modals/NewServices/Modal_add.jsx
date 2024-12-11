import React from 'react';
import { Button,Modal } from 'react-bootstrap';

const Modal_newServices = ({showModal,closeModal}) => {
    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Servicio</Modal.Title>
            </Modal.Header>
                <form className='form_NewServices' action="">
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="Servicio" className='form-label label'>Servicio</label>
                        <input
                            className='form-control input' 
                            type="text" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button variant='primary'>Agregar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default Modal_newServices;