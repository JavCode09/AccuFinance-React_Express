import React, { useEffect, useState } from 'react';
import {Button,Modal} from 'react-bootstrap';

// API
import { NewServiceDelete } from '../../../api/services';

const Modal_newservice_delete = ({showModalDelete,clseModalDelete,category,getDataDelete}) => {
    // 1) creamosestado para los datos traidos de newService
    const  [deleteNewService,setDeleteNewService] = useState({
        idNewService: '',
        nameNewService:''
    });

    // 2) Creamos hook para el campo del modal
    useEffect(() => {
        if(category){
            setDeleteNewService({
                idNewService: category.id,
                nameNewService: category.nombre
            })
        }
    }, [category])


    const API_NewService_delete = async(e) => {
        e.preventDefault();
        // console.log("Entro a la funcion");

        try {
            const API_NewServiceDelete = await NewServiceDelete({id: deleteNewService.idNewService})
            const deleteCategory = API_NewServiceDelete.message;
            console.log(deleteCategory);
            
            getDataDelete(deleteCategory);

        } catch (error) {
            console.log(error);
            
        }
        
    }
    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Eliminar Servicio
                </Modal.Title>
            </Modal.Header>
            <form className='form_NewServices' onSubmit={API_NewService_delete}>
                <Modal.Body>
                <p><strong>ID:</strong> {deleteNewService.idNewService}</p>
                <p>¿Seguro que deseas eliminar la categoria: <strong>{deleteNewService.nameNewService}</strong>?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={clseModalDelete}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Aceptar</Button>
                </Modal.Footer>
            </form>
        </Modal>

     );
}
 
export default Modal_newservice_delete;