import { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';

//Informacion de session
import { UserContext } from '../../../../contexts/UserContext';

//Api planes de pago
import { API_planes_de_pago } from '../../../api/newSystemCpanle';

const MesesDePlanes = ({meses, id_plan, Getplanes_de_pago}) => {
    
    //Informacion del logeado o sesion
    const {userData} = useContext(UserContext);

    //combertimos string a array ya que viene de bd
    // let mesesArray = [];

    // Lista de meses
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const [mesesArray, setMesesArray] = useState([]);
    useEffect(() => {
        if (!meses) return;

        let arrayConvertido = [];
        if (typeof meses === 'string') {
            try {
                arrayConvertido = JSON.parse(meses);
            } catch (error) {
                console.error("Error parseando meses: ", error);
                arrayConvertido = [];
            }
        } else {
            arrayConvertido = meses;
        }

        // Ordenar los meses del 1 (enero) al 12 (diciembre)
        arrayConvertido.sort((a, b) => parseInt(a) - parseInt(b));
        setMesesArray(arrayConvertido);
    }, [meses]);

    //API_obtener Planes de pago
    const API_planesPago = async(idplan, id_user, mes) => {
        
        try {
            const responseApiplanes = await API_planes_de_pago(idplan,id_user,mes)

            // console.log(responseApiplanes);
            if (responseApiplanes) {
                // console.log("Datos: " , responseApiplanes);
                
                //Pasamos al hook de estados de planes
                Getplanes_de_pago(responseApiplanes.data, mes, id_plan)
            }

        } catch (error) {
            console.error(error);
            
            if (error.response && error.response.status === 400) {
                alert(`${error.response.data.message}`)
            }else{
                alert(`${error.response.data.message}`)
            }
            
        }
        
    }

    return ( 
        <Table className='stylesTableMeses'>
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
                                        <Button size="sm" onClick={() => API_planesPago(id_plan, userData?.id, mes)}>Ver Servicios</Button>
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