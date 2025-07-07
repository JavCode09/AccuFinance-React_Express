import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

//Jquery y select2
import $, { initSelect2, destroySelect2 }  from '../../../../utils/jqueryYselect2';

//Informacion sesion
import { UserContext } from '../../../../contexts/UserContext';

//LLamamos la API 
import { API_selectmeses } from '../../../api/newSystemCpanle';
import { API_updatePlanAnual } from '../../../api/newSystemCpanle';

const UpdateModalPlanes = ({showModal_Update, closeModal_update, category, getDataUpdate, updateInfo }) => {

    //Informacion de la sesion 
    const {userData} = useContext(UserContext);

    //Hook de estado para los planes de pago por mes del usuario
    const [mesesPlan, setMesesPlan] = useState({
        id_plan:'',
        nombre_plan:'',
        año:'',
        DataNewMeses:[]
    });

    //Guardamos en una varaible el id del suuairo logeado
    const id_user = userData?.id;

    //Slector de año
    const Refaño = useRef();
    const Resmeses = useRef();

    useEffect(()=> {
        functionAños();
        const executeAPImeses = async () => {

            try {     
                if (showModal_Update  && id_user && category) {
                     //Llamamos los planes de pago
                    const resultMeses = await API_selectmeses(category, id_user);
                    // console.log('resultMeses: ' , resultMeses);
                    
                    const nombre_plan = resultMeses.data[0]?.nombre_plan
                    const año = resultMeses.data[0]?.año;

                    //pasamos al estado de cambio 
                    setMesesPlan({
                        id_plan:category,
                        nombre_plan:nombre_plan,
                        año:año
                    })
                    
                }
            } catch (error) {
                console.error("Error al obtener los meses");
                
            }
        }

        executeAPImeses();

        //Mandamos cada cajita y instrucciones (detalles) como un placeholder
        initSelect2(Refaño, {placeholder:"Selecciona un año"});
        initSelect2(Resmeses, {placeholder:"Selelcciona los meses"})

        //Cambio manual en el estado
        $(Refaño.current).on('change', (e) => {
            const valueRef = $(e.target).val();
            setMesesPlan(prev => ({
                ...prev,
                año:valueRef
            }))
        })

        $(Resmeses.current).on("change", (e) => {
            const valueMeses = $(e.target).val();
            setMesesPlan(prev => ({
                ...prev,
                DataNewMeses:valueMeses
            }))
        })

        //  cerramos modal destruye las referencias a los select entrando al return
        return () => {
            $(Refaño.current).off('change');
            destroySelect2(Refaño);
            destroySelect2(Resmeses);
        };       

    },[showModal_Update])


    // Estado para años y servicios
    const [years, setYears] = useState([]);
    
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


    const handleChange = (e) => {
        const {name, value, options, multiple} = e.target;

        if (multiple) {
            const values = Array.from(options) // Array.from(options) → Convierte la lista de <option>s en un array normal.
                                .filter(option => option.selected) // .filter(option => option.selected) → Se queda solo con los seleccionados.
                                .map(option => option.value) // .map(option => option.value) → Extrae el valor de esos seleccionados.
                                .sort((a, b) => a - b);
            setMesesPlan(prev => ({
                ...prev,
                [name]: values
            }));
        }else{
            setMesesPlan(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }


    const API_FormUpdatePlan = async(e) => {
        e.preventDefault();

        try {
            const resultApiUpdate = await API_updatePlanAnual(mesesPlan);
            console.log(resultApiUpdate);

            if (resultApiUpdate && resultApiUpdate.message) {
                alert(resultApiUpdate.message);
            }

            // Limpia y cierra
            setMesesPlan({
                id_plan: '',
                nombre_plan: '',
                año: '', 
                DataNewMeses: []
            });
            closeModal_update(); // Cerramos modal
            getDataUpdate(); // Renderizamos planes anuales 
            updateInfo(resultApiUpdate.meses , resultApiUpdate.id_plan); //Renderizamos meses del plan anual
        } catch (error) {
            // console.error(error);
            if (error.response && error.response.status === 500) {
                alert(error.response.data.message)
            } else if (error.response && error.response.status === 409) {
                alert(error.response.data.message)
            }else{
                alert("Ocurrio un error inesperado." + error)
            }
        }
        
    }

    return ( 
       <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header>
                <Modal.Title>Actualiza tu Plan de pago</Modal.Title>
            </Modal.Header>
            <form onSubmit={API_FormUpdatePlan}>
                <Modal.Body>
                    <input type="hidden" placeholder='id' id='id_plan' name='id_plan' value={mesesPlan.id_plan} readOnly />
                    <div className="mb-3">
                        <label htmlFor="nombre_plan" className='form-label label'>Nombre del Plan</label>
                        <input type="text" required
                            className='form-control input'
                            placeholder='Ingresa un Nombre para el plan'
                            id='nombre_plan'
                            name='nombre_plan'
                            value={mesesPlan.nombre_plan || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="año" className='form-label label'>Año</label>
                        <select name="año" id="año" className='form-select mb-3' required
                                value={mesesPlan.año || ''}
                                ref={Refaño}
                                onChange={handleChange}
                        >
                            {/* <option value="0">Selecciona un año</option> */}
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                    ))
                                }
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="año" className='form-label label'>Meses</label>
                        <select name="DataNewMeses" id="DataNewMeses" className='form-select mb-3'
                                value={mesesPlan.DataNewMeses || []}
                                ref={Resmeses}
                                multiple
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
                        <span className='nota'>  NOTA: No puedes tener dos meses iguales en el mismo plan, 
                                al actualizar un mes nuevo este se agrega con los servicios ya existentes en el plan anual.
                        </span>
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
 
export default UpdateModalPlanes;