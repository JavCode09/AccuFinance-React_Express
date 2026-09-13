import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

// css
import '../../../styles/views/MyServices.css';

// botones
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';
import SearchBar from '../../../common/search_engines/search_bar';

// Modales
import ModalAddMyservices from '../../modals/myservices/modal_add';
import ModalUpdateMyServices from '../../modals/myservices/modal_update';
import ModalMyServicesDelete from '../../modals/myservices/modal_delete';

// api
import { selectMyServices } from '../../../api/myservices';
import { search_barModule } from '../../../api/search_bar';


const MyServices = ({ titleModule }) => {

    // Estado de datos
    const [DataMyservices, setDataMyServices] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        reloadMynewServices();
    }, []);


    // Recargar mis servicios
    const reloadMynewServices = async () => {

        try {

            const api_AllMyServices = await selectMyServices();

            setDataMyServices(api_AllMyServices);
            setFilteredData(api_AllMyServices);
            setCurrentPage(0);

        } catch (error) {

            console.error(
                "Error al cargar mis servicios:",
                error
            );

        }

    };


    // Buscador
    const handleSearch = async (query) => {

        try {

            if (query.trim() === "") {

                setFilteredData(DataMyservices);

            } else {

                const routeName = 'MyServices';

                const response = await search_barModule(
                    { searchQuery: query },
                    routeName
                );

                setFilteredData(response);

            }

            setCurrentPage(0);

        } catch (error) {

            console.error(
                "Error al buscar tus servicios:",
                error
            );

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

        await reloadMynewServices();

    };


    const getDataUpdate = async () => {

        await reloadMynewServices();

    };


    const getDataDelete = async () => {

        await reloadMynewServices();

    };


    return (

        <div className="Myservices-container">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="Myservices-header">

                <div className="Myservices-header-title">

                    <div className="Myservices-icon">

                        <i className="fa fa-list-alt"></i>

                    </div>

                    <div>

                        <h3>
                            {titleModule}
                        </h3>

                        <span>
                            Administración de tus servicios contratados
                        </span>

                    </div>

                </div>


                {/* Contador */}

                <div className="Myservices-count">

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

            <div className="Myservices-toolbar">

                <div className="Myservices-search">

                    <div className="Myservices-search-icon">

                        <i className="fa fa-search"></i>

                    </div>

                    <SearchBar
                        plaholderName="Mis Servicios"
                        onSearch={handleSearch}
                    />

                </div>


                <div className="Myservices-btns">

                    <ButtonAdd
                        ModalComponent={ModalAddMyservices}
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

            <div className="Myservices-content">

                {currentData.length > 0 ? (

                    <div className="Myservices-table-wrapper">

                        <table className="Myservices-tabla">

                            <thead>

                                <tr>

                                    <th className="myservice-id">
                                        ID
                                    </th>

                                    <th>
                                        Servicio
                                    </th>

                                    <th>
                                        Descripción
                                    </th>

                                    <th>
                                        Monto
                                    </th>

                                    <th>
                                        Día de pago
                                    </th>

                                    <th>
                                        Estado
                                    </th>

                                    <th className="myservice-actions">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentData.map((mySer) => (

                                    <tr key={mySer.id_myservices}>


                                        {/* ID */}

                                        <td className="myservice-id-cell">

                                            <span className="myservice-id-badge">

                                                {mySer.id_myservices}

                                            </span>

                                        </td>


                                        {/* Servicio */}

                                        <td>

                                            <div className="myservice-name">

                                                <div className="myservice-name-icon">

                                                    <i className="fa fa-briefcase"></i>

                                                </div>

                                                <strong>
                                                    {mySer.nombre}
                                                </strong>

                                            </div>

                                        </td>


                                        {/* Descripción */}

                                        <td>

                                            <span className="myservice-description">

                                                {mySer.descripcion ||
                                                    'Sin descripción'
                                                }

                                            </span>

                                        </td>


                                        {/* Monto */}

                                        <td>

                                            <span className="myservice-amount">

                                                ${mySer.monto}

                                            </span>

                                        </td>


                                        {/* Día de pago */}

                                        <td>

                                            <span className="myservice-payment-day">

                                                Día {mySer.dia_pago}

                                            </span>

                                        </td>


                                        {/* Estado */}

                                        <td>

                                            <span
                                                className={
                                                    mySer.general_status === 'Active'
                                                        ? 'myservice-status status-active'
                                                        : mySer.general_status === 'Inactive'
                                                            ? 'myservice-status status-inactive'
                                                            : 'myservice-status'
                                                }
                                            >

                                                <i className="fa fa-circle"></i>

                                                {mySer.general_status}

                                            </span>

                                        </td>


                                        {/* Acciones */}

                                        <td>

                                            <div className="btns_option_Myservices">

                                                <ButtonUpdate

                                                    size="sm"

                                                    ModalCategoriesUpdate={
                                                        ModalUpdateMyServices
                                                    }

                                                    category={
                                                        mySer.id_myservices
                                                    }

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
                                                        ModalMyServicesDelete
                                                    }

                                                    category={mySer}

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

                    <div className="Myservices-empty">

                        <div className="Myservices-empty-icon">

                            <i className="fa fa-briefcase"></i>

                        </div>

                        <h4>
                            No se encontraron servicios
                        </h4>

                        <p>

                            {filteredData.length === 0 &&
                            DataMyservices.length > 0

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

                    <div className="Myservices-pagination">

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

export default MyServices;