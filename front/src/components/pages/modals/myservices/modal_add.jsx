import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';


import { UserContext } from '../../../../contexts/UserContext';

//APIs
import { selectServices } from '../../../api/myservices';
import { AddMyServices } from '../../../api/myservices';

const ModalAddMyservices = ({showModal,closeModal,getData}) => {
    
    const { userData } = useContext(UserContext); // Obtén el usuario aquí

    //Estado para selector campo servicios
    const [selectedServices, setSelectedServices] = useState([]);

    //Estado para los datos del formulario en general
    const [formDataMyservices, setformDataMyservices] = useState({
        Servicio:'',
        Id_user: '',  // Asegurar un valor inicial
        Descripcion:'',
        Monto:'',
        Dia_pago:'',
        Fecha_inicio: ''
    })

    useEffect(() => {
        const fetchMyservices = async() => {
            try {
                if (showModal) {

                    setformDataMyservices({
                        Id_user:userData.id
                    })

                    //Llamamos la informacion para el selector servicios
                    const API_services = await selectServices();
                    // console.log(API_services);
                    
                    setSelectedServices(API_services);
                }
                
            } catch (error) {
                console.error("Error al obtenr los servicios: ", error);
            }
        }
        fetchMyservices();
    }, [showModal,userData.id]);


    //Funcion para cambio input
    const handleChange = (e) => {
       const {name, value} = e.target;
       setformDataMyservices({
        ...formDataMyservices,
        [name]:value
       })
    }

    const API_AddMyServices = async (e) => {
        e.preventDefault();
        
        try {
            const response = await AddMyServices(formDataMyservices);
            
            if (response && response.message && response.message.mensaje) {
                alert(`✅ Status: Éxito\n📝 Mensaje: ${response.message.mensaje}`);

                getData(response.message)
                closeModal();
            }
            
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(error);
                
                alert(`⚠️ Error: ${error.response.data.message}`); // Mostrar el mensaje exacto del backend
            } else {
                alert("❌ Error: No se pudo agregar el servicio. Intenta de nuevo.");
            }
            console.error("Error en API_AddMyServices: ", error);
        }
    };
    

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Servicio</Modal.Title>
            </Modal.Header>
            <form className='form_Myservices' onSubmit={API_AddMyServices}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="Servicio" className='form-label label'>Servicio</label>
                        <select  className='form-control input'
                            name="Servicio" 
                            id="Servicio"
                            value={formDataMyservices.Servicio || ''}  
                            onChange={handleChange}  
                        >

                            <option value="" disabled>
                                Elige un servicio
                            </option>

                            {selectedServices.map((services) => (
                                <option key={services.id} value={services.id}>
                                    {services.nombre}
                                </option>
                            ))

                            }
                        </select>
                    </div>
                    <div className="mb-3">
                        <input className='form-control input' placeholder='id_user oculto'
                            type="text" 
                            name="Id_user" 
                            id="Id_user"
                            value={userData?.id ||'' }
                            readOnly
                        />
                            
                        <label htmlFor="Descripcion" className='form-label label'>Descripcion</label>
                        <input className='form-control input'
                            name='Descripcion'
                            id='Descripcion'
                            type="text" 
                            value={formDataMyservices.Descripcion || ''}
                            onChange={handleChange}  
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Monto" className='form-label label'>$ Monto</label>
                        <input className='form-control input' placeholder='Monto'
                            type="text" 
                            name="Monto" 
                            id="Monto" 
                            min="0"
                            step="0.01"  // Permite decimales, usa "1" si solo quieres enteros
                            value={formDataMyservices.Monto || ''}
                            onChange={handleChange}      
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Dia_pago" className='form-label label'>Dia de Pago</label>
                        <input className='form-control input'
                            name='Dia_pago'
                            id='Dia_pago'
                            type="text"
                            min="1"
                            max="31"  // Permite decimales, usa "1" si solo quieres enteros 
                            value={formDataMyservices.Dia_pago || ''}
                            onChange={handleChange}  
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Fecha_inicio" className='form-label label'>Fecha Inicio</label>
                        <input className='form-control input'
                            name='Fecha_inicio'
                            id='Fecha_inicio'
                            type="date" 
                            value={formDataMyservices.Fecha_inicio || ''}
                            onChange={handleChange}  
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button variant='primary' type="submit">Agregar</Button>

                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default ModalAddMyservices;