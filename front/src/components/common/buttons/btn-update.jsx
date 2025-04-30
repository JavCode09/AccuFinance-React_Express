import React, { useState } from 'react';
import { Button} from 'react-bootstrap';

const ButtonUpdate = ({ModalCategoriesUpdate,category,getDataUpdate, size, value}) => {

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
            <Button className='btn_update btn btn-warning'  size={size}  onClick={showModal_Update}>{value}</Button>
            </div>
            {/* Aqui va el modal para actualizar */}
            {ModalCategoriesUpdate && (
                <ModalCategoriesUpdate 
                    showModal_Update={ModalUpdate} 
                    closeModal_update={closeModal_Update} 
                    category={category}
                    getDataUpdate ={getDataUpdate}/>
            )}
        </>
     );
}
 
export default ButtonUpdate;