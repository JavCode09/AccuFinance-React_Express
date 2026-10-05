import React, { useEffect, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';


// APIs
import { getPermisosUpdate } from '../../../api/permisos';
import { updatePermiso } from '../../../api/permisos';

const UpdatePermisos = ({showModal_Update,closeModal_update,category,updateInfo}) => {
    
    //hook de estado
    const [data,setData] =useState({
        id:'',
        nombre:''
    })

    useEffect(()=> {
        // console.log(category);
        
         if (showModal_Update && category) {
            // optenemos la data
            infoUpdatePermiso(category);

        }

    },[showModal_Update,category])

    //fucion para obtener la informacion de el permiso a actualizar
    const infoUpdatePermiso = async(permiso_id) => {
        // console.log(permiso_id);
        try {
            const response = await getPermisosUpdate(permiso_id);
            console.log(response);
            
            setData({
                id:response.data.id,
                nombre:response.data.nombre
            });


        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert(error.response?.data.message);
            }else if (error.response?.status === 500) {
                alert(error.response?.data.message);
            }else{
                alert(error.response.data.message)
            }
            
            
        }
        
    }

    const handleChange = (e) =>{
        const {name,value} = e.target;

        setData({
            ...data,
            [name]:value,
        })
    }

    // Peticion para actualizar permiso
    const requestUpdatePermiso = async(e) => {
        e.preventDefault();

        if (!data.id) {
            alert("No se encontro el permiso.");
        }

        if (!data.nombre) {
            alert("Introduce un nombre");
        }

        try {
            const response = await updatePermiso(data.id, data.nombre);

            // Comunicamos al padre la actualizacion exitosa para solo renderizar el registro
            updateInfo(response.data);
            alert(response.message);
            closeModal_update();

        } catch (error) {
            console.error(error);
            
            if (error.response?.status === 400) {
                alert(error.response.data.message);
            }else if(error.response?.status === 500){
                alert(error.response?.data.message);
            }else{
                alert(error.response?.data.message);
            }
        }
    }


    return ( 
        <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Permiso</Modal.Title>
            </Modal.Header>
            <form className='form_Permisos' onSubmit={requestUpdatePermiso}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label label'>Nombre</label>
                        <input 
                            type="text" 
                            className='form-control input'
                            id='nombre'
                            name='nombre'
                            value={data.nombre || ''}
                            onChange={handleChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal_update}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Actualizar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default UpdatePermisos;