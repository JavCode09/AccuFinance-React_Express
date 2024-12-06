import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Modal_categories_delete = ({showModalDelete,clseModalDelete}) => {
    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete}>
           <Modal.Header closeButton>
                <Modal.Title>
                    Eliminar servicio
                </Modal.Title>
            </Modal.Header>
            <form className='form_Categoria'>
                <Modal.Body>
                    Formulareio de eliminacion
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={clseModalDelete}>Cerrar</Button>
                    <Button variant='primary'>Eliminar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default Modal_categories_delete;