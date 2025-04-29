import React, { useContext, useEffect, useState } from 'react';
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
        } catch (error) {
            console.error("Error en la funcion: " , error);
            throw error;
        }
    }

    return ( 
       <Table responsive className='tableAños'>
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
                        <td>{dataPlanes.id_plan}</td>
                        <td>{dataPlanes.nombre_plan}</td>
                        <td>{dataPlanes.año}</td>
                        <td>
                            <div className="divcss">
                                <Button size="sm" onClick={
                                                () => getMeses(dataPlanes.meses , dataPlanes.id_plan)
                                                }
                                >
                                    Ver Plan
                                </Button>
                                <ButtonUpdate size="sm" ModalCategoriesUpdate={UpdateModalPlanes} />
                                <ButtonDelete size="sm" />
                            </div>
                        </td>
                    </tr>
                 ))}
            </tbody>
       </Table>
     );
}
 
export default Planes;