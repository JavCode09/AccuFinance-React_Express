import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';
import useChoices from '../../../../utils/useChoices';

//Data del login
import {UserContext} from '../../../../contexts/UserContext';


//Api
import { selectMyServicesPanel } from '../../../api/newSystemCpanle';


const AddNewPlan = ({showModal, closeModal}) => {
    //Data login
    const {userData} = useContext(UserContext)

    // Refs para select múltiple
    const selectMesesRef = useRef(null); //Mese
    const selectServiciosRef = useRef(null); //Servicios

    // Estado para años y servicios
    const [years, setYears] = useState([]);
    const [servicios, setServicios] = useState([]);

    // Inicializar Choices.js
    useChoices(selectMesesRef);
    useChoices(selectServiciosRef);

    useEffect(()=> {
        functionAños();
        myServicesPanelApi();
    }, [showModal])

    //Funcoin para bucle de años
    const functionAños = () => {
        const currentYear = new Date().getFullYear();
        const yearsOpcions = [];
        //Bucle de años
        for (let i = 0; i < 5; i++) {
           //Guardamos en el array los años
           yearsOpcions.push(currentYear + i);
        }

        setYears(yearsOpcions)
    }

    //My servicios API
    const myServicesPanelApi = async() => {
        // e.preventDefault();

        try {
            const allServicesAPi = await selectMyServicesPanel(userData?.id)
            console.log(allServicesAPi);
            
            //Agregamos al estado
            setServicios(allServicesAPi.data)
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(error);
                
                alert(`⚠️ Error: ${error.response.data.message}`); // Mostrar el mensaje exacto del backend
            }else{
                alert("❌ Error: No se pudieron obtener los servicios. Intenta de nuevo.");
                console.log(error);
            }
        }
    }

    return ( 
        <Modal show={showModal} onHide={closeModal}   dialogClassName="custom-modal" centered>
            <Modal.Header>
                <Modal.Title>Nuevo sistema de pagos.</Modal.Title>
            </Modal.Header>
            <form className='form_NewPanel'>
                <Modal.Body>
                    <div className="mb-3">
                        <input className='form-control input' type="text" value={userData?.id || '' } />
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="col me-3">
                            <label htmlFor="Año" className='form-label label'>Selecciona un año</label>
                            <select name="Año" id="Año" className='form-control input'>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))

                                }
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="Meses" className='form-label label '>Meses</label>
                            <select name='Meses' 
                                    id='Meses' 
                                    className='form-control input' 
                                    multiple 
                                    ref={selectMesesRef}>
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="myServicesPanel" className='form-label label'>Selecciona los servicios</label>
                        <select name="myServicesPanel" 
                                id="myServicesPanel" 
                                className='form-control input' 
                                multiple 
                                ref={selectServiciosRef} >
                               {servicios.map((servicio) => (
                                    <option key={servicio.id_myservices} value={servicio.id_services}>{servicio.nombre}</option>
                               ))

                               }
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button>Cancelar</Button>
                    <Button>Crear</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default AddNewPlan;