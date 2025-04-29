import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

//Informacion de session
import { UserContext } from '../../../../contexts/UserContext';

const Planes = () => {
    //Informacion del logeado o sesion
    const {userData} = useContext(UserContext);


    //Estado de planes
    const [planes, setPlanes] = useState([]);

    useEffect(()=> {
        //Obtenemos el id de usuario
        if (userData?.id) {
            const idUsuario = userData?.id;

            
        }
    })

    return ( 
       <Table responsive>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Año</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
       </Table>
     );
}
 
export default Planes;