import React, { useState } from 'react';
import { Button} from 'react-bootstrap';

const Button_update = ({Modal_Categories_update,category,getDataUpdate}) => {

    //hook de estado para abrir y cerrar modales
    const [ModalUpdate, setModalUpdate] = useState(false);

    //Creamos funciones para abrir y cerrar (cambio de estado)
    const showModal_Update = () => {
        setModalUpdate(true);
    }

    const closeModal_Update = () => {
        setModalUpdate(false);
    }

    return ( 
        <>
           <div className="btn_update">
            <Button className='btn_update btn btn-warning' onClick={showModal_Update}>Actualizar</Button>
            </div>
            {/* Aqui va el modal para actualizar */}
            {Modal_Categories_update && (
                <Modal_Categories_update 
                    showModal_Update={ModalUpdate} 
                    claseModal_update={closeModal_Update} 
                    category={category}
                    getDataUpdate ={getDataUpdate}/>
            )}
        </>
     );
}
 
export default Button_update;