import React, { useState } from 'react';
import {Button} from 'react-bootstrap';

// getDataCategories es el dato que regresa el modal (nueva informacion)
const Button_add = ({ModalComponent, getDataCategories}) => {
    //creamos hook de estado
    const [ModalAdd,setModalAdd] = useState(false);

    // Creamos dos funciones una para abrir y otro para cerrar modal
    const showModal = () =>{
        setModalAdd(true);
    }

    const closeModal = () => {
        setModalAdd(false);
    }

    return ( 
       <>
            <div className="btn_add">
                <Button className='btn_add btn btn-primary' onClick={showModal}>Agregar</Button>
            </div>
            {/* Aqui va el modal para agregar */}
            {ModalComponent && (
                <ModalComponent showModal={ModalAdd} closeModal={closeModal} getDataCategories={getDataCategories}/>
            )}
       </>
     );
}
 
export default Button_add;