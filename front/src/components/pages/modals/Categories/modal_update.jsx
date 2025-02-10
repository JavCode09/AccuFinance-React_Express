import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

// API
import { updateCategories } from '../../../api/categories';

const Modal_Categories_update = ({showModal_Update,closeModal_update,category, getDataUpdate}) => {
    // (1) :Estado para manejar los valores del formulario
    const [CategoriaUpdate,setCategoriaUpdate] = useState({
        idCategoria: '',
        nameCategoria: '',
        descripcionCategoria: '',
    })

    // (2): UseEffect para el campo de contenido del modal (hook)
    useEffect(() => {
        if (category) {
            setCategoriaUpdate({
                idCategoria: category.id,
                nameCategoria:category.nombre,
                descripcionCategoria: category.descripcion
            })
        }
    }, [category]);

    // (3): Mnejos de cambios en el input (handlechange)
    const handlechange = (e) =>{
        const {id,value} = e.target; //tomamos atributoi id y value del formulario
        setCategoriaUpdate({ //Actualiza el estado final
            ...CategoriaUpdate, //hacemos copia de los datos anteriores para no perderlos y no modificarlos
            [id]:value 
            //[] se usan para que se identifique de forma dinamica el atributo id
            // id: es el atributo que sacamos de cada imput
            // value: es el numevo contenido del campo input
            // todo junto funciona para identificar el atributo al cual se le realizo el cambio 
        })
    }

    //  Proceso de actualizacion 
    const AP_categorias_update = async (e) => {
        e.preventDefault();
        console.log("Api categorias");

        if (CategoriaUpdate.nameCategoria === '' || CategoriaUpdate.descripcionCategoria === '') {
            alert("Campos incompletos");
            return
        }

        // Llamada a la 
        try {
            const API_categoriesUpdate = await updateCategories(CategoriaUpdate);
            const updatedCategory = API_categoriesUpdate.message; // Asegúrate de extraer `message`
            // console.log('API_categoriesUpdate' , API_categoriesUpdate); //mensaje dentro de objeto
            // console.log('updatedCategory' , updatedCategory); //Mensaje fuera de objeto
            getDataUpdate(updatedCategory);

            closeModal_update();
        } catch (error) {
            console.log(error);
            
        }
    }

    return ( 
        <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Categoria</Modal.Title>
            </Modal.Header>
            <form className='form_Categoria' onSubmit={AP_categorias_update}>
                <Modal.Body>
                    <div className="mb-3">
                        <input className='form-control input'
                            type="hidden"
                            id='idCategoria'
                            value={CategoriaUpdate.idCategoria}
                            onChange={handlechange}
                            />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nombre" className='form-label label'>Categoria</label>
                        <input className='form-control input'
                            type="text"
                            placeholder='Nombre del servicio'
                            id='nameCategoria'
                            value={CategoriaUpdate.nameCategoria}
                            onChange={handlechange}
                            />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className='form-label label'>Descripcion</label>
                        <input className='form-control input'
                            type="text"
                            placeholder='Descripcion del servicio'
                            id='descripcionCategoria'
                            value={CategoriaUpdate.descripcionCategoria}
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
 
export default Modal_Categories_update;