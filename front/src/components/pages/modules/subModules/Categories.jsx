import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

//css
import '../../../styles/views/Categories.css';

//components
import SearchBar from '../../../common/search_engines/search_bar'; //buscador
import ButtonAdd from '../../../common/buttons/btn-add'; //bootn add
import ButtonUpdate from '../../../common/buttons/btn-update'; //boton update
import ButtonDelete from '../../../common/buttons/btn-delete';//boton eliminar

// Modales
import ModalCategoriesAdd from '../../modals/categories/modal_add'; //modal add
import ModalCategoriesUpdate from '../../modals/categories/modal_update'; //modal_update
import ModalCategoriesDelete from '../../modals/categories/modal_delete'; //modal delete

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
    const itemsPerPage = 8; // Elementos por página

    useEffect(() => {
        reloadCategories();
    }, []);

    // 🔄 Función para recargar categorías
    const reloadCategories = async () => {
        try {
            const getDataCategories = await selectCategories();
            setDataCategories(getDataCategories);
            setFilteredData(getDataCategories);
            setCurrentPage(0); // Reiniciar la paginación
        } catch (error) {
            console.error("Error al recargar categorías:", error);
        }
    };

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
            console.error("Error al buscar categorías:", error);
            setFilteredData([]);
        }
    };

    //-------------------- Paginacion --------------------
    
    // const dataToDisplay = filteredData.length > 0 ? filteredData : DataCategories;
    const dataToDisplay = filteredData;
    const offset = currentPage * itemsPerPage;

    // const currentData = useMemo(() => {
    //     return dataToDisplay.slice(offset, offset + itemsPerPage);
    // }, [dataToDisplay, currentPage, itemsPerPage, offset]); 

    const currentData = useMemo(() => {

        return dataToDisplay.slice(
            offset,
            offset + itemsPerPage
        );

    }, [dataToDisplay, offset]);
    
 
     // Manejador de cambio de página
     const handlePageClick = ({ selected }) => {
         setCurrentPage(selected);
     };

    //-------------------- Fin Paginacion --------------------

    const getData = async () => {
        await reloadCategories();
    };

    // 🔄 Actualizar categoría
    const getDataUpdate = async () => {
        await reloadCategories();
    };
    
    // 🔄 Eliminar categoría
    const getDataDelete = async () => {
       await reloadCategories();
    };
        
    return (

        <div className="Categorias-container">

            {/* =====================================================
                HEADER DE LA SECCIÓN
            ====================================================== */}

            <div className="Categorias-header">

                <div className="Categorias-header-title">

                    <div className="Categorias-icon">

                        <i className="fa fa-folder-open"></i>

                    </div>

                    <div>

                        <h3>
                            {titleModule}
                        </h3>

                        <span>
                            Clasificación de servicios y operaciones
                        </span>

                    </div>

                </div>


                {/* Contador */}

                <div className="Categorias-count">

                    <strong>
                        {filteredData.length}
                    </strong>

                    <span>
                        {filteredData.length === 1
                            ? ' categoría'
                            : ' categorías'
                        }
                    </span>

                </div>

            </div>


            {/* =====================================================
                BARRA DE HERRAMIENTAS
            ====================================================== */}

            <div className="Categorias-toolbar">

                <div className="Categorias-search">

                    <div className="Categorias-search-icon">

                        <i className="fa fa-search"></i>

                    </div>

                    <SearchBar
                        plaholderName="Categorías"
                        onSearch={handleSearch}
                    />

                </div>


                <div className="Categorias-btns">

                    <ButtonAdd
                        ModalComponent={ModalCategoriesAdd}
                        getData={getData}
                        value={
                            <>
                                <i className="fa fa-plus"></i>
                                <span>Agregar categoría</span>
                            </>
                        }
                    />

                </div>

            </div>


            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <div className="Categorias-content">

                {currentData.length > 0 ? (

                    <div className="Categorias-table-wrapper">

                        <table className="Categorias-tabla">

                            <thead>

                                <tr>

                                    <th className="categoria-id">
                                        ID
                                    </th>

                                    <th>
                                        Nombre
                                    </th>

                                    <th>
                                        Descripción
                                    </th>

                                    <th className="categoria-actions">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentData.map((dataCate) => (

                                    <tr key={dataCate.id}>

                                        <td className="categoria-id-cell">

                                            <span className="categoria-id-badge">
                                                {dataCate.id}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="categoria-name">

                                                <div className="categoria-name-icon">

                                                    <i className="fa fa-folder"></i>

                                                </div>

                                                <strong>
                                                    {dataCate.nombre}
                                                </strong>

                                            </div>

                                        </td>


                                        <td>

                                            <span className="categoria-description">

                                                {dataCate.descripcion ||
                                                    'Sin descripción'
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            <div className="btns_option_categories">

                                                <ButtonUpdate
                                                    size="sm"
                                                    ModalCategoriesUpdate={
                                                        ModalCategoriesUpdate
                                                    }
                                                    category={dataCate}
                                                    getDataUpdate={
                                                        getDataUpdate
                                                    }
                                                    value={
                                                        <>
                                                            <i className="fa fa-pencil"></i>
                                                            <span>Editar</span>
                                                        </>
                                                    }
                                                />


                                                <ButtonDelete
                                                    size="sm"
                                                    ModalCategoriesDelete={
                                                        ModalCategoriesDelete
                                                    }
                                                    category={dataCate}
                                                    getDataDelete={
                                                        getDataDelete
                                                    }
                                                    value={
                                                        <>
                                                            <i className="fa fa-trash"></i>
                                                            <span>Eliminar</span>
                                                        </>
                                                    }
                                                />

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    /* =================================================
                    ESTADO VACÍO
                    ================================================== */

                    <div className="Categorias-empty">

                        <div className="Categorias-empty-icon">

                            <i className="fa fa-folder-open"></i>

                        </div>

                        <h4>
                            No se encontraron categorías
                        </h4>

                        <p>
                            {filteredData.length === 0 &&
                            DataCategories.length > 0
                                ? 'Intenta realizar otra búsqueda.'
                                : 'Agrega una categoría para comenzar.'
                            }
                        </p>

                    </div>

                )}


                {/* =================================================
                    PAGINACIÓN
                ================================================== */}

                {filteredData.length > itemsPerPage && (

                    <div className="Categorias-pagination">

                        <ReactPaginate

                            previousLabel="Anterior"

                            nextLabel="Siguiente"

                            breakLabel="..."

                            pageCount={
                                Math.ceil(
                                    filteredData.length /
                                    itemsPerPage
                                )
                            }

                            marginPagesDisplayed={2}

                            pageRangeDisplayed={3}

                            onPageChange={handlePageClick}

                            containerClassName="pagination"

                            activeClassName="active"

                            previousClassName="page-item"

                            nextClassName="page-item"

                            pageClassName="page-item"

                            pageLinkClassName="page-link"

                            previousLinkClassName="page-link"

                            nextLinkClassName="page-link"

                            disabledClassName="disabled"

                        />

                    </div>

                )}

            </div>

        </div>

    );
}
 
export default Categories;