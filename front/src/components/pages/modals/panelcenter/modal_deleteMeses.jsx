import React, { useEffect, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';


//API
import { ApiDeleteMesPanel } from '../../../api/newSystemCpanle';

const ModalDeleteMeses = ({showModalDelete, clseModalDelete, category, getDataDelete}) => {

 
    //Objeto de esta 
    const [dataEliminar,setDataEliminar] = useState({
        id_plan:'',
        idUsuario:'',
        mes:''
    })

    useEffect(() => {
        if (showModalDelete) {
            setDataEliminar({
                id_plan:category.id_plan || '',
                idUsuario:category.idUsuario || '',
                mes:category.mes || '',
            })
        }
    },[showModalDelete,category])

    //Fucion para petion http
    const ApiDeleteMes = async(e) => {
        e.preventDefault();

        try {
            const resultApiDeletePanelMeses = await ApiDeleteMesPanel(dataEliminar);
            console.log(resultApiDeletePanelMeses);
            
            if (resultApiDeletePanelMeses && resultApiDeletePanelMeses.message) {
                    alert(resultApiDeletePanelMeses.message);

                    // console.log(resultApiDeletePanelMeses);
                    
                    // Retornamos como prop los dos datos que pide la funcion para actualizar meses (renderizar)
                    getDataDelete(
                        resultApiDeletePanelMeses.meses,  // meses
                        resultApiDeletePanelMeses.id_plan // id_plan
                    )

                    //Limpiamos campos
                    setDataEliminar({
                        id_plan:'',
                        idUsuario:'',
                        mes:''
                    })

                    //Cerramos modal
                    clseModalDelete();
            }
        } catch (error) {
            if (error.response && error.response.status === 500 && error.response.data) {
                alert(`⚠️ ${error.response.data.message}`);
            } else {
                alert("❌ Error: No se pudo actualizar el servicio. Intenta de nuevo.");
            }
        }
        console.log("Entro a la funcion");
        
    }

    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminacion de Mes</Modal.Title>
            </Modal.Header>
            <form onSubmit={ApiDeleteMes}>
                <Modal.Body>
                    <p>Esta acción eliminará de forma <strong>permanente</strong> el mes y todos sus servicios relacionados.</p>
                        <p><strong>Datos:</strong></p>
                        <p>
                            <strong>Mes a eliminar: </strong>{category.nombreMes} <br />
                            <strong>Del plan: </strong>{category.NombrePlan} <strong>con Id: </strong> {category.id_plan}
                        </p>
                        <p>
                            ¿Estás segur@ de eliminar el mes?
                        </p>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={clseModalDelete}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Eliminar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default ModalDeleteMeses;