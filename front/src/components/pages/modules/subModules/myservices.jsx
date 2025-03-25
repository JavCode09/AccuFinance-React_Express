import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';

//css
import '../../../styles/views/MyServices.css';

//botones
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';
import SearchBar from '../../../common/search_engines/search_bar';

//Modales
import ModalAddMyservices from '../../modals/myservices/modal_add';
import ModalUpdateMyServices from '../../modals/myservices/modal_update';
import ModalMyServicesDelete from '../../modals/myservices/modal_delete';

//api
import { selectMyServices } from '../../../api/myservices';
import { search_barModule } from '../../../api/search_bar'; //Buscador


const MyServices = ({titleModule}) => {

    //estado de datos
    const [DataMyservices, setDataMyServices] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Estado para datos filtrados (buscador)

     //Paginacion
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const itemsPerPage = 10; // Elementos por página

    useEffect(() => {
        reloadMynewServices();
    },[]);

    //Funcion para recargar mis servicios
    const reloadMynewServices = async() => {
        try {
            //Cargamos data de Myservices
            const api_AllMyServices = await selectMyServices();
            setDataMyServices(api_AllMyServices);
            setFilteredData(api_AllMyServices);
            setCurrentPage(0); // Reiniciar la paginación
        } catch (error) {
            console.error("Error al cargar mis servicios: ", error);
            
        }
    }

    //Buscador
    const handleSearch = async(query) => {
        try {
            if (query.trim() === "") {
                setFilteredData(DataMyservices);
            }else{
                const routeName = 'MyServices';
                const response = await search_barModule({searchQuery: query}, routeName)
                setFilteredData(response)
            }
        } catch (error) {
            console.log(error);
            console.error("Error al buscar tus servicios:", error);
            setFilteredData([]);
        }
    }
   //-------------------- Paginacion --------------------
    
    const dataToDisplay = filteredData.length > 0 ? filteredData : DataMyservices;
    const offset = currentPage * itemsPerPage;

    const currentData = useMemo(() => {
        return dataToDisplay.slice(offset, offset + itemsPerPage);
    }, [dataToDisplay, currentPage, itemsPerPage, offset]); // Agrega 'offset'
    
    
    // Manejador de cambio de página
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // --------------- Renderizacion --------------
    // 🔄 add
    const getData = async() => {
        await reloadMynewServices();
    }

    // update
    const getDataUpdate = async() => {
        await reloadMynewServices();
    }

    // delete
    const getDataDelete = async() => {
        await reloadMynewServices();
    }

    return ( 
        <div className="Myservices-container">
            <div className="Myservices-title">
                <h2>{titleModule}</h2>
            </div>
            <div className="Myservices-option">
                <div className="Myservices-search">
                    <SearchBar plaholderName="Mis Servicios" onSearch={handleSearch} /> 
                </div>
                <div className="Myservices-btns">
                    <ButtonAdd ModalComponent={ModalAddMyservices} getData={getData}/>
                </div>
            </div>
            <div className="Myservices-content">
                <table className='Myservices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Descripcion</th>
                            <th>Monto $</th>
                            <th>Dias de pago</th>
                            {/* <th>Fecha inicial del servicio</th> */}
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((mySer) => (
                                <tr key={mySer.id_myservices}>
                                    <td>{mySer.id_myservices}</td>
                                    <td>{mySer.nombre}</td>
                                    <td>{mySer.descripcion}</td>
                                    <td>${mySer.monto}</td>
                                    <td>{mySer.dia_pago}</td>
                                    {/* <td>{mySer.fecha_inicio}</td> */}
                                    <td>
                                        <div className="btns_option_Myservices">
                                            <ButtonUpdate 
                                                ModalCategoriesUpdate={ModalUpdateMyServices}
                                                category={mySer.id_myservices}
                                                getDataUpdate = {getDataUpdate}                                                
                                            />
                                            <ButtonDelete 
                                                ModalCategoriesDelete={ModalMyServicesDelete}
                                                category={mySer}
                                                getDataDelete={getDataDelete}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                
                    </tbody>
                </table>
                <ReactPaginate
                   previousLabel={"Anterior"}
                   nextLabel={"Siguiente"}
                   breakLabel={"..."}
                   pageCount={Math.ceil(DataMyservices.length / itemsPerPage)}
                   marginPagesDisplayed={2}
                   pageRangeDisplayed={3}
                   onPageChange={handlePageClick}
                //    forcePage={currentPage} // <-- Agregar esto para que se actualice correctamente
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
 
export default MyServices;