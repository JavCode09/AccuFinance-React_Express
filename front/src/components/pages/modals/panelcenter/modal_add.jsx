import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';

//Jquery y select2
import $, { initSelect2, destroySelect2 }  from '../../../../utils/jqueryYselect2';

//Data del login
import {UserContext} from '../../../../contexts/UserContext';

//Api
import { selectMyServicesPanel, inseertNewSystemPanel } from '../../../api/newSystemCpanle';


const AddNewPlan = ({showModal, closeModal}) => {
    //Data login
    const {userData} = useContext(UserContext)

    // Estado para años y servicios
    const [years, setYears] = useState([]);
    const [servicios, setServicios] = useState([]);

    //Estado de formulario
    const  [panel, setPanel] = useState({
        idUser:'',
        Año:'',
        Meses:[],
        myServicesPanel:[],
        nombre_plan:''
    })

    //Creamos variables (cajitas) para los 3 select
    const selectMesesRef = useRef(null);
    const selectServicesRef = useRef(null);
    const selectAñoRef = useRef(null);

    useEffect(()=> {
        functionAños();
        myServicesPanelApi();

        //Asignamso el id del logeado
        if (userData?.id) {
            setPanel(prev =>({
                ...prev,
                idUser: userData.id
            }))
        }

        //Mandamos cada cajita y instrucciones (detalles) como un placeholder
        initSelect2(selectMesesRef, { placeholder: 'Selecciona meses' });
        initSelect2(selectServicesRef, { placeholder: 'Selecciona servicios' });
        initSelect2(selectAñoRef, { placeholder: 'Selecciona un año' });
    
        // Escuchar manualmente el cambio del año
        $(selectAñoRef.current).on('change', function (e) {
            const selectedValue = $(this).val();
            setPanel(prev => ({
            ...prev,
            Año: selectedValue
            }));
        });

        //Cuando cerramos modal destruye las referencias a los select entrando al return
        return () => {
            $(selectAñoRef.current).off('change');
            destroySelect2(selectAñoRef);
            destroySelect2(selectMesesRef);
            destroySelect2(selectServicesRef);
          };

    }, [showModal,userData?.id])

    
     // Función para bucle de años
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
            // console.log(allServicesAPi);
            
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

    //Funcion de cambio
    const handleChange = (e) => {
        const {name, value, options, multiple} = e.target;

        if (multiple) {
            const values = Array.from(options) // Array.from(options) → Convierte la lista de <option>s en un array normal.
                                .filter(option => option.selected) // .filter(option => option.selected) → Se queda solo con los seleccionados.
                                .map(option => option.value) // .map(option => option.value) → Extrae el valor de esos seleccionados.
                                .sort((a, b) => a - b);
            setPanel(prev => ({
                ...prev,
                [name]: values
            }));
        }else{
            setPanel(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }


    //LLamada a la API
    const API_newSystemPanel = async(e) => {
        e.preventDefault();

        try {
            const responseApi = await inseertNewSystemPanel(panel);
            console.log(responseApi);
            
        } catch (error) {
            console.error("Error en la solicitud: " , error);
            throw error;
            
        }
    }


    return ( 
        <Modal show={showModal} onHide={closeModal}   dialogClassName="custom-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo sistema de pagos.</Modal.Title>
            </Modal.Header>
            <form className='form_NewPanel' onSubmit={API_newSystemPanel}>
                <Modal.Body>
                    <div className="mb-3">
                        <input className='form-control input' 
                                name='idUser'
                                id='idUser'
                                type="text" 
                                value={userData?.id || ''}
                                readOnly />
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="col me-3">
                            <label htmlFor="Año" className='form-label label'>Selecciona un año</label>
                            <select className='form-select mb-3'
                                    name="Año" 
                                    id="Año" 
                                    value={panel.Año || ''}
                                    ref={selectAñoRef}
                                    onChange={handleChange}
                            >
                                <option value="0">Selecciona un año</option>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))

                                }
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="Meses" className='form-label label '>Meses</label>
                            <select  className='form-select mb-3' 
                                    name='Meses'
                                    id='Meses' 
                                    multiple 
                                    ref={selectMesesRef}
                                    onChange={handleChange}
                                   
                            >   
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
                                className='form-select mb-3' 
                                multiple 
                                ref={selectServicesRef}
                                onChange={handleChange}
                        >
                               {servicios.map((servicio) => (
                                    <option key={servicio.id_myservices} value={servicio.id_myservices}>{servicio.nombre} :: {servicio.descripcion}</option>
                               ))

                               }
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nombre_plan" className='form-label label'>Asigna un nombre unico a tu sistema de pagos</label>
                        <input type="text"
                               className='form-control input'
                               id='nombre_plan'
                               name='nombre_plan'
                               value={panel.nombre_plan || ''}
                               onChange={handleChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Crear Plan</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default AddNewPlan;