import React, { useEffect, useState } from 'react';

import styles from "../../../styles/views/Roles.module.css"

// BTNS
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonDelete from '../../../common/buttons/btn-delete';
import ButtonAddPage from '../../../common/buttons/btn-add-page';

//Modales
import ModalAdd from '../../modals/Roles/modal_add';
import DeleteRoles from '../../modals/Roles/modal_delete';

//APIfront
import { getDataAll } from '../../../api/roles';

const Roles = ({titleModule}) => {

    // Hook de estado de cambio de datos de tabla
    const [dataTable, setDataTable] = useState([]);

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

                {dataTable.length > 0 ? (

                    <div className={styles["Roles-table-wrapper"]}>

                        <table className={styles["Roles-tabla"]}>

                            <thead>

                                <tr>

                                    <th className={styles["rol-id"]}>
                                        ID
                                    </th>

                                    <th>
                                        Rol
                                    </th>

                                    <th className={styles["rol-actions"]}>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {dataTable.map((dTable) => (

                                    <tr key={dTable.id}>


                                        {/* ID */}

                                        <td className={styles["rol-id-cell"]}>

                                            <span className={styles["rol-id-badge"]}>

                                                {dTable.id}

                                            </span>

                                        </td>


                                        {/* ROL */}

                                        <td>

                                            <div className={styles["rol-name"]}>

                                                <div className={styles["rol-name-icon"]}>

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
                            No se encontraron roles
                        </h4>

                        <p>
                            Agrega un rol para comenzar.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}
 
export default Roles;