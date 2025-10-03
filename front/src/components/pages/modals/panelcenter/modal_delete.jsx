import React, { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';

// APIs
import { DeletePlanDePagos } from '../../../api/newSystemCpanle';
import { useEffect } from 'react';

const ModalDeletePlanAnual = ({showModalDelete,clseModalDelete, category, getDataDelete, getData}) => {

    //hook de estado
    const [data, setData] = useState({
        id_plan: '',
    })
    
    //Hook de efecto
    useEffect(() => {

        if (category?.id_plan) {
            setData(
                {id_plan: category.id_plan}
            );
        }

    }, [showModalDelete, category])


    // Funcion para la llamada a la api
    const API_deletePlaAnual = async(e) => {
        e.preventDefault();

        // console.log("Este es el id plan a eliminar: " + data.id_plan);
        
        //Eliminamos el plan de pagos
        try {
            const deleteAPI = await DeletePlanDePagos(data);
            console.log(deleteAPI);
            
            if (deleteAPI && deleteAPI.message) {
                alert(deleteAPI.message)
            }

            clseModalDelete();
            getDataDelete();
            getData();
        } catch (error) {
            console.error("Error al eliminar el plan de pagos: ", error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message)
            }else{
                alert("❌ Error: No se pudo agregar el servicio. Intenta de nuevo.");
                console.log(error);
            }
        }
        
    }

    return ( 
       <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Plan de pagos</Modal.Title>
            </Modal.Header>
            <form onSubmit={API_deletePlaAnual}>
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
            </form>
       </Modal>
     );
}
 
export default ModalDeletePlanAnual;