import React, { useContext, useEffect, useState } from 'react';
import {Button} from 'react-bootstrap';

import { Table } from 'react-bootstrap';

//Informacion de session
import { UserContext } from '../../../../contexts/UserContext';

//API
import { API_selectPlanes } from '../../../api/newSystemCpanle';

const Planes = () => {
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
    
    //API_obtener Planes de pago
    const API_planesPago = (dataPlanes_id) => {

        console.log('dataPlanes_id: ' + dataPlanes_id);
        
        // Una ves que se traigan los planes de pago pasamos info como prop
        // Al componente padre.
    }

    return ( 
       <Table responsive>
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
                           <Button onClick={
                                            () => API_planesPago(dataPlanes.id_plan)
                                            }
                            >
                                Ver Plan
                            </Button>
                        </td>
                    </tr>
                 ))}
            </tbody>
       </Table>
     );
}
 
export default Planes;