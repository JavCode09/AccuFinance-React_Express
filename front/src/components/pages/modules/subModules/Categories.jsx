import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

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

//search
import { search_barModule } from '../../../api/search_bar';

const Categories = ({titleModule}) => {

    //Creamos hook de estado para poder obtener los datos de la BD para select
    const [DataCategories,setDataCategories] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Estado para datos filtrados (buscador)
    //Paginacion
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const itemsPerPage = 10; // Elementos por página

    useEffect(() => {
        //llamamos la api para la consulta SELECT al servidor
        const effectCategories = async() => {
            try {
                const getDataCategories = await selectCategories();
                setDataCategories(getDataCategories);
                // setFilteredData(getDataCategories); // Inicializa el estado filtrado (buscador)
                // console.log("Success");
                
            } catch (error) {
                console.log(error);
            }
        };
        effectCategories();
    }, []);

    // Manejar búsqueda llamada a la api (deaceurdo a la consulta llam al aapi select todo o lo filtrado por buscador)
    const handleSearch = async(query) => {
        // console.log(query);
        
        try {
            if (query.trim() === "") {
                setFilteredData(DataCategories); // Si no hay query, mostrar todo
            } else {
                const routeName = 'categories'; // Ruta para Router.
                const response = await search_barModule({searchQuery: query}, routeName);
                setFilteredData(response);
            }
            setCurrentPage(0); // Asegúrate de resetear la página a la primera cuando se realice una búsqueda
        } catch (error) {
            console.log(error);
            console.error("Error al buscar categorías:", error);
            setFilteredData([]);
        }
        setCurrentPage(0);
    };

    //-------------------- Paginacion --------------------
    
    const dataToDisplay = filteredData.length > 0 ? filteredData : DataCategories;
    const offset = currentPage * itemsPerPage;

     const currentData = useMemo(() => {
        return dataToDisplay.slice(offset, offset + itemsPerPage);
    }, [dataToDisplay, currentPage, itemsPerPage]);
 
     // Manejador de cambio de página
     const handlePageClick = ({ selected }) => {
         setCurrentPage(selected);
     };

    //-------------------- Fin Paginacion --------------------

    //Renderizamos con la nueva informacion select
    const getData = (nuevaInfo) => {
        // setDataCategories([...DataCategories, nuevaInfo]);
        setDataCategories((prevCategories) => [...prevCategories, nuevaInfo]);
    }

    //Renderizamos la actualizacion update
    const getDataUpdate = (updatedCategory) => { //Funcion con informacion actualizada
        setDataCategories((prevCategories) => //llammamos el estado de cambio y le asignamos un renombre de callback para el estado previo del mismo
            prevCategories.map((category) => //usamos map par aiterar todos los estados previos
                category.id === updatedCategory.id ? updatedCategory : category //igualamos con el id de estado previo y el actual y colocamos la nueva informacion
            )
        );
    };
    
    
    // Eliminar categoría del estado
    const getDataDelete = (deleteIDcategory) => {
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
                  <Search_bar plaholderName="Categorias" onSearch={handleSearch} /> 
                </div>
                <div className="Categorias-btns">
                    {/* componente */}
                    <Button_add ModalComponent = {Modal_Categories_add}
                                getData={getData} />
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
                        {currentData.map((dataCate) => (
                            <tr key={dataCate.id}>
                                <td>{dataCate.id}</td>
                                <td>{dataCate.nombre}</td>
                                <td>{dataCate.descripcion}</td>
                                <td>
                                    <div className="btns_option_categories">
                                        <Button_update
                                            Modal_Categories_update = {Modal_Categories_update}
                                            category={dataCate}
                                            getDataUpdate={getDataUpdate}
                                            />

                                        <Button_delete 
                                            Modal_categories_delete={Modal_categories_delete} 
                                            category={dataCate}
                                            getDataDelete={getDataDelete} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ReactPaginate
                   previousLabel={"Anterior"}
                   nextLabel={"Siguiente"}
                   breakLabel={"..."}
                   pageCount={Math.ceil(DataCategories.length / itemsPerPage)}
                   marginPagesDisplayed={2}
                   pageRangeDisplayed={3}
                   onPageChange={handlePageClick}
                   containerClassName={"pagination justify-content-center"} // Clase para el contenedor
                   activeClassName={"active"} // Clase para la página activa
                   previousClassName={"page-item previous"} // Clase para el contenedor de "Anterior"
                   nextClassName={"page-item next"} // Clase para el contenedor de "Siguiente"
                   pageClassName={"page-item"} // Clase para los contenedores de páginas numeradas
                   pageLinkClassName={"page-link"} // Clase para los enlaces de las páginas numeradas
                   previousLinkClassName={"page-link"} // Clase para el enlace de "Anterior"
                   nextLinkClassName={"page-link"} // Clase para el enlace de "Siguiente"
                   disabledClassName={"disabled"} // Clase para los botones deshabilitados
                />
           </div>
        </div>
     );
}
 
export default Categories;