import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';


// Api front
import { createPermiso } from '../../../api/permisos';


const AddPermisos = ({showModal,closeModal,onRefreshOtro}) => {
    // hook de estado
    const [data, setData] = useState({
        nombrePermiso: '',
    })

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData({
            ...data,
            [name]:value,
        })
    }

    const comunicationApi = async(e) => {
        e.preventDefault();

        // console.log("Se comunico: " + data.nombrePermiso);
        if (!data.nombrePermiso || data.nombrePermiso.trim() === "") {
            alert("Introduce un nombre.")
            return;
        }

        try {
            const peticion = await createPermiso(data?.nombrePermiso);
            console.log(peticion);

            if(peticion.succes){
                alert(peticion.message);
            }
            
            setData({
                nombrePermiso: ""
            });

            onRefreshOtro();
            closeModal();

        } catch (error) {
            // console.log(error);
            if (error.response.status === 409) {
                alert(error.response.data.message)
            }else if(error.response.status === 500){
                 alert(error.response.data.message)
            }else{
                alert(error.response.data.message)
            }
        }
        
    }

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Permiso</Modal.Title>
            </Modal.Header>
            <form className='form_Permisos' onSubmit={comunicationApi}>
                <Modal.Body>
                     <div className="mb-3">
                        <label htmlFor="nombrePermiso" className='form-label label'>Nombre del permiso</label>
                        <input type="text" className='form-control input' 
                            placeholder='Nombre del permiso '
                            id='nombrePermiso'
                            name='nombrePermiso'
                            value={data.nombrePermiso || ''}
                            onChange={handleChange}
                            
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Aceptar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default AddPermisos;