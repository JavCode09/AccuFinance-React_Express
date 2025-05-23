import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

//css
import '../../../styles/views/NewService.css';

//componentes
import SearchBar from '../../../common/search_engines/search_bar';
import ButtonAdd from '../../../common/buttons/btn-add'; //bootn add
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';

// Modals
import Modal_newServices_add from '../../modals/newServices/modal_add'; //modal add
import ModalNewService_update from '../../modals/newServices/modal_update';
import ModalCategoriesDelete from '../../modals/newServices/modal_delete';

// API
import { select_services } from '../../../api/services';

//search
import { search_barModule } from '../../../api/search_bar';

const NuevoServicio = ({titleModule}) => { 

    //Estado de la informacion
    const [DataServicios, setDataServicios] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Estado para datos filtrados (buscador)

    //Paginacion
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const itemsPerPage = 10; // Elementos por página

    useEffect(() => {
            reloadNewServices();
    }, []);

// 🔄 Función para recargar categorías
    const reloadNewServices = async () => {
        try {
            const getDataServicios = await select_services();
            setDataServicios(getDataServicios);
            setFilteredData(getDataServicios);
            setCurrentPage(0); // Reiniciar la paginación
        } catch (error) {
            console.error("Error al recargar categorías:", error);
        }
    };

    // Manejar búsqueda llamada a la api (de aceurdo a la consulta llam al aapi select todo o lo filtrado por buscador)
    const handleSearch = async(query) => {
        // console.log(query);
        try {
            if (query.trim() === "") {
                setFilteredData(DataServicios); // Si no hay query, mostrar todo
            } else {
                const routeName = 'NewService'; // Ruta para Router.
                const response = await search_barModule({searchQuery: query},routeName);
                setFilteredData(response);
            }
            setCurrentPage(0); // Asegúrate de resetear la página a la primera cuando se realice una búsqueda
        } catch (error) {
            console.log(error);
            console.error("Error al buscar categorías:", error);
            setFilteredData([]);
        }
    };
    

    //-------------------- Paginacion --------------------
    
    const dataToDisplay = filteredData.length > 0 ? filteredData : DataServicios;
    const offset = currentPage * itemsPerPage;

    const currentData = useMemo(() => {
        return dataToDisplay.slice(offset, offset + itemsPerPage);
    }, [dataToDisplay, currentPage, itemsPerPage, offset]); // Agrega 'offset'
    
    
    // Manejador de cambio de página
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
     };

    // --------------- Renderizacion --------------
    // Add
    const getData = async () => {
        await reloadNewServices();
    };

    // 🔄 Actualizar categoría
    const getDataUpdate = async () => {
        await reloadNewServices();
    };

    // 🔄 Eliminar categoría
    const getDataDelete = async () => {
        await reloadNewServices();
     };

    return (
        <div className="NewServices-container">
            <div className="NewServices-title">
                <h2>{titleModule}</h2>
            </div>
            <div className="NewServices-option">
                <div className="NewServices-search">
                    <SearchBar plaholderName="Servicio" onSearch={handleSearch} /> 
                </div>
                <div className="NewServices-btns">
                    <ButtonAdd ModalComponent={Modal_newServices_add} getData={getData} value={'Agregar'}/>
                </div>
            </div>
            <div className="NewServices-content">
                <table className='NewServices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Categoria</th>
                            <th>Descripcion</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((dataServ) => (
                            <tr key={dataServ.id}>
                                <td>{dataServ.id}</td>
                                <td>{dataServ.nombre}</td>
                                <td>{dataServ.nombre_categoria}</td>
                                <td>{dataServ.descripcion}</td>
                                {/* <td>{dataServ.categoria}</td> */}
                                <td>
                                    <div className="btns_option_NewServices">
                                        <ButtonUpdate 
                                            ModalCategoriesUpdate={ModalNewService_update}
                                            category={dataServ}
                                            getDataUpdate={getDataUpdate}
                                            value={'Actualizar'}
                                        />
                                        <ButtonDelete 
                                            ModalCategoriesDelete={ModalCategoriesDelete} 
                                            category={dataServ}
                                            getDataDelete={getDataDelete}
                                            value={'Eliminar'}
                                        />
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
                   pageCount={Math.ceil(DataServicios.length / itemsPerPage)}
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
};

export default NuevoServicio;
