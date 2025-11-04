import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

//CSS
import '../../../styles/views/DeleteServicesPlanes.css'

// Button add
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';

//Api add servicos
import AddModalServiciosMes from '../../modals/panelcenter/modal_addServices';
import ModalUpdateServices from '../../modals/panelcenter/modal_updateServices';
import ModalDeleteServicePanel from '../../modals/panelcenter/modal_deleteServices';
import ModalValidationService from '../../modals/panelcenter/modal_addServiceValidation';


const PanelPrincipal = ({planesPorMes,mesNumero, planes, onRefreshOtro, getDataUpdate, getDataDelete}) => {

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(); // te da algo como 22/04/2025
    };

    // console.log('planesPorMes: ' , planesPorMes);
    // console.log('mesNumero: ' , mesNumero);
    // console.log('planes: ' , planes);

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // OJO: si mesNumero es string, conviértelo a número restando 1
    const nombreMes = meses[parseInt(mesNumero) - 1];


    //Hook de estado para ocultar y mostrar campos inputs
    const [showCampos, setShowCampos] = useState(false);

   

    useEffect(()=> {
        if (planesPorMes.length > 0) {
            setShowCampos(true)
        }else{
            setShowCampos(false)
        }
    },[planesPorMes])

    return ( 
        <div className="containerPanel1">
            <div className="container-table">
                <div className="titlePanelPrincipal">
                    {planesPorMes && planesPorMes[0] ? `Servicios de ${nombreMes}, del Plan: ${planesPorMes[0].nombre_plan}` : 'Selecciona un Mes'}
                </div>
                {showCampos && (
                    <div className="containerPanelPrincipalServices">
                        <div className="infoPanelPrincipal">
                            <div className="mb-3" id='Imensual'>
                                <label htmlFor="" className='form-label label'>Insegro Mensual</label>
                                <input type="text"
                                    className='form-control input' 
                                    placeholder='Ingreso mensual'
                                    id='Ingreso_mensual'
                                    name='Ingreso_mensual'
                                />
                            </div>
                            <div className="mb-3" id='Pmensual'>
                                <label htmlFor="" className='form-label label'>Pago Mensual Total</label>
                                <input type="text"
                                    className='form-control input' 
                                    placeholder='Pago mensual'
                                    id='Pago_mensual'
                                    name='Pago_mensual'
                                    />
                            </div>
                            <div className="mb-3" id='Pro15na'>
                                <label htmlFor="" className='form-label label'>Primera 15na</label>
                                <input type="text"
                                    className='form-control input' 
                                    placeholder='primera15'
                                    id='primera15'
                                    name='primera15'
                                    />
                            </div>

                            <div className="mb-3" id='Se15na'>
                                <label htmlFor="" className='form-label label'>Segunda 15na</label>
                                <input type="text" 
                                    className='form-control input' 
                                    placeholder='Ingreso mensual'
                                    id='segunda15'
                                    name='segunda15'
                                    />
                            </div>                    
                        </div>
                        <div className="containerPanelPrincipalServices2">
                            <Button>Info cada 15na</Button>
                        </div>
                        <div className="btnNuevoServicioPanelPrincipal">
                            < ButtonAdd ModalComponent = {AddModalServiciosMes} 
                                        category={{planes, mesNumero, planesPorMes}} 
                                        size='sm' title={'Agregar Servicio'}
                                        value={'Nuevo Servicio +'}
                                        onRefreshOtro={onRefreshOtro}   // ✅ pasamos la prop
                            />
                        </div>

                    </div>
                )}
            </div>
            <table className='Myservices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Pago</th>
                            <th>Estado</th>
                            <th>Fecha de Pago</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {
                            // si no hay registros en el mes
                            planesPorMes.length > 0 ? (

                                planesPorMes.map((pdp)=>(
                                    <tr key={pdp.id_payment}>
                                        <td>{pdp.id_payment}</td>
                                        <td>{pdp.nombre}</td>
                                        <td>${pdp.monto}</td>
                                        <td>{pdp.service_status}</td>
                                        <td>{formatDate(pdp.paid_at)}</td>
                                        <td>{formatDate(pdp.due_date)}</td>
                                        <td>
                                            <div className="DeleteServicesPlanes-divcss">
                                            <ButtonAdd 
                                                ModalComponent = {ModalValidationService}
                                                category={pdp}
                                                value={<i className="fa fa-check" aria-hidden="true"></i>} 
                                                size="sm" title={'Validar Servicios'}
                                                styleColor= 'success'
                                                onRefreshOtro = {onRefreshOtro}
                                            />
                                        
                                            <ButtonUpdate 
                                                ModalCategoriesUpdate = {ModalUpdateServices}
                                                category={pdp}
                                                value={<i className="fa fa-pencil" aria-hidden="true"></i>} 
                                                size="sm" title={'Editar Servicios'}
                                                getDataUpdate = {getDataUpdate}
                                            />
                                            
                                            <ButtonDelete 
                                                ModalCategoriesDelete = {ModalDeleteServicePanel}
                                                category={pdp}
                                                value={<i className="fa fa-trash" aria-hidden="true"></i>} 
                                                size="sm" title={'Eliminar Servicios'}
                                                getDataDelete = {getDataDelete}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                  <td colSpan="7" style={{ textAlign: 'center' }}>
                                        <p>No hay registros disponibles</p>
                                  </td>
                                </tr>
                            )
                        }
                       
                            
                    </tbody>
                </table>
        </div>
     );
}
 
export default PanelPrincipal;