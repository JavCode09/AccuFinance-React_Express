import React, { useState } from 'react';
import { Button } from 'react-bootstrap';


const ButtonDelete = ({ModalCategoriesDelete,category, getDataDelete,  size, styleColor, title, value, getData}) => {

    //Nuevo estado para abrir y cerrar modales
    const [ModalDelete, setModalDelete] = useState(false);

    //Funciones para abrir y cerrar modales 
    const showModalDelete = () => {
        setModalDelete(true);
    }

    const closeModal_Delete = () => {
        setModalDelete(false);
    }

    // 👇 Si styleColor está vacío, null o undefined, usar 'Danger'
    const buttonColor = styleColor && styleColor.trim() !== '' ? styleColor : 'danger';

    return ( 
        <>
            <div className="btn_delete">
                <Button className={`btn_add btn btn-${buttonColor}`}  size={size} title={title}  onClick={showModalDelete}>{value}</Button>
            </div>
            {ModalCategoriesDelete && (
            <ModalCategoriesDelete  
                showModalDelete={ModalDelete} 
                clseModalDelete={closeModal_Delete}
                category={category}
                getDataDelete={getDataDelete}
                getData={getData} />
            )}
        </>
     );
}
 
export default ButtonDelete;