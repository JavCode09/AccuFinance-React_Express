import React, { useEffect, useState } from 'react';

//css
import '../../../styles/views/Categories.css';

//components
import Search_bar from '../../../common/search_engines/search_bar'; //buscador
import Button_add from '../../../common/buttons/btn-add'; //bootn add
import Button_update from '../../../common/buttons/btn-update'; //boton update

// Modales
import Modal_Categories_add from '../../modals/categories/modal_add'; //modal add
import Modal_Categories_update from '../../modals/categories/modal_update'; //modal_update

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

    //Renderizamos con la nueva informacion
    const getDataCategories = (nuevaInfo) => {
        setDataCategories([...DataCategories, nuevaInfo]);
        // setDataCategories((DataCategories) => [...DataCategories, nuevaInfo]);
    }
    

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
                    <Button_add ModalComponent = {Modal_Categories_add} getDataCategories={getDataCategories} />
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
                                    <Button_update
                                        Modal_Categories_update = {Modal_Categories_update}
                                        category={dataCate}
                                        />
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