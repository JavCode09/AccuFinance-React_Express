import React, { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';

const ModalDeletePlanAnual = ({showModalDelete,clseModalDelete, category}) => {

    //hook de estado
    const [data, setData] = useState()
    

    return ( 
       <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Plan de pagos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Esta acción eliminará por completo el plan de pagos, incluyendo todos los meses y servicios asociados.</p>

                <p><strong>Datos del plan de pagos que se eliminará:</strong></p>
                <p>
                <strong>ID:</strong> {category.id_plan}<br/>
                <strong>Nombre:</strong> {category.nombre_plan}
                </p>

                <p>Si estás seguro de eliminar este plan, presiona <strong>"Aceptar"</strong>.</p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={clseModalDelete}>Cancelar</Button>
                <Button variant='primary' type='submit'>Aceptar</Button>
            </Modal.Footer>
       </Modal>
     );
}
 
export default ModalDeletePlanAnual;