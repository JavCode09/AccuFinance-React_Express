import React from 'react';
import { Modal,Button, ModalBody } from 'react-bootstrap';

const AddNewPlan = ({showModal, closeModal}) => {
    return ( 
        <Modal show={showModal} onHide={closeModal}   dialogClassName="custom-modal" centered>
            <Modal.Header>
                <Modal.Title>Nuevo sistema de pagos.</Modal.Title>
            </Modal.Header>
            <form action="">
                <Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                    <Button>Cancelar</Button>
                    <Button>Crear</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default AddNewPlan;