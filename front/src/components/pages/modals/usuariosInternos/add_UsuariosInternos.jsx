import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

//Jquery y select2 para selectores
import $, { initSelect2, destroySelect2 } from '../../../../utils/jqueryYselect2';


// apis
import { getRoles } from '../../../api/usuariosInternos';



const AddUsuariosInternos = ({showModal, closeModal}) => {

    const [data, setData] = useState({
        nombre:"",
        apellido_paterno:"",
        apellido_materno:"",
        email :"",
        rol:"",
        password:"",
        passwordVe:""
    });

    // Hook de estado para roles
    const [dataRoles, setDataRoles] = useState([])

    useEffect(()=>{

        if (showModal) {
            queryRoles();
        }
    },[showModal]);


    const queryRoles = async() => {
        try {
            const getqueryRoles = await getRoles();
            console.log(getqueryRoles);
            if (getqueryRoles.success) {
                setDataRoles(getqueryRoles.data);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                 alert(error.response.data.message);
            }else if(error.response?.status === 500){
                alert(error.response.data.message);
            }else{
                alert(error.response.data.message);
            }
        }
    }

    // cambio 
    const handleChange = (dataForm) => {
        const {name, value} = dataForm.target;
        
        setData({
            ...data,
            [name]:value
        });
    }



    const queryAddUI = (e) => {
        e.preventDefault();

    }

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Usuario Interno</Modal.Title>
            </Modal.Header>
            <form onSubmit={queryAddUI}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="nombre" className='form-label label'>Nombre</label>
                        <input type="text" className='form-control input' placeholder="Nombres" 
                            id='nombre'
                            name='nombre'
                            value={data.nombre || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="col me-3">
                            <label htmlFor="apellido_paterno" className='form-label label'>Apellido Paterno</label>
                            <input type="text" className='form-control input' placeholder="Primer apellido"
                                id='apellido_paterno'
                                name='apellido_paterno'
                                value={data.apellido_paterno || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col me-3">
                            <label htmlFor="apellido_materno" className='form-label label'>Apellido Materno</label>
                            <input type="text" className='form-control input' placeholder="Segundo apellido" 
                                id='apellido_materno'
                                name='apellido_materno'
                                value={data.apellido_materno || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className='form-label label'>Email</label>
                        <input type="email" className='form-control input' placeholder="Correo electronico" 
                            id='email'
                            name='email'
                            value={data.email || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                            <label htmlFor="rol" className='form-label label'>Rol</label>
                            <select className='form-select mb-3' 
                                    name="rol" 
                                    id="rol"
                                    value={data.rol || ''}
                                    onChange={handleChange}
                            >
                                <option value="">Selecciona un rol</option>
                                {   dataRoles.map((rol) => (
                                        <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                    ))
                                }
                            </select>
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="col me-3">
                            <label htmlFor="password" className='form-label label'>Password</label>
                            <input type="password" className='form-control input' placeholder="******" 
                                id='password'
                                name='password'
                                value={data.password || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col me-3">
                            <label htmlFor="passwordVe" className='form-label label'>Verificar Password</label>
                            <input type="password" className='form-control input' placeholder="******" 
                                id='passwordVe'
                                name='passwordVe'
                                value={data.passwordVe || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                    <Button variant="primary" type="submit">Agregar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default AddUsuariosInternos;