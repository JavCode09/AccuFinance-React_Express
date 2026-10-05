import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

//API
import { deletePermiso } from '../../../api/permisos';

const DeletePermisos = ({showModalDelete,clseModalDelete,category,getDataDelete}) => {

    const [data,setData] = useState({
        id:'',
    })

    useEffect(()=>{
        if (showModalDelete && category) {
            setData({
                id:category.id
            })
        }
    },[showModalDelete,category])
    
    const requestDeletePermiso = async (e) => {
        e.preventDefault();

        if (!data.id) {
            alert("No se encontró el permiso a eliminar");
            return;
        }

        try {
            const response = await deletePermiso(data.id);
            // console.log(response);
            
            alert(response.message);

            if (typeof getDataDelete === 'function') {
                getDataDelete(response.data);
            }

            clseModalDelete();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 400) {
                alert(error.response.data?.message || "No se pudo eliminar el permiso");
            }else if (error.response?.status === 404) {
                alert(error.response.data?.message || "No se pudo eliminar el permiso");
            }else if (error.response?.status === 500) {
                alert(error.response.data?.message || "No se pudo eliminar el permiso");
            }else {
                alert("Error al eliminar el permiso");
            }
        }
    }
    
    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Permiso</Modal.Title>
            </Modal.Header>
            <form className='form_Permisos' onSubmit={requestDeletePermiso}>
                <Modal.Body>
                    <p> ¿Seguro que deceas eliminar el permiso {category?.nombre ?? 'este permiso'} ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={clseModalDelete}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Eliminar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default DeletePermisos;