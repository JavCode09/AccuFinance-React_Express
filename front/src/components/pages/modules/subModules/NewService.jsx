import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

// css
import '../../../styles/views/NewService.css';

// componentes
import SearchBar from '../../../common/search_engines/search_bar';
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';

// Modals
import Modal_newServices_add from '../../modals/newServices/modal_add';
import ModalNewService_update from '../../modals/newServices/modal_update';
import ModalCategoriesDelete from '../../modals/newServices/modal_delete';

// API
import { select_services } from '../../../api/services';

// search
import { search_barModule } from '../../../api/search_bar';

const NuevoServicio = ({ titleModule }) => {

    // Estado de la información
    const [DataServicios, setDataServicios] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        reloadNewServices();
    }, []);

    // Recargar servicios
    const reloadNewServices = async () => {

        try {

            const getDataServicios = await select_services();

            setDataServicios(getDataServicios);
            setFilteredData(getDataServicios);
            setCurrentPage(0);

        } catch (error) {

            console.error("Error al recargar servicios:", error);

        }

    };

    // Búsqueda
    const handleSearch = async (query) => {

        try {

            if (query.trim() === "") {

                setFilteredData(DataServicios);

            } else {

                const routeName = 'NewService';

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

    // -------------------- Paginación --------------------

    const dataToDisplay = filteredData;

    const offset = currentPage * itemsPerPage;

    const currentData = useMemo(() => {

        return dataToDisplay.slice(
            offset,
            offset + itemsPerPage
        );

    }, [dataToDisplay, offset]);

    const handlePageClick = ({ selected }) => {

        setCurrentPage(selected);

    };

    // -------------------- Actualizaciones --------------------

    const getData = async () => {

        await reloadNewServices();

    };

    const getDataUpdate = async () => {

        await reloadNewServices();

    };

    const getDataDelete = async () => {

        await reloadNewServices();

    };

    return (

        <div className="NewServices-container">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="NewServices-header">

                <div className="NewServices-header-title">

                    <div className="NewServices-icon">

                        <i className="fa fa-cogs"></i>

                    </div>

                    <div>

                        <h3>
                            {titleModule}
                        </h3>

                        <span>
                            Administración de servicios disponibles
                        </span>

                    </div>

                </div>


                {/* Contador */}

                <div className="NewServices-count">

                    <strong>
                        {filteredData.length}
                    </strong>

                    <span>
                        {filteredData.length === 1
                            ? ' servicio'
                            : ' servicios'
                        }
                    </span>

                </div>

            </div>


            {/* =====================================================
                TOOLBAR
            ====================================================== */}

            <div className="NewServices-toolbar">

                <div className="NewServices-search">

                    <div className="NewServices-search-icon">

                        <i className="fa fa-search"></i>

                    </div>

                    <SearchBar
                        plaholderName="Servicio"
                        onSearch={handleSearch}
                    />

                </div>


                <div className="NewServices-btns">

                    <ButtonAdd
                        ModalComponent={Modal_newServices_add}
                        getData={getData}
                        value={
                            <>
                                <i className="fa fa-plus"></i>
                                <span>Agregar servicio</span>
                            </>
                        }
                    />

                </div>

            </div>


            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <div className="NewServices-content">

                {currentData.length > 0 ? (

                    <div className="NewServices-table-wrapper">

                        <table className="NewServices-tabla">

                            <thead>

                                <tr>

                                    <th className="servicio-id">
                                        ID
                                    </th>

                                    <th>
                                        Servicio
                                    </th>

                                    <th>
                                        Categoría
                                    </th>

                                    <th>
                                        Descripción
                                    </th>

                                    <th className="servicio-actions">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentData.map((dataServ) => (

                                    <tr key={dataServ.id}>

                                        {/* ID */}

                                        <td className="servicio-id-cell">

                                            <span className="servicio-id-badge">
                                                {dataServ.id}
                                            </span>

                                        </td>


                                        {/* Servicio */}

                                        <td>

                                            <div className="servicio-name">

                                                <div className="servicio-name-icon">

                                                    <i className="fa fa-cog"></i>

                                                </div>

                                                <strong>
                                                    {dataServ.nombre}
                                                </strong>

                                            </div>

                                        </td>


                                        {/* Categoría */}

                                        <td>

                                            <span className="servicio-category">

                                                {dataServ.nombre_categoria ||
                                                    'Sin categoría'
                                                }

                                            </span>

                                        </td>


                                        {/* Descripción */}

                                        <td>

                                            <span className="servicio-description">

                                                {dataServ.descripcion ||
                                                    'Sin descripción'
                                                }

                                            </span>

                                        </td>


                                        {/* Acciones */}

                                        <td>

                                            <div className="btns_option_NewServices">

                                                <ButtonUpdate

                                                    size="sm"

                                                    ModalCategoriesUpdate={
                                                        ModalNewService_update
                                                    }

                                                    category={dataServ}

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

                                                    category={dataServ}

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

                    <div className="NewServices-empty">

                        <div className="NewServices-empty-icon">

                            <i className="fa fa-cogs"></i>

                        </div>

                        <h4>
                            No se encontraron servicios
                        </h4>

                        <p>

                            {filteredData.length === 0 &&
                            DataServicios.length > 0

                                ? 'Intenta realizar otra búsqueda.'

                                : 'Agrega un servicio para comenzar.'
                            }

                        </p>

                    </div>

                )}


                {/* =================================================
                    PAGINACIÓN
                ================================================== */}

                {filteredData.length > itemsPerPage && (

                    <div className="NewServices-pagination">

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

};

export default NuevoServicio;

