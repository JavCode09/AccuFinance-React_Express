import React, { useState } from 'react';
import { Button } from 'react-bootstrap';


const Button_delete = ({Modal_categories_delete}) => {

    //Nuevo estado para abrir y cerrar modales
    const [ModalDelete, setModalDelete] = useState(false);

    //Funciones para abrir y cerrar modales 
    const showModalDelete = () => {
        setModalDelete(true);
    }

    const closeModal_Delete = () => {
        setModalDelete(false);
    }

    return ( 
        <>
            <div className="btn_delete">
                <Button className='btn_delete btn btn-danger' onClick={showModalDelete}>Eliminar</Button>
            </div>
            {Modal_categories_delete && (
            <Modal_categories_delete  showModalDelete={ModalDelete} clseModalDelete={closeModal_Delete}  />
            )}
        </>
     );
}
 
export default Button_delete;