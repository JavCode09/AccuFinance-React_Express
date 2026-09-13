import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

// Falta css (no existe)

// API
import { DeleteRolesp } from '../../../api/roles';

const DeleteRoles = ({showModalDelete,clseModalDelete,category,getData}) => {
    
    // console.log(category);
    
    const [id, setId] = useState({
        id:'',
        nombre:''
    })
    
    useEffect(() => {
        if (category) {
            
            setId({
                id: category.id,
                nombre: category.nombre
            })
        }
    },[category])

    // API eliminación
    const ApiDelete = async(e) => {
        e.preventDefault();

        // Validamos 
        if (!id.id) {
            alert("No se encontro el rol a eliminar");
            return;
        }
        
        // mandamos a api front
        try {
            const response = await DeleteRolesp(id.id);
            // console.log("response: ", response);
            
            // Alerta
            alert(response.message);

            // render
            getData();

        } catch (error) {
            // console.error(error);
            if(error.response?.status === 403){
                alert(error.response.data.message);
            }
        }

    }

    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Rol</Modal.Title>
            </Modal.Header>
            <form action="" onSubmit={ApiDelete}>
                <Modal.Body>
                    <p>
                        Esta acción eliminará sus permisos relacionados. El rol no podrá eliminarse si tiene usuarios asignados.
                    </p>
                    <p>¿Seguro que deseas eliminar el rol de <strong>{id.nombre}</strong>?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secundary' onClick={clseModalDelete}>Cerrar</Button>
                    <Button variant="primary" type='submit'>Eliminar</Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
 
export default DeleteRoles;