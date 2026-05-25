import React, { useState } from 'react';
import { Modal,Button } from 'react-bootstrap';


// Apifront
import { add_rol } from '../../../api/roles';


const ModalAdd = ({showModal, closeModal,getData}) => {
    // Hook de estado
    const [data,setdata] = useState({
        nombre : ''
    })

    // Funcion de cambvio
    const handleChange = (e) => {
        const {name,value} = e.target;
        setdata({
            ...data,
            [name]:value
        })
    }

    // Funcion submit
    const api_submitAdd = async(e) => {
        e.preventDefault();

        
        if (data.nombre.trim() === '') {
            console.log("Campo vacio.");
            return;
        }

        try {
            
            const response1 = await add_rol(data?.nombre);
            console.log(response1);
            
            if (response1.success) {
                alert(response1.message);
            }

            setdata({
                nombre:''
            })
            getData();
            closeModal();

        } catch (error) {
            // console.log(error);
            
            if (error.response && error.response.status === 500) {
                alert(error.response.data.message)
            } else if (error.response && error.response.status === 409) {
                alert(error.response.data.message)
            }else{
                alert("Ocurrio un error inesperado: \n" + error)
            }
        }
        
    }

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Rol</Modal.Title>
            </Modal.Header>
            <form className='form_Roles' onSubmit={api_submitAdd}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="nombre" className='form-label label'>Nombre</label>
                        <input type="text" className='form-control input' 
                            id='nombre'
                            name='nombre'
                            value={data.nombre || ''}
                            placeholder='Nombre del rol '
                            onChange={handleChange}
                        />
                    </div>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button type='submit' variant='primary'>Crear</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default ModalAdd;