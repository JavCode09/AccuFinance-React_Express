import React, { useEffect, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';


//consulta para categorias
import { AddCategorySelectorModal } from '../../../api/services';
//Api para actualizar datos
import { update_newService } from '../../../api/services';

const ModalNewService_update = ({showModal_Update,closeModal_update,category,getDataUpdate}) => {

    // 1: creamos el estado del formulario
    const [NewServiceUpdate,setNewServiceUpdate] = useState({
        id: '',
        nombre: '',
        id_categoria: '',
        nombre_categoria: '',
        descripcion: '',
    })
 
    const [categories, setCategories] = useState([]); // Estado para las categorías


    //2: Creamos el hook 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AddCategorySelectorModal();
                setCategories(response);

                if (category) {
                    setNewServiceUpdate({
                        id: category.id,
                        nombre: category.nombre,
                        id_categoria: category.categoria || response[0]?.id || "", // Usa la primera categoría si no hay valor
                        nombre_categoria: category.nombre_categoria || response[0]?.nombre || "",
                        descripcion: category.descripcion || "",
                    });
                }
            } catch (error) {
                console.error("Error al cargar los datos o categorías:", error);
            }
        };

        if (showModal_Update) {
            fetchData();
        }
    }, [showModal_Update, category]); // Se ejecuta cada vez que el modal se abre
    
    
    
    //3 creamos el onchage para el manejo de cambioso en los inputs
    const handlechange = (e) => {
        const { name, value } = e.target;
        
        if (name === "id_categoria") {
            // Obtener el nombre de la categoría seleccionada
            const selectedCategory = categories.find(cat => cat.id === value);
            setNewServiceUpdate({
                ...NewServiceUpdate,
                id_categoria: value,
                nombre_categoria: selectedCategory ? selectedCategory.nombre : ""
            });
        } else {
            setNewServiceUpdate({
                ...NewServiceUpdate,
                [name]: value
            });
        }
    };


    //LLamada a la API para actualizar
    const API_updateNewService = async(e) => {
        e.preventDefault();

        if (!NewServiceUpdate.id_categoria) {
            console.error("Error: id_categoria está vacío");
            return;
        }

        //Llamada a la api
        try {
            const API_newServicesUpdate = await update_newService(NewServiceUpdate);
            const update_newServiceStatus = API_newServicesUpdate.message;
            console.log("Resultado: " + update_newServiceStatus);
            
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
                            id='id'
                            name='id' 
                            value={NewServiceUpdate.id}
                            onChange={handlechange}
                            />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="servicio" className='form-label label'>Servicio</label>
                        <input type="text" 
                                className='form-control input'
                                id='nombre'
                                name='nombre'
                                value={NewServiceUpdate.nombre}
                                onChange={handlechange}
                                />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="categoria" className="form-label label">Categoria</label>
                        <select
                            className="form-control input"
                            id="id_categoria"
                            name="id_categoria"
                            value={NewServiceUpdate.id_categoria} 
                            onChange={handlechange}
                        >
                            {/* Opción por defecto */}
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.nombre}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="mb-3">
                        <label htmlFor="descripcion" className='form-label label'>Descripcion</label>
                        <input type="text"
                                className='form-control input'
                                id='descripcion'
                                name='descripcion'
                                value={NewServiceUpdate.descripcion || ''}
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