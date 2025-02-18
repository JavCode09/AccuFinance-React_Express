import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const modalAddMyservices = ({showModal,closeModal}) => {
    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Servicio</Modal.Title>
            </Modal.Header>
            <form className='form_Myservices'>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="Servicio" className='form-label label'>Servicio</label>
                    <select  className='form-control input'
                        name="Servicio" 
                        id="Servicio" >

                    </select>
                </div>
                <div className="mb-3">
                    <input className='form-control input' placeholder='id_user oculto'
                        type="text" 
                        name="Monto" 
                        id="Monto" />
                        
                    <label htmlFor="Descripcion" className='form-label label'>Descripcion</label>
                    <input className='form-control input'
                        name='Descripcion'
                        id='Descripcion'
                        type="text" />
                </div>
                <div className="mb-3">
                    <label htmlFor="Monto" className='form-label label'>$ Monto</label>
                    <input className='form-control input' placeholder='Monto'
                        type="text" 
                        name="Monto" 
                        id="Monto" />
                </div>
                <div className="mb-3">
                    <label htmlFor="FechaPago" className='form-label label'>Fechas de pago</label>
                    <input className='form-control input'
                        name='FechaPago'
                        id='FechaPago'
                        type="date" />
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
 
export default modalAddMyservices;