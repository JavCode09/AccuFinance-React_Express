import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

// Api servidor
import { deleteCategories } from '../../../api/categories';

const Modal_categories_delete = ({showModalDelete,clseModalDelete,category,getDataDelete}) => {
    //1): creamos stado para losd atos traidos de cargoria 
    const [deleteCategoria, setDeleteCategoria] = useState({
        idCategoria: '',
        nameCategoria: ''
    })

    // 2) hook para el campo del modal
    useEffect(() => {
        if (category) {
            setDeleteCategoria({
                idCategoria: category.id,
                nameCategoria: category.nombre
            })
        }
    }, [category])

    
    // api para eliminacion
    const API_categorias_delete = async(e) => {
        e.preventDefault();
        // console.log("Funcion eliminar");
        try {
            const API_categoriesDelete = await deleteCategories({id: deleteCategoria.idCategoria});
            const deleteCategory = API_categoriesDelete.message; // Asegúrate de extraer `message`
            console.log(deleteCategory);

            getDataDelete(deleteCategory)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return ( 
        <Modal show={showModalDelete} onHide={clseModalDelete} centered>
           <Modal.Header closeButton>
                <Modal.Title>
                    Eliminar Categoria
                </Modal.Title>
            </Modal.Header>
            <form className='form_Categoria' onSubmit={API_categorias_delete}>
                <Modal.Body>
                <p><strong>ID:</strong> {deleteCategoria.idCategoria}</p>
                <p>¿Seguro que deseas eliminar la categoria: <strong>{deleteCategoria.nameCategoria}</strong>?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={clseModalDelete}>Cerrar</Button>
                    <Button variant='primary' type='submit'>Eliminar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default Modal_categories_delete;