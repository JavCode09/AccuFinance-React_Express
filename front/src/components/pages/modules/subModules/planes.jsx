import { useContext, useEffect, useState } from 'react';
import {Button} from 'react-bootstrap';

import { Table } from 'react-bootstrap';

import '../../../styles/views/planes.css'

//Informacion de session
import { UserContext } from '../../../../contexts/UserContext';

//Buttons
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';

//Modals
import UpdateModalPlanes from '../../modals/panelcenter/modal_update';
import ModalDeletePlanAnual from '../../modals/panelcenter/modal_delete';

//API
import { API_selectPlanes } from '../../../api/newSystemCpanle';

const Planes = ({getMeses}) => {
    //Informacion del logeado o sesion
    const {userData} = useContext(UserContext);


    //Estado de planes
    const [planes, setPlanes] = useState([]);

    useEffect(()=> {
        //Obtenemos el id de usuario
        if (userData?.id) {
            const idUsuario = userData?.id;
            APIselectPlanes(idUsuario);
        }

    },[userData?.id])

    const APIselectPlanes = async(idUsuario) => {
        try {
            const resultPlanes = await API_selectPlanes(idUsuario);
            // console.log(resultPlanes.data);
            
            //Integramos info al estado
            setPlanes(resultPlanes.data)
            console.log("Entro al rederizado");
            
        } catch (error) {
            console.error("Error en la funcion: " , error);
            throw error;
        }
    }

    const getDataUpdate = () => {
        if (userData?.id) {
            // console.log("Si llego");
            
            APIselectPlanes(userData.id);
        }
    };

    return ( 
       <Table responsive className='tableAños stylesTableAños'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Año</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                 {planes.map((dataPlanes) => (
                    <tr key={dataPlanes.id_plan}>
                        <td className=''>{dataPlanes.id_plan}</td>
                        <td className=''>{dataPlanes.nombre_plan}</td>
                        <td className=''>{dataPlanes.año}</td>
                        <td className=''> 
                            <div className="divcss">
                                <Button size="sm" onClick={
                                                () => getMeses(dataPlanes.meses , dataPlanes.id_plan)
                                                }
                                >
                                <i className="fa fa-eye" aria-hidden="true"></i>
                                </Button>
                                <ButtonUpdate size="sm" 
                                                value={<i className="fa fa-pencil" aria-hidden="true"></i>} 
                                                ModalCategoriesUpdate={UpdateModalPlanes} 
                                                category={dataPlanes.id_plan} 
                                                getDataUpdate={getDataUpdate} />
                                <ButtonDelete size="sm"  
                                            value={<i className="fa fa-trash" aria-hidden="true"></i>} 
                                            ModalCategoriesDelete = {ModalDeletePlanAnual}
                                            category={dataPlanes} />
                            </div>
                        </td>
                    </tr>
                 ))}
            </tbody>
       </Table>
     );
}
 
export default Planes;