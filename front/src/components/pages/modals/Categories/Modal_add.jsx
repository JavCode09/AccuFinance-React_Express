import React from 'react';
import { Button,Modal } from 'react-bootstrap';

const Modal_Categories = ({showModal,closeModal}) => {
    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva categoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="nombre1" className="form-label label">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        className="form-control input"
                        placeholder="Nombre del Servicio"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="nombre2" className="form-label label">Descripcion</label>
                    <input
                        type="text"
                        id="descripcion"
                        className="form-control input"
                        placeholder="Descripcion"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                <Button variant='primary'>Agregar</Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default Modal_Categories;