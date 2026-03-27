import { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';

//Informacion de session
import { UserContext } from '../../../../contexts/UserContext';

//Api planes de pago
import { API_planes_de_pago } from '../../../api/newSystemCpanle';
import { APIestadosMeses } from '../../../api/newSystemCpanle';

//Buttons
import ButtonDelete from '../../../common/buttons/btn-delete';
import ButtonUpdates from '../../../common/buttons/btn-update';

//Modals
import ModalDeleteMeses from '../../modals/panelcenter/modal_deleteMeses';
import UpdateMesespanle from '../../modals/panelcenter/modal_updateMeses';

const MesesDePlanes = ({meses, NombrePlan, id_plan, Getplanes_de_pago, getDataDelete, getDataUpdate}) => {
    
    //Informacion del logeado o sesion
    const {userData} = useContext(UserContext);
    let idUsuario = userData?.id;
    //combertimos string a array ya que viene de bd
    // let mesesArray = [];

    // Lista de meses
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const [mesesArray, setMesesArray] = useState([]);
    const [estadosMes, setEstadosmes] = useState([]);


    useEffect(() => {
        if (!meses.length != 0) return;

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
        // console.log(arrayConvertido);
        
        setMesesArray(arrayConvertido);
        
        //Obtenemos estados de los meses por plan relacionado
        const functionEstadosMes = async() => {
            try {
                const resultMesesStado = await APIestadosMeses(id_plan);
                // console.log(resultMesesStado.data);
                
                setEstadosmes(resultMesesStado.data || []);
            } catch (error) {
                if (error.response && error.response.status === 500 && error.response.data) {
                    alert(`⚠️ ${error.response.data.message}`); // Mensaje exacto del backend
                } else {
                    alert("❌ Error: No se encontraron lso estados del mes.");
                }
            }

            // console.log('meses: ' , meses);
            
        }
        functionEstadosMes();
    }, [meses]);

    //API_obtener Planes de pago
    const API_planesPago = async(idplan, id_user, mes) => {
        
        try {
            const responseApiplanes = await API_planes_de_pago(idplan,id_user,mes)

            // console.log(responseApiplanes);
            if (responseApiplanes) {
                // console.log("Datos: " , responseApiplanes);
                
                //Pasamos al hook de estados de planes
                Getplanes_de_pago(responseApiplanes.data, mes, id_plan, responseApiplanes.data2)
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
    // console.log(mesesArray); // Traes los meses en array 
    
    
    return ( 
        <Table className='stylesTableMeses' hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Mes</th>
                    <th>Estado</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                    {   Array.isArray(mesesArray) && mesesArray.length > 0 ? (
                            mesesArray.map((mes, index)=>(
                                
                                <tr key={index} className='panelcontrolBloqueMeses'>
                                        <td>{index + 1}</td>{/* ← Número de posición */}
                                        <td>{nombresMeses[parseInt(mes, 10) - 1] || 'Mes inválido'}</td>
                                        <td>{estadosMes.find(e => Number(e.month) === Number(mes))?.name || 'Sin estado'}</td>
                                        <td>
                                            <div className="buttonsstylesTableMeses">
                                                <Button size="sm" title='Ver servicios' onClick={() => API_planesPago(id_plan, userData?.id, mes)}><i className="fa fa-eye" aria-hidden="true"></i></Button>
                                                <ButtonUpdates 
                                                    ModalCategoriesUpdate={UpdateMesespanle} 
                                                    title={"Editar mes"}
                                                    value={<i className="fa fa-pencil" aria-hidden="true"></i>}
                                                    size={'sm'}
                                                    category={{
                                                        id_plan,
                                                        mes,
                                                        nombreMes: nombresMeses[parseInt(mes, 10) - 1] || 'Mes inválido'
                                                    }}
                                                    getDataUpdate = {getDataUpdate}
                                                />
                                                <ButtonDelete
                                                    ModalCategoriesDelete={ModalDeleteMeses}
                                                    title={'Eliminar Mes'}
                                                    value={<i className="fa fa-trash" aria-hidden="true"></i>}
                                                    size={'sm'}
                                                    category={{mes, 
                                                              idUsuario,
                                                              id_plan,
                                                              NombrePlan,
                                                              nombreMes: nombresMeses[parseInt(mes, 10) - 1] || 'Mes inválido'
                                                            }}
                                                    getDataDelete ={getDataDelete}
                                                />
                                            </div>
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