import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';

//Jquery y select2
import $, { initSelect2, destroySelect2 }  from '../../../../utils/jqueryYselect2';

//Data del login
import {UserContext} from '../../../../contexts/UserContext';

//api 
import { selectMyServicesPanel, API_insertNewServices } from '../../../api/newSystemCpanle';

const AddModalServiciosMes = ({showModal, closeModal, category}) => {

    //Data login
    const {userData} = useContext(UserContext)
  
    // Estado de serviciosnuevo
    const [serviciosNuevos, setServiciosNuevos] = useState([])

    // Estado para manipular
    const [serviciosN, setServicios] = useState({
        idplan: '',
        idUsuario : '',
        mesid:'',
        servicios: []
    })

    // Creamos variable  (cajita) para  el select
    const selectServicios = useRef(null);

    useEffect(()=>{
        //llamamos a la funcion para obtenr los servicios del usuario
        if (category?.planes && userData?.id && category?.mesNumero) {
            setServicios(prev => ({
                ...prev,
                idplan: category.planes,
                idUsuario: userData.id,
                mesid: category.mesNumero
            }));
            
            // Pedimos la informacin de los servicios
            selectAApiServicios(userData?.id);
        }

        // Mandamos la cajita con si placeholder
        initSelect2(selectServicios, { placeholder: "Selecciona los servicios" });


        // Escuchamos manualmente  el cambio de servicios
        $(selectServicios.current).on('change', function (e) {
            const selectedValue = $(this).val() || [];
            setServicios(prev =>({
                ...prev,
                servicios: Array.isArray(selectedValue) ? selectedValue : [selectedValue]
            }))
        })
        
        //Cuando cerramos modal destruye las referencias a los select entrando al return
        return () => {
            $(selectServicios.current).off('change');
            destroySelect2(selectServicios);
        };
    },[showModal, userData?.id])
    

    const selectAApiServicios = async(id) => {
        // console.log(id);
       
        try {
            const resultado = await selectMyServicesPanel(id);
            // console.log(resultado);
            setServiciosNuevos(resultado.data);
        } catch (error) {
            
        }
    }

    //Funcion de cambio
    const handleChange = (e) =>{
        const {name, value, options, multiple} = e.target;

        if (multiple) {
             const values = Array.from(options) // Array.from(options) → Convierte la lista de <option>s en un array normal.
                                .filter(option => option.selected) // .filter(option => option.selected) → Se queda solo con los seleccionados.
                                .map(option => option.value) // .map(option => option.value) → Extrae el valor de esos seleccionados.
                                .sort((a, b) => a - b);
            setServicios(prev => ({
                ...prev,
                [name]: values
            }));
        }else{
            setServicios(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const API_insertServices = async(e) => {
        e.preventDefault();

        try {
            const response_API = await API_insertNewServices(serviciosN);
            console.log('response_API: ' + response_API);
            
        } catch (error) {
            
        }
        
    }

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                 <Modal.Title>Agregar Servicios</Modal.Title>
            </Modal.Header>
            <form onSubmit={API_insertServices}>
                <Modal.Body>
                    {/* id del plan a editar */}
                    <div className="mb-3">
                        <input type="text"
                                name='idplan'
                                id='idplan'
                                value={category.planes || ''} 
                                readOnly
                        />
                    </div>
                    {/* id usuario */}
                    <div className="mb-3">
                        <input type="text"
                            name='idUsuario'
                            id= 'idUsuario'
                            value={userData?.id} 
                            readOnly
                        />
                    </div>
                    {/* mes */}
                    <div className="mb-3">
                        <input type="text"
                            name='mesid'
                            id= 'mesid'
                            value={category.mesNumero || ''} 
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="servicios">Selecciona Servicios</label>
                        <select className='form-select mb-3'
                            name='servicios'
                            id='servicios'
                            multiple
                            ref={selectServicios}
                            onChange={handleChange}
                        >
                            {/* aqui van los servicios */}
                            {serviciosNuevos.length === 0 ? (
                                    <option disabled value="">No hay servicios disponibles</option>
                                ):(
                                    serviciosNuevos.map((serv) => (
                                        <option key={serv.id_myservices} value={serv.id_myservices}>
                                            {serv.nombre} :: {serv.descripcion}
                                        </option>
                                    )) 
                                )
                            
                            }
        
                            
                        </select>
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
 
export default AddModalServiciosMes;