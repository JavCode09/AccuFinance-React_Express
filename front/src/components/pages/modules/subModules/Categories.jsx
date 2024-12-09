import React, { useEffect, useState } from 'react';

//css
import '../../../styles/views/Categories.css';

//components
import Search_bar from '../../../common/search_engines/search_bar'; //buscador
import Button_add from '../../../common/buttons/btn-add'; //bootn add
import Button_update from '../../../common/buttons/btn-update'; //boton update
import Button_delete from '../../../common/buttons/btn-delete';//boton eliminar

// Modales
import Modal_Categories_add from '../../modals/categories/modal_add'; //modal add
import Modal_Categories_update from '../../modals/categories/modal_update'; //modal_update
import Modal_categories_delete from '../../modals/categories/modal_delete'; //modal delete

// API
import { selectCategories } from '../../../api/categories';


const Categories = ({titleModule}) => {

    //Creamos hook de estado para poder obtener los datos de la BD para select
    const [DataCategories,setDataCategories] = useState([]);

    useEffect(() => {
        //llamamos la api para la consulta SELECT al servidor
        const effectCategories = async() => {
            try {
                const getDataCategories = await selectCategories();
                setDataCategories(getDataCategories);
                console.log("Success");
                
            } catch (error) {
                console.log(error);
            }
        };
        effectCategories();
    }, []);

    //Renderizamos con la nueva informacion select
    const getDataCategories = (nuevaInfo) => {
        setDataCategories([...DataCategories, nuevaInfo]);
        // setDataCategories((DataCategories) => [...DataCategories, nuevaInfo]);
    }

    //Renderizamos la actualizacion update
    const getDataCategoriesUpdate = (updatedCategory) => { //Funcion con informacion actualizada
        setDataCategories((prevCategories) => //llammamos el estado de cambio y le asignamos un renombre de callback para el estado previo del mismo
            prevCategories.map((category) => //usamos map par aiterar todos los estados previos
                category.id === updatedCategory.id ? updatedCategory : category //igualamos con el id de estado previo y el actual y colocamos la nueva informacion
            )
        );
    };
    
    // Eliminar categoría del estado
    const getDataCategoriesDelete = (deleteIDcategory) => {
        setDataCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== deleteIDcategory.id)
        );
    };

    return ( 
        <div className="Categorias-container">
            <div className="Categorias-title">
                <h2>{titleModule}</h2>
            </div>
           <div className="Categorias-option">

                <div className="Categorias-search">
                  <Search_bar /> 
                </div>
                <div className="Categorias-btns">
                    {/* componente */}
                    <Button_add ModalComponent = {Modal_Categories_add}
                                getDataCategories={getDataCategories} />
                </div>
           
           </div>
           <div className="Categorias-content">
                <table className='Categorias-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataCategories.map((dataCate) => (
                            <tr key={dataCate.id}>
                                <td>{dataCate.id}</td>
                                <td>{dataCate.nombre}</td>
                                <td>{dataCate.descripcion}</td>
                                <td>
                                    <div className="btns_option_categories">
                                        <Button_update
                                            Modal_Categories_update = {Modal_Categories_update}
                                            category={dataCate}
                                            getDataCategoriesUpdate={getDataCategoriesUpdate}
                                            />

                                        <Button_delete 
                                            Modal_categories_delete={Modal_categories_delete} 
                                            category={dataCate}
                                            getDataCategoriesDelete={getDataCategoriesDelete} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
        </div>
     );
}
 
export default Categories;