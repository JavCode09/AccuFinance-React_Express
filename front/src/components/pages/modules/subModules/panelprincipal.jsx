import React, { useEffect } from 'react';

// Button add
import ButtonAdd from '../../../common/buttons/btn-add';
import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';

//Api add servicos
import AddModalServiciosMes from '../../modals/panelcenter/modal_addServices';
import ModalUpdateServices from '../../modals/panelcenter/modal_updateServices';
import ModalDeleteServicePanel from '../../modals/panelcenter/modal_deleteServices';
import ModalValidationService from '../../modals/panelcenter/modal_addServiceValidation';


const PanelPrincipal = ({planesPorMes,mesNumero, planes, onRefreshOtro}) => {

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


    return ( 
        <div className="containerPanel1">
            <div className="container-table">
                <center>{planesPorMes && planesPorMes[0] ? `Servicios del mes de ${nombreMes}, Plan: ${planesPorMes[0].nombre_plan}` : ', sin plan asignado'}
                    < ButtonAdd ModalComponent = {AddModalServiciosMes} 
                                category={{planes, mesNumero, planesPorMes}} 
                                size='sm' 
                                value={'Nuevo Servicio +'}
                                onRefreshOtro={onRefreshOtro}   // ✅ pasamos la prop
                    />
                </center>
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
                                           <ButtonAdd 
                                              ModalComponent = {ModalValidationService}
                                              category={pdp}
                                              value={<i className="fa fa-pencil" aria-hidden="true"></i>} 
                                              size="sm" title={'Editar Servicios'}
                                              styleColor= 'success'
                                           />
                                       
                                           <ButtonUpdate 
                                              ModalCategoriesUpdate = {ModalUpdateServices}
                                              category={pdp}
                                              value={<i className="fa fa-pencil" aria-hidden="true"></i>} 
                                              size="sm" title={'Editar Servicios'}
                                           />
                                        
                                           <ButtonDelete 
                                              ModalCategoriesDelete = {ModalDeleteServicePanel}
                                              category={pdp.id_payment}
                                              value={<i className="fa fa-pencil" aria-hidden="true"></i>} 
                                              size="sm" title={'Editar Servicios'}
                                           />
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