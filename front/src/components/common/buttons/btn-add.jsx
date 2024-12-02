import React, { useState } from 'react';
import { Fragment } from 'react';
import {Button} from 'react-bootstrap';


const Button_add = ({ModalComponent}) => {
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
                <Button className='btn_add' onClick={showModal}>Agregar</Button>
            </div>
            {/* Aqui va el modal para agregar */}
            {ModalComponent && (
                <ModalComponent showModal={ModalAdd} closeModal={closeModal}/>
            )}
       </>
     );
}
 
export default Button_add;