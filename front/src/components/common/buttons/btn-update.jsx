import React, { useState } from 'react';
import { Button} from 'react-bootstrap';

// category, getDataUpdate, updateInfo
// category es mas para mandar informacion al hijo
// getDataUpdate se mas para mandar informacion al padre
// updateInfo es mas cuando solo queremos el aviso sin datos para actualizar o renderizar

const ButtonUpdate = ({ModalCategoriesUpdate,category,getDataUpdate, size, styleColor, title, value, updateInfo}) => {

    //hook de estado para abrir y cerrar modales
    const [ModalUpdate, setModalUpdate] = useState(false);

    //Creamos funciones para abrir y cerrar (cambio de estado)
    const showModal_Update = () => {
        setModalUpdate(true);
    }

    const closeModal_Update = () => {
        setModalUpdate(false);
    }

     // 👇 Si styleColor está vacío, null o undefined, usar 'Danger'
    const buttonColor = styleColor && styleColor.trim() !== '' ? styleColor : 'warning';

    return ( 
        <>
           <div className="btn_update">
            <Button className={`btn_update btn btn-${buttonColor}`}  size={size} title={title} onClick={showModal_Update}>{value}</Button>
            </div>
            {/* Aqui va el modal para actualizar */}
            {ModalCategoriesUpdate && (
                <ModalCategoriesUpdate 
                    showModal_Update={ModalUpdate} 
                    closeModal_update={closeModal_Update} 
                    category={category}
                    getDataUpdate ={getDataUpdate}
                    updateInfo={updateInfo}
                />
            )}
        </>
     );
}
 
export default ButtonUpdate;