import React, { useEffect, useState } from 'react';
import { Button,Modal } from 'react-bootstrap';


// API selector de categorias
import { AddCategorySelectorModal } from '../../../api/services';
//API para add
import { add_newSevice } from '../../../api/services';

const Modal_newServices_add = ({showModal,closeModal,getData}) => {

    //Estado del selector categorias
    const [categoriesData,setCategoriesData] = useState([]);

    //Estado del formulario
    const [dataNewService, setDataNewService] = useState({
        nameNew_servicio: '',
        categorieNewService:'',
        descripcionNewService:'',
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (showModal) {
                    // Reiniciar el estado del formulario
                    setDataNewService({
                        nameNew_servicio: '',
                        categorieNewService: '',
                    });

                    const APIselect_categories = await AddCategorySelectorModal(); // Llamada a la API
                    setCategoriesData(APIselect_categories); // Guardar datos en el estado
                }
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };
        fetchCategories();
    }, [showModal]);


    //Funcion para cambio input
    const handleChange = (e) => {
        const {name, value} = e.target;
        setDataNewService({
            ...dataNewService, 
            [name]: value
        })
    }

    //Api para insertar datos 
    const API_NewService_add = async(e) => {
        e.preventDefault();

        try {
            const API_NewServiceAdd = await add_newSevice(dataNewService);
            // console.log(API_NewServiceAdd);
            
            if (API_NewServiceAdd && API_NewServiceAdd.message) {
                // console.log(API_NewServiceAdd.message);
                //mandamos a la vista de la tabla para renderizar los datos
                getData(API_NewServiceAdd.message)

                closeModal();
            }
            
        } catch (error) {
             // Manejo de errores específicos del backend
            if (error.message.includes("ya existe")) {
                alert('Error de duplicación:' +  error.message);
            } else {
                console.log('Otro error:', error.message);
            }
            
        }
    }

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Servicio</Modal.Title>
            </Modal.Header>
                <form className='form_NewServices' onSubmit={API_NewService_add}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="Servicio" className='form-label label'>Nombre del nuevo servicio</label>
                        <input
                            className='form-control input' 
                            type="text"
                            required
                            name='nameNew_servicio'
                            id='nameNew_servicio'
                            value={dataNewService.nameNew_servicio || ''}
                            onChange={handleChange}
                            />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Categories" className='form-label label'>Selecciona una categoria</label>
                        <select name="categorieNewService" 
                                className='form-control input'
                                required
                                id="categorieNewService" 
                                value={dataNewService.categorieNewService}
                                onChange={handleChange}
                                >
                                <option value="" disabled>
                                Elige una categoría
                                </option>
                                {categoriesData.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className='form-label label'>Descripcion</label>
                        <input
                            className='form-control input' 
                            type="text"
                            name='descripcionNewService'
                            id='descripcionNewService'
                            value={dataNewService.descripcionNewService || ''}
                            onChange={handleChange}
                            />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Agregar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default Modal_newServices_add;