import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Modal, Button  } from 'react-bootstrap';

//Informacion de session
import { UserContext } from '../../../../contexts/UserContext';

// APIs
import { APIdataUpdateMes } from '../../../api/newSystemCpanle';
import { ApiUpdateDataMes } from '../../../api/newSystemCpanle';


const UpdateMesespanle = ({showModal_Update,closeModal_update, category, getDataUpdate}) => {

    //Informacion del logeado o sesion
    const {userData} = useContext(UserContext);
    let idUsuario = userData?.id;

    //Hook de estado (datos recividos)
    const [receivedData, setReceivedData] = useState({
        id_plan: '',
        mes: '',
        nombreMes: ''
    })

    //Hook de estado (datos obtenidos para el modal)
    const [dataUpdateMes, setDataUpdateMes] = useState({
        monto_mensual: '',
    })

    useEffect(() => {
        if (!showModal_Update) return;

        const received = {
            id_plan: category.id_plan || '',
            mes: category.mes || '',
            nombreMes: category.nombreMes || ''
        };

        setReceivedData(received);
        fetchDataForModal(received.id_plan, received.mes);

    }, [showModal_Update, category.id_plan, category.mes]);

    const fetchDataForModal = async(id_plan, mes) => {

        // console.log(id_plan);
        // console.log(mes);
        try {
            //Llamada a la API
            const resultData = await APIdataUpdateMes(id_plan, mes);
           
        
            if (resultData && resultData.success) {
                //  console.log(resultData);
                 setDataUpdateMes({
                    monto_mensual: resultData.data.monthly_income
                 })
            }
        } catch (error) {
            // console.error(error);
            
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Error de conexión con el servidor");
            }
        }
   }

    const handleChange = (e) => {
            setDataUpdateMes({
                ...dataUpdateMes, //copia todo lo que ya existe en el estado
                [e.target.name]: e.target.value //Actualiza la propiedad que tenga el mismo nombre que el input.

            })
    }

    const UpdateData = async(e) => {
        e.preventDefault();

        const payload = {
            id_plan: receivedData.id_plan,
            mes: receivedData.mes,
            monto_mensual: Number(dataUpdateMes.monto_mensual)
        }
        // console.log(payload);

        try {
            const resUpdate = await ApiUpdateDataMes(payload);

            if (resUpdate && resUpdate.success) {
                // console.log(resUpdate);

                await getDataUpdate({
                    idplan: receivedData.id_plan,
                    idUsuario: idUsuario,
                    mesid: receivedData.mes

                })

                // Cerramos modal 
                closeModal_update();

                alert(resUpdate.message);
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else if (error.response && error.response.status === 500) {
                alert(error.response.data.message);
            } else {
                alert("Error de conexión con el servidor");
            }
        }
        
    }

    //    POnemos en el modal datos para cosultar y actualizar como monto nebsual
    return ( 
        <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header>
                <Modal.Title>Actualiza el mes de {receivedData.nombreMes}</Modal.Title>
            </Modal.Header>
            <form action="" onSubmit={UpdateData}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="" className='form-label'>Monto mensual</label>
                        <input type="number" 
                                className='form-control' 
                                placeholder='Monto mensual' 
                                min="0"
                                id='monto_mensual'
                                name="monto_mensual"
                                value={dataUpdateMes.monto_mensual || ''}
                                onChange={handleChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal_update}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Actualizar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default UpdateMesespanle;