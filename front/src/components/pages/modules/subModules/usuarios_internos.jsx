import React from 'react';

// css 
import styles from "../../../styles/views/Usuarios_internos.module.css";

// btns
import ButtonAdd from '../../../common/buttons/btn-add';

const UsuariosInternos = ({titleModule}) => {
    return ( 
        <div className={styles["UsariosInternos-container"]}>
    
            <div className={styles["UsariosInternos-title"]}>
                <h2>{titleModule}</h2>
            </div>

            <div className={styles["UsariosInternos-option"]}>
                
                <div className={styles["UsariosInternos-search"]}>
                    {/* <SearchBar plaholderName="Mis Servicios" onSearch={handleSearch} />  */}
                </div>

                <div className={styles["UsariosInternos-btns"]}>
                    <ButtonAdd 
                            size={"sm"}  
                            value={"Nuevo Usuario"} 
                            title={"Agregar"}
                    />
                </div>

            </div>

            <div className={styles["UsariosInternos-content"]}>
        
                <table className={styles["UsariosInternos-tabla"]}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Descripcion</th>
                            <th>Rol</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                
                    </tbody>
                </table>
                {/* <ReactPaginate
                   previousLabel={"Anterior"}
                   nextLabel={"Siguiente"}
                   breakLabel={"..."}
                   pageCount={Math.ceil(DataUsariosInternos.length / itemsPerPage)}
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
                /> */}
            </div>
        </div>
     );
}
 
export default UsuariosInternos;