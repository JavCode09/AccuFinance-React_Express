import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';


// apis
import { addUsuarioInterno, getRoles } from '../../../api/usuariosInternos';



const AddUsuariosInternos = ({showModal, closeModal, getData}) => {

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
    const [errorMessage, setErrorMessage] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(()=>{

        if (showModal) {
            queryRoles();
        }
    },[showModal]);


    const queryRoles = async() => {
        try {
            const getqueryRoles = await getRoles();
            if (getqueryRoles.success) {
                setDataRoles(getqueryRoles.data.filter(
                    (rol) => Number(rol.id) !== 1 && Number(rol.id) !== 2
                ));
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
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



    const queryAddUI = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSaving(true);

        try {
            const result = await addUsuarioInterno(data);
            getData(result.data);
            setData({
                nombre: "",
                apellido_paterno: "",
                apellido_materno: "",
                email: "",
                rol: "",
                password: "",
                passwordVe: ""
            });
            closeModal();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        } finally {
            setSaving(false);
        }
    }

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Usuario Interno</Modal.Title>
            </Modal.Header>
            <form onSubmit={queryAddUI}>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <div className="mb-3">
                        <label htmlFor="nombre" className='form-label label'>Nombre</label>
                        <input type="text" className='form-control input' placeholder="Nombres" 
                            id='nombre'
                            name='nombre'
                            value={data.nombre || ''}
                            onChange={handleChange}
                            required
                            maxLength={100}
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
                                required
                                maxLength={100}
                            />
                        </div>
                        <div className="col me-3">
                            <label htmlFor="apellido_materno" className='form-label label'>Apellido Materno</label>
                            <input type="text" className='form-control input' placeholder="Segundo apellido" 
                                id='apellido_materno'
                                name='apellido_materno'
                                value={data.apellido_materno || ''}
                                onChange={handleChange}
                                required
                                maxLength={100}
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
                            required
                            maxLength={100}
                        />
                    </div>
                    <div className="mb-3">
                            <label htmlFor="rol" className='form-label label'>Rol</label>
                            <select className='form-select mb-3' 
                                    name="rol" 
                                    id="rol"
                                    value={data.rol || ''}
                                    onChange={handleChange}
                                    required
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
                                required
                            />
                        </div>

                        <div className="col me-3">
                            <label htmlFor="passwordVe" className='form-label label'>Verificar Password</label>
                            <input type="password" className='form-control input' placeholder="******" 
                                id='passwordVe'
                                name='passwordVe'
                                value={data.passwordVe || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? "Guardando..." : "Agregar"}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default AddUsuariosInternos;