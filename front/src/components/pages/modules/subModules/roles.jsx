import React, { useEffect, useState } from 'react';

import styles from "../../../styles/views/Roles.module.css"

// BTNS
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonAddPage from '../../../common/buttons/btn-add-page';

//Modales
import ModalAdd from '../../modals/Roles/modal_add';

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
            console.error(error);
            
        }
    }

    // Renderizado
    const getData = async() => {
        await getData_all();
    }

    
     return ( 
        <div className={styles["Roles-container"]}>
    
            <div className={styles["Roles-title"]}>
                <h2>{titleModule}</h2>
            </div>

            <div className={styles["Roles-option"]}>
                
                <div className={styles["Roles-search"]}>
                </div>

                <div className={styles["Roles-btns"]}>
                    <ButtonAdd 
                            ModalComponent={ModalAdd}
                            size={"sm"}  
                            value={"Nuevo Rol"} 
                            title={"Agregar Rol"}
                            getData={getData}
                    />
                </div>

            </div>

            <div className={styles["Roles-content"]}>
        
                <table className={styles["Roles-tabla"]}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Rol</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable.map((dTable)=> (
                            <tr key={dTable.id}>
                                <td>{dTable.id}</td>
                                <td>{dTable.nombre}</td>
                                <td>    
                                    <ButtonAddPage
                                        size={"sm"}
                                        title={"Actualizar rol"}
                                        value={"Actualizar"}
                                        styleColor={"warning"}
                                        page={`/main/rolls/roles_permisos/${dTable.id}`}
                                    />
                                </td>
                            </tr>
                        ))

                        }
                
                    </tbody>
                </table>
   
            </div>
        </div>
     );
}
 
export default Roles;