import React, { useEffect, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';

//API Select Data 
import { getMyServices } from '../../../api/myservices';
//API Select servicios
import { selectServices } from '../../../api/myservices';
//API Update myservices
import { UpdateMyServices } from '../../../api/myservices';

const ModalUpdateMyServices = ({showModal_Update,closeModal_update, category,getDataUpdate}) => {
    
    //Estado para la consulta
    const [DataUpdate, setDataUpdate] = useState({
        id_myservices:"",
        idServicio: "",
        id_user: "",
        servicio: "",
        descripcion: "",
        monto: "",
        diaPago: "",
        fechaInicio: "",
    });

    //estado para traer todos los servicios
    const [DataServices, setDataServices] =useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                //llamada a la api
                const DataInformation = await getMyServices(category);
                console.log(DataInformation);
                
                if (DataInformation.data &&  DataInformation.data.length > 0) {
                    setDataUpdate({
                        id_myservices: DataInformation.data[0].id_myservices,
                        idServicio: DataInformation.data[0].id_services,
                        id_user: DataInformation.data[0].id_user,
                        servicio: DataInformation.data[0].nombre,
                        descripcion: DataInformation.data[0].descripcion,
                        monto: DataInformation.data[0].monto,
                        diaPago: DataInformation.data[0].dia_pago,
                        fechaInicio: DataInformation.data[0].fecha_inicio.split("T")[0] // Para compatibilidad con input date,
                    })
                }

                //Llamada de servicios
                const GetDataServices = await selectServices();
                // console.log(GetDataServices); 
                setDataServices(GetDataServices)
                
            } catch (error) {
                console.error("Error al cargar el registro: ", error);
                
            }
        }

        if (showModal_Update) {
            
            fetchData();
        }
    }, [showModal_Update,category])

    const handlechange = (e) => {
        const {name,value} = e.target;
        setDataUpdate((prevData)=> ({
            ...prevData,
            [name]: value,
        }))
    }


    const API_UpMyServices = async(e) => {
        e.preventDefault();
        
        //Aqui van las validaciones

        try {
            const ApiUpMyServices = await UpdateMyServices(DataUpdate);
            
            if (ApiUpMyServices && ApiUpMyServices.message) {
                alert(`✅ Status: Éxito\n📝 Mensaje: ${ApiUpMyServices.message}`);
                
                // Esperar a que los datos se actualicen antes de cerrar el modal
                await getDataUpdate();

                //cerrar modal
                closeModal_update();
            }

        } catch (error) {
            console.log('error: ' + error);
            // Verifica si existe una respuesta con status y data
            if (error.response && error.response.status === 400 && error.response.data) {
                alert(`⚠️ Error: ${error.response.data.message}`); // Mensaje exacto del backend
            } else {
                alert("❌ Error: No se pudo actualizar el servicio. Intenta de nuevo.");
            }
            
        }
        
    }

    return ( 
        <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Servicio</Modal.Title>
            </Modal.Header>
            <form className='form_Myservices' onSubmit={API_UpMyServices}>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="servicio" className='form-label label'>Servicio</label>
                        <select 
                            className='form-control input'
                            id='idServicio'
                            name='idServicio' 
                            value={DataUpdate.idServicio || ""}
                            onChange={handlechange}
                        >
                            {/* Opciones por defecto */}
                            {DataServices.map((ds)=> (
                                <option key={ds.id} value={ds.id}>
                                    {ds.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className='form-label label'>Descripcion</label>
                        <input type="text" 
                            className='form-control input'
                            id='descripcion'
                            name='descripcion' 
                            value={DataUpdate.descripcion || ""}
                            onChange={handlechange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="monto" className='form-label label'>Monto</label>
                        <input type="text" 
                            className='form-control input'
                            id='monto'
                            name='monto' 
                            value={DataUpdate.monto || ""}
                            onChange={handlechange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="diaPago" className='form-label label'>Dia de Pago</label>
                        <input type="text" 
                            className='form-control input'
                            id='diaPago'
                            name='diaPago' 
                            value={DataUpdate.diaPago || ""}
                            onChange={handlechange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaInicio" className='form-label label'>Fecha Inicio</label>
                        <input type="date" 
                            className='form-control input'
                            id='fechaInicio'
                            name='fechaInicio' 
                            value={DataUpdate.fechaInicio || ""}
                            onChange={handlechange}
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
 
export default ModalUpdateMyServices;