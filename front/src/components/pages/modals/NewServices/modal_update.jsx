import React, { useEffect, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';


//consulta para categorias
import { AddCategorySelectorModal } from '../../../api/services';
//Api para actualizar datos
import { update_newService } from '../../../api/services';

const ModalNewService_update = ({showModal_Update,closeModal_update,category,getDataUpdate}) => {

    // 1: creamos el estado del formulario
    const [NewServiceUpdate,setNewServiceUpdate] = useState({
        newService_id: '',
        newService_categoriaid: '',
        newService_categoria: '',
        newService_servico: '',
        newService_descripcion: '',

    })

    //estadio para regresar a su estado actual (Si el modal se cancela regrese a los datos actuales)
    const [initialState, setInitialState] = useState({});
    
     //estado para select
     const [categoriesDataUpdate,setCategoriesDataUpdate] = useState([]);

    //2: Creamos el hook 
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (category) {
                    // Actualizar el estado del formulario con los datos de la categoría seleccionada
                    const dataFormUpdate = {
                        newService_id: category.id,
                        newService_categoriaid: category.categoria,
                        newService_categoria: category.nombre_categoria,
                        newService_servico: category.nombre,
                        newService_descripcion: category.descripcion,
                    }

                    setNewServiceUpdate(dataFormUpdate)
                    setInitialState(dataFormUpdate); // Guarda el estado inicial

                    // Ejecutar la consulta para obtener datos del selector
                    const APIselect_categoriesNewServer = await AddCategorySelectorModal();
                    setCategoriesDataUpdate(APIselect_categoriesNewServer);
                }
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        fetchData();
    },[category])

    // Restablecer estado al abrir el modal
    useEffect(() => {
        if (showModal_Update) {
            setNewServiceUpdate(initialState); // Restablece el formulario al estado inicial
        }
    }, [showModal_Update, initialState]);

    
    //3 creamos el onchage para el manejo de cambioso en los inputs
    const handlechange = (e) => {
        const {id,value} = e.target;
        setNewServiceUpdate({
            ...NewServiceUpdate, [id]:value
        })
    }


    //LLamada a la API para actualizar
    const API_updateNewService = async(e) => {
        e.preventDefault();

        console.log("Entro a la APi ");

        //Llamada a la api
        try {
            const API_newServicesUpdate = await update_newService(NewServiceUpdate);
            const update_newServiceStatus = API_newServicesUpdate.message;
            // console.log("Resultado: " + update_newServiceStatus);
            
            getDataUpdate(update_newServiceStatus);

            closeModal_update();
        } catch (error) {
            console.log(error);
        }
        
    }


    return ( 
        <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Servicio</Modal.Title>
            </Modal.Header>
            <form className='form_NewServices' onSubmit={API_updateNewService}>
                <Modal.Body>
                    <div className="mb-3">
                        <input type="hidden" 
                            className='form-control input'
                            id='newService_id'
                            name='newService_id' 
                            value={NewServiceUpdate.newService_id}
                            onChange={handlechange}
                            />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="servicio" className='form-label label'>Servicio</label>
                        <input type="text" 
                                className='form-control input'
                                id='newService_servico'
                                name='newService_servico'
                                value={NewServiceUpdate.newService_servico}
                                onChange={handlechange}
                                />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="categoria" className='form-label label'>Categoria</label>
                        <select 
                            className='form-control input' 
                            id='newService_categoriaid'
                            name='newService_categoriaid' // Este 'name' coincide con la clave del estado
                            value={NewServiceUpdate.newService_categoriaid} // Está vinculado al estado
                            onChange={handlechange} // Llama a la función para actualizar el estado
                        >
                            {categoriesDataUpdate.map((dataupdatecate) => (
                                <option 
                                    key={dataupdatecate.id} 
                                    value={dataupdatecate.id} // Cambia el estado con este ID
                                >
                                    {dataupdatecate.nombre}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className='form-label label'>Descripcion</label>
                        <input type="text"
                                className='form-control input'
                                id='newService_descripcion'
                                name='newService_descripcion'
                                value={NewServiceUpdate.newService_descripcion || ''}
                                onChange={handlechange}
                                />
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
 
export default ModalNewService_update;