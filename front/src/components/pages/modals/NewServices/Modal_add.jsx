import React, { useEffect, useState } from 'react';
import { Button,Modal } from 'react-bootstrap';


// API selector de categorias
import { AddCategorySelectorModal } from '../../../api/services';


const Modal_newServices = ({showModal,closeModal}) => {

    //Estado del selector categorias
    const [categoriesData,setCategoriesData] = useState([]);

    //Estado del formulario
    const [dataNewService, setDataNewService] = useState({
        nameNew_servicio: '',
        categorieNewService:''
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


    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Servicio</Modal.Title>
            </Modal.Header>
                <form className='form_NewServices' action="">
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="Servicio" className='form-label label'>Nombre del nuevo servicio</label>
                        <input
                            className='form-control input' 
                            type="text"
                            name='nameNew_servicio'
                            id='nameNew_servicio'
                            value={dataNewService.nameNew_servicio || ''}
                            onChange={handleChange}
                            />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Categories" className='form-label label'>Selecciona una categoria</label>
                        <select name="categorieNewService" 
                                id="categorieNewService" 
                                className='form-control input'
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button variant='primary'>Agregar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default Modal_newServices;