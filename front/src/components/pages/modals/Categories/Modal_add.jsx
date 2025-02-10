import React, { useState } from 'react';
import { Button,Modal } from 'react-bootstrap';

//Api a servidor
import { add_categories } from '../../../api/categories';

const Modal_Categories_add = ({showModal,closeModal, getData}) => {

    //Creamos hook de estado para el formulario
    const [dataCategoria, setDataCategoria] = useState({
        name_Categoria : '',
        descripcion_Categoria : ''
    })

    //handlechange cambio dinamico en los inputs (funcion de cambio)
    const handlechange_categorias = (e) => {
        const {name, value} = e.target; //Extraemos los valores del campo name y value
        setDataCategoria({              //Actualiza el estado dataCategoria, que guarda los datos del formulario.
            ...dataCategoria,           //Copia el contenido actual de dataCategoria para que los valores previos no se pierdan (estado final).
            [name]: value               //Cambia solo el valor del campo que estás editando (identificado por name) y lo actualiza con el texto que escribiste (value).
        })
    }

    //LLamada a la pai y conexion al servidor back
    const API_Categorias_add = async (e) => {
        e.preventDefault();
    
        if (dataCategoria.name_Categoria === '' || dataCategoria.descripcion_Categoria === '') {
            alert('Los campos no están completos.');
            return;
        }
    
        try {
            const API_categoriesAdd = await add_categories(dataCategoria);
            console.log("API_categoriesAdd: ", API_categoriesAdd);
    
             // Suposición: API_categoriesAdd.message contiene los datos correctos
            if (API_categoriesAdd && API_categoriesAdd.message) {
                getData(API_categoriesAdd.message);
            }

    
            // Cerrar el modal después de agregar
            closeModal();
        } catch (error) {
            console.log(error);
        }
    }
    

    return ( 
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva categoria</Modal.Title>
            </Modal.Header>
                <form className='form_Categoria' onSubmit={API_Categorias_add}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="nombre1" className="form-label label">Categoria</label>
                        <input
                            type="text"
                            id="nombre"
                            className="form-control input"
                            placeholder="Nombre del Servicio"
                            name='name_Categoria'
                            value={dataCategoria.name_Categoria || ''} //LLamamaos el campo del hook
                            onChange={handlechange_categorias}
                            />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label label">Descripcion</label>
                        <input
                            type="text"
                            id="descripcion"
                            className="form-control input"
                            placeholder="Descripcion del servicio"
                            name='descripcion_Categoria'
                            value={dataCategoria.descripcion_Categoria || ''} //LLamamaos el campo del hook
                            onChange={handlechange_categorias}
                            />
                    </div>
                
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                    <Button variant='primary' type='submit' >Agregar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default Modal_Categories_add;