import React, { useEffect, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';


//API 
import { DeleteMyServices } from '../../../api/myservices';

const ModalMyServicesDelete = ({showModalDelete,clseModalDelete,category,getDataDelete}) => {

    //estado del id
    const [dataIdDelete, setDataIdDelete] = useState({
        idDelete: '',
        name: '',
    });

    // Hook
    useEffect(() => {

            if (showModalDelete && category) {
                
                setDataIdDelete({
                    idDelete: category.id_myservices || '',
                    name: category.nombre || '',
                })
            }

    },[showModalDelete,category])


    const API_DeleteMyServices= async(e) => {
        e.preventDefault();

        try {
            const API_Delete_MyServices = await DeleteMyServices(dataIdDelete.idDelete);
            console.log(API_Delete_MyServices);
            
            if(API_Delete_MyServices && API_Delete_MyServices.message){
                alert(`${API_Delete_MyServices.message}`);

                getDataDelete();
                clseModalDelete();
            }
            
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                alert(`${error.response.data.message}`)
            }else{
                alert(`${error.response.data.message}`)
            }
        }
    }
 
    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Eliminar Registro
                </Modal.Title>
            </Modal.Header>
                <form className='form_Myservices' onSubmit={API_DeleteMyServices}>
                    <Modal.Body>
                        <p>¿Seguro que deseas eliminar el siguiente servicio?</p>
                        <p><strong>Servicio: {dataIdDelete.name}</strong></p>
                        <p><strong>Servicio: {dataIdDelete.idDelete}</strong></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={clseModalDelete}>Cancelar</Button>
                        <Button variant='primary' type='submit'>Eliminar</Button>
                    </Modal.Footer>
                </form>
            
        </Modal>
     );
}
 
export default ModalMyServicesDelete;