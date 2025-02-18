import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

//css
import '../../../styles/views/MyServices.css';

//botones
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';
import SearchBar from '../../../common/search_engines/search_bar';

//Modales
import modalAddMyservices from '../../modals/myservices/modal_add';

//api

const MyServices = ({titleModule}) => {

    //estado de datos
    const [DataMyservices, setDataMyServices] = useState([]);
    

    useEffect(() => {
        reloadMynewServices();
    },[]);

    //Funcion para recargar mis servicios
    const reloadMynewServices = () => {
        try {
            
        } catch (error) {
            console.error("Error al cargar mis servicios: ", error);
            
        }
    }

    return ( 
        <div className="Myservices-container">
            <div className="Myservices-title">
                <h2>{titleModule}</h2>
            </div>
            <div className="Myservices-option">
                <div className="Myservices-search">
                    <SearchBar plaholderName="Mis Servicios"  /> 
                </div>
                <div className="Myservices-btns">
                    <ButtonAdd ModalComponent={modalAddMyservices}/>
                </div>
            </div>
            <div className="Myservices-content">
                <table className='Myservices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Descripcion</th>
                            <th>Monto</th>
                            <th>Fecha de pago</th>
                        </tr>
                    </thead>
                    <tbody>
                
                    </tbody>
                </table>
                <ReactPaginate
                //    previousLabel={"Anterior"}
                //    nextLabel={"Siguiente"}
                //    breakLabel={"..."}
                // // pageCount={Math.ceil(DataServicios.length / itemsPerPage)}
                //    marginPagesDisplayed={2}
                //    pageRangeDisplayed={3}
                // // onPageChange={handlePageClick}
                // // forcePage={currentPage} // <-- Agregar esto para que se actualice correctamente
                //    containerClassName={"pagination justify-content-center"} // Clase para el contenedor
                //    activeClassName={"active"} // Clase para la página activa
                //    previousClassName={"page-item previous"} // Clase para el contenedor de "Anterior"
                //    nextClassName={"page-item next"} // Clase para el contenedor de "Siguiente"
                //    pageClassName={"page-item"} // Clase para los contenedores de páginas numeradas
                //    pageLinkClassName={"page-link"} // Clase para los enlaces de las páginas numeradas
                //    previousLinkClassName={"page-link"} // Clase para el enlace de "Anterior"
                //    nextLinkClassName={"page-link"} // Clase para el enlace de "Siguiente"
                //    disabledClassName={"disabled"} // Clase para los botones deshabilitados
                />
            </div>
        </div>
     );
}
 
export default MyServices;