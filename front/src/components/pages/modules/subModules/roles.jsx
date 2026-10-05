import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

import styles from "../../../styles/views/Roles.module.css"

// BTNS
import SearchBar from '../../../common/search_engines/search_bar';
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonDelete from '../../../common/buttons/btn-delete';
import ButtonAddPage from '../../../common/buttons/btn-add-page';

//Modales
import ModalAdd from '../../modals/Roles/modal_add';
import DeleteRoles from '../../modals/Roles/modal_delete';

//APIfront
import { getDataAll } from '../../../api/roles';

//Search
import { search_barModule } from '../../../api/search_bar';

const Roles = ({titleModule}) => {

    // Hook de estado de cambio de datos de tabla
    const [dataTable, setDataTable] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Estado para datos filtrados (buscador)
    
    // Hoks de paginacion
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const itemsPerPage = 8; // Elementos por página

    useEffect(() => {
        // Informacion 
        getData_all();
    },[])

    const getData_all = async() => {
        // console.log("Entro a la funcion");
        try {
            const resultData = await  getDataAll();
            // console.log(resultData.data);
            if (resultData.success) {
                setDataTable(resultData.data);
                setFilteredData(resultData.data);
                setCurrentPage(0);
            }
            

        } catch (error) {
            // console.error(error);
            if (error.response?.status === 404) {
                alert(error.response.data.message);
            }else{
                alert("Error inesperado");
            }
        }
    }

    // Búsqueda
    const handleSearch = async (query) => {
        try {
           if (query.trim() === "") {
                setFilteredData(dataTable);
    
            } else {
                // Llamamos el router del mpdulo si no existe crealo
                const routeName = 'Roles';
                const response = await search_barModule(
                    { searchQuery: query },
                    routeName
                );
                setFilteredData(response);
            }
                setCurrentPage(0);
        } catch (error) {
            console.error("Error al buscar servicios:", error);
            setFilteredData([]);
    
        }
    };

    //----------------- Paginacion -----------
    const dataToDisplay = filteredData;
    const offset = currentPage * itemsPerPage;
    
    const currentData = useMemo(() => {
        return dataToDisplay.slice(
            offset,
            offset + itemsPerPage
        );
    }, [dataToDisplay, offset]);
        
    // -------------------- Actualizaciones --------------------
    
    // Manejador de cambio de página
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Renderizado
    const getData = async() => {
        await getData_all();
    }
    
    return (

        <div className={styles["Roles-container"]}>

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className={styles["Roles-header"]}>

                <div className={styles["Roles-header-title"]}>

                    <div className={styles["Roles-icon"]}>

                        <i className="fa fa-users"></i>

                    </div>

                    <div>

                        <h3>
                            {titleModule}
                        </h3>

                        <span>
                            Administración de roles y permisos del sistema
                        </span>

                    </div>

                </div>


                {/* Contador */}

                <div className={styles["Roles-count"]}>

                    <strong>
                        {dataTable.length}
                    </strong>

                    <span>

                        {dataTable.length === 1
                            ? ' rol'
                            : ' roles'
                        }

                    </span>

                </div>

            </div>


            {/* =====================================================
                TOOLBAR
            ====================================================== */}

            <div className={styles["Roles-toolbar"]}>

                <div className={styles["Roles-search"]}>
                    
                    <div className={styles["Roles-search-icon"]}>

                        <i className="fa fa-search"></i>

                    </div>

                    <SearchBar
                        plaholderName="Roles "
                        onSearch={handleSearch}
                    />
                </div>


                <div className={styles["Roles-btns"]}>

                    <ButtonAdd

                        ModalComponent={ModalAdd}

                        size="sm"

                        value={
                            <>
                                <i className="fa fa-plus"></i>
                                <span>Nuevo rol</span>
                            </>
                        }

                        title="Agregar Rol"

                        getData={getData}

                    />

                </div>

            </div>


            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <div className={styles["Roles-content"]}>

                {currentData.length > 0 ? (

                    <div className={styles["Roles-table-wrapper"]}>

                        <table className={styles["Roles-tabla"]}>

                            <thead>

                                <tr>

                                    <th className={styles["Roles-id"]}>
                                        ID
                                    </th>

                                    <th>
                                        Rol
                                    </th>

                                    <th className={styles["Roles-actions"]}>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentData.map((dTable) => (

                                    <tr key={dTable.id}>


                                        {/* ID */}

                                        <td className={styles["Roles-id-cell"]}>

                                            <span className={styles["Roles-id-badge"]}>

                                                {dTable.id}

                                            </span>

                                        </td>


                                        {/* ROL */}

                                        <td>

                                            <div className={styles["Roles-name"]}>

                                                <div className={styles["Roles-name-icon"]}>

                                                    <i className="fa fa-user"></i>

                                                </div>

                                                <strong>
                                                    {dTable.nombre}
                                                </strong>

                                            </div>

                                        </td>


                                        {/* ACCIONES */}

                                        <td>

                                            <div className={styles["btns_option_Roles"]}>

                                                <ButtonAddPage

                                                    size="sm"

                                                    title="Actualizar rol"

                                                    value={
                                                        <>
                                                            <i className="fa fa-pencil"></i>
                                                            <span>Editar</span>
                                                        </>
                                                    }

                                                    styleColor="warning"

                                                    page={`/main/rolls/roles_permisos/${dTable.id}`}

                                                />


                                                <ButtonDelete

                                                    ModalCategoriesDelete={DeleteRoles}

                                                    size="sm"

                                                    title="Eliminar Rol"

                                                    value={
                                                        <>
                                                            <i className="fa fa-trash"></i>
                                                            <span>Eliminar</span>
                                                        </>
                                                    }

                                                    category={dTable}

                                                    getData={getData}

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

                    <div className={styles["Roles-empty"]}>

                        <div className={styles["Roles-empty-icon"]}>

                            <i className="fa fa-users"></i>

                        </div>

                        <h4>
                            No se encontraron Roles
                        </h4>

                        <p>
                            {filteredData.length === 0 &&
                            dataTable.length > 0
                                ? 'Intenta realizar otra búsqueda.'
                                : 'Agrega un tipo de permiso para comenzar.'
                            }
                        </p>

                    </div>

                )}

                 {/* =================================================
                    PAGINACIÓN
                ================================================== */}

                {filteredData.length > itemsPerPage && (

                    <div className={styles["Roles-pagination"]}>

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

                            containerClassName={styles["pagination"]}

                            activeClassName={styles["active"]}

                            previousClassName={styles["page-item"]}

                            nextClassName={styles["page-item"]}

                            pageClassName={styles["page-item"]}

                            pageLinkClassName={styles["page-link"]}

                            previousLinkClassName={styles["page-link"]}

                            nextLinkClassName={styles["page-link"]}

                            disabledClassName={styles["disabled"]}

                        />

                    </div>

                )}

            </div>

        </div>
    );
}
 
export default Roles;