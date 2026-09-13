import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

//css
import '../../../styles/views/TipoRoles.css';

// Botones
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';

//Modales
import AddPermisos from '../../modals/Permisos/modal_add';

//API
import { getPermisos } from '../../../api/permisos';

const RolesTipoPermisos = ({titleModule}) => {

    // Hook de estado para obtener datos
    const [DataTipos,setDataTipos] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Estado para datos filtrados (buscador)

    // Hoks de paginacion
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const itemsPerPage = 8; // Elementos por página

    useEffect(() => {
        reloadTiposPermisos();
    },[]);
    
    // Funcion para obtener permisos
    const reloadTiposPermisos = async() => {
        try {
            const result = await getPermisos();
            console.log(result);
            
            if (result.success) {
                setDataTipos(result.data);
            }

        } catch (error) {
            // console.error(error);
            if (error.response?.status === 404) {
                alert(error.response.data.message);
            }else if(error.response?.status === 500){
                alert(error.response.data.message);
            }
           
        }
    }


    //----------------- Paginacion -----------
    const dataToDisplay = filteredData;
    const offset = currentPage * itemsPerPage;
    
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

     return (

        <div className="TiposPermisos-container">

            {/* =====================================================
                HEADER DE LA SECCIÓN
            ====================================================== */}

            <div className="TiposPermisos-header">

                <div className="TiposPermisos-header-title">

                    <div className="TiposPermisos-icon">

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

                <div className="TiposPermisos-count">

                    <strong>
                        {filteredData.length}
                    </strong>

                    <span>
                        {filteredData.length === 1
                            ? ' Permisos+'
                            : ' Permisos'
                        }
                    </span>

                </div>

            </div>


            {/* =====================================================
                BARRA DE HERRAMIENTAS
            ====================================================== */}

            <div className="TiposPermisos-toolbar">

                <div className="TiposPermisos-search">

                    <div className="TiposPermisos-search-icon">

                        <i className="fa fa-search"></i>

                    </div>

                </div>


                <div className="TiposPermisos-btns">
                    < ButtonAdd
                        size={"sm"}
                        title={"Nuevo permiso"}
                        value={"Nuevo Permiso"}
                        ModalComponent={AddPermisos}
                        onRefreshOtro={reloadTiposPermisos}
                    />
                </div>

            </div>


            {/* =====================================================
                CONTENIDO
            ====================================================== */}

            <div className="TiposPermisos-content">

                {DataTipos.length > 0 ? (
                    
                    <div className="TiposPermisos-table-wrapper">

                        <table className="TiposPermisos-tabla">

                            <thead>

                                <tr>
                                    <th className="toposper-id">ID</th>
                                    <th>Nombre</th>
                                    <th className="toposper-actions">Acciones</th>
                                </tr>

                            </thead>


                            <tbody>

                                {DataTipos.map((dataPer) => (

                                    <tr key={dataPer.id}>

                                        <td className="toposper-id-cell">

                                            <span className="toposper-id-badge">
                                                {dataPer.id}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="toposper-name">

                                                <div className="toposper-name-icon">

                                                    <i className="fa fa-hand-paper-o"></i>

                                                </div>

                                                <strong>
                                                    {dataPer.nombre}
                                                </strong>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="btns_option_TiposPermisos">
                                                <ButtonUpdate 
                                                    size={"sm"}
                                                    title={"Actualizar permiso"}
                                                    value={"Actualizar"}
                                                    
                                                />
                                                <ButtonDelete 
                                                    size={"sm"}
                                                    title={"Eliminar permiso"}
                                                    value={"Eliminar"}
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

                    <div className="topospers-empty">

                        <div className="topospers-empty-icon">

                            <i className="fa fa-folder-open"></i>

                        </div>

                        <h4>
                            No se encontraron permisos
                        </h4>

                        <p>
                            {filteredData.length === 0 &&
                            DataTipos.length > 0
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

                    <div className="topospers-pagination">

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
 
export default RolesTipoPermisos;