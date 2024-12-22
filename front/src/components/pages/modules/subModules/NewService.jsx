import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

//css
import '../../../styles/views/NewService.css';

//componentes
import Search_bar from '../../../common/search_engines/search_bar';
import Button_add from '../../../common/buttons/btn-add'; //bootn add
import Button_update from '../../../common/buttons/btn-update';
import Button_delete from '../../../common/buttons/btn-delete';
// Modals
import Modal_newServices from '../../modals/newServices/modal_add'; //modal add

// API
import { select_services } from '../../../api/services';

const NuevoServicio = ({titleModule}) => { 

    const [DataServicios, setDataServicios] = useState([]);

    //Paginacion
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const itemsPerPage = 10; // Elementos por página

    useEffect(() => {
        const effectServicios = async() => {
            try {
                const getDataServicios = await select_services();
                setDataServicios(getDataServicios);
                console.log("Success");
            } catch (error) {
                console.log(error);
            }
        };
        effectServicios();
    },[]);

    // Datos paginados
    const offset = currentPage * itemsPerPage;
    const currentData = DataServicios.slice(offset, offset + itemsPerPage);

    // Manejador de cambio de página
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };


    return (
        <div className="NewServices-container">
            <div className="NewServices-title">
                <h2>{titleModule}</h2>
            </div>
            <div className="NewServices-option">
                <div className="NewServices-search">
                    <Search_bar /> 
                </div>
                <div className="NewServices-btns">
                    <Button_add ModalComponent={Modal_newServices} />
                </div>
            </div>
            <div className="NewServices-content">
                <table className='NewServices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Categoria</th>
                            <th>Servicio</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((dataServ) => (
                            <tr key={dataServ.id}>
                                <td>{dataServ.id}</td>
                                <td>{dataServ.nombre_categoria}</td>
                                <td>{dataServ.nombre}</td>
                                <td>
                                    <div className="btns_option_NewServices">
                                        <Button_update />
                                        <Button_delete />
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
