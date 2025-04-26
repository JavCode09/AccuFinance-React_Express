import React, { useContext } from 'react';
import { Table, Button } from 'react-bootstrap';

//Informacion de session
import { UserContext } from '../../../../contexts/UserContext';

const MesesDePlanes = ({meses, id_plan}) => {

    //Informacion del logeado o sesion
    const {userData} = useContext(UserContext);

    //combertimos string a array ya que viene de bd
    let mesesArray = [];

    // Lista de meses
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    if (typeof meses === 'string') {
        try {
            mesesArray =JSON.parse(meses);
        } catch (error) {
            console.error("Error parseando meses: ", error);
            mesesArray = [];
        }
    }else{
        mesesArray = meses;
    }


    //API_obtener Planes de pago
    const API_planesPago = (idplan, id_user, mes) => {

        console.log('idplan: ' + idplan);
        console.log('id_user: ' + id_user);
        console.log('mes: ' + mes);
        

        
    }

    return ( 
        <Table>
            <thead>
                <tr>
                    {/* <th>Id</th> */}
                    <th>Mes</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                    {   Array.isArray(mesesArray) && mesesArray.length > 0 ? (
                            mesesArray.map((mes, index)=>(

                                <tr key={index}>
                                    <td>{nombresMeses[parseInt(mes, 10) - 1] || 'Mes inválido'}</td>
                                    <td>
                                        <Button onClick={() => API_planesPago(id_plan, userData?.id, mes)}>Ver Servicios</Button>
                                    </td>
                                </tr>       
                            ))
                        ):(
                            <tr>
                                <td colSpan={3} className='text-center'>No hay meses disponibles.</td>
                            </tr>
                        )
                    }
            </tbody>
        </Table>
     );
}
 
export default MesesDePlanes;