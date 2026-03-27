import React, { useEffect, useState } from 'react';


//CSS
import '../../../styles/views/DeleteServicesPlanes.css'

// Datatable
import DataTable from "react-data-table-component"

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

    const { pagos, ingresos } = planesPorMes;

    const [filterText,setFilterText] = useState("");
    
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(); // te da algo como 22/04/2025
    };

    console.log('planesPorMes: ' , planesPorMes);
    // console.log('mesNumero: ' , mesNumero);
    // console.log('planes: ' , planes);

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // OJO: si mesNumero es string, conviértelo a número restando 1
    const nombreMes = meses[parseInt(mesNumero) - 1];
    

    //Hook de estado para ocultar y mostrar campos inputs
    // const [showCampos, setShowCampos] = useState(false);

   

    const showCampos = planesPorMes.pagos.length > 0;

    const filteredItems = pagos.filter((item) => 
        item.id_payment?.toString().includes(filterText.toLowerCase()) ||
        item.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.monto?.toString().includes(filterText.toLowerCase()) || 
        item.service_status.toLowerCase().includes(filterText.toLowerCase())
    )

    // console.log('planesPorMes completo:', planesPorMes);
    // console.log('dataIngresos:', planesPorMes[1]);
    
    // Recorremos array y sumamos solo lo que  dedia 1 al 15 
    const totalQ15na1 = pagos.reduce((sum1, pago) => {
        if (pago.dia_pago > 0  && pago.dia_pago <= 15) {
            return sum1 + Number(pago.monto || 0);
        }
        return sum1
    },0); //El cero es el valor inicial de reduce

    // Recorremos datos para sumar segunda quincena
    const totalQ15na2 = pagos.reduce((sum2, pago) => {
        if (pago.dia_pago >= 16  && pago.dia_pago <= 31) {
            return sum2 + Number(pago.monto || 0);
        }
        return sum2
    }, 0); //El cero es el valor inicial de reduce

    // Reduce es el que recorre un array y acumula en estec aso el monto y lo vamos sumando
    const totalMonto = pagos.reduce((acc, pago) => {
        return acc + Number(pago.monto || 0);
    }, 0); //El cero es el valor inicial de reduce


    const columnas = [
        {
            name: "ID",
            selector: row => row.id_payment,
            sortable: true,
            width: "80px"
        },
        {
            name: "Servicio",
            selector: row => row.nombre,
            sortable: true
        },
        {
            name: "Pago",
            selector: row => `$${Number(row.monto).toFixed(2)}`,
            sortable: true
        },
        {
            name: "Estado",
            sortable: true,
            selector: row => row.service_status,
        },
        {
            name: "Fecha de Pago",
            sortable: true,
            selector: row => formatDate(row.paid_at),
        },
        {
            name: "Fecha de Vencimiento",
            sortable: true,
            selector: row => `${row.dia_pago}/${row.mes}/${row.año}`,
        },
        {
            name: "Acciones",
            cell: (pdp) => (
            <div className="DeleteServicesPlanes-divcss">
                <ButtonAdd 
                ModalComponent={ModalValidationService}
                category={pdp}
                value={<i className="fa fa-check"></i>} 
                size="sm"
                title="Validar Servicios"
                styleColor="success"
                onRefreshOtro={onRefreshOtro}
                />

                <ButtonUpdate 
                ModalCategoriesUpdate={ModalUpdateServices}
                category={pdp}
                value={<i className="fa fa-pencil"></i>} 
                size="sm"
                title="Editar Servicios"
                getDataUpdate={getDataUpdate}
                />
                
                <ButtonDelete 
                ModalCategoriesDelete={ModalDeleteServicePanel}
                category={pdp}
                value={<i className="fa fa-trash"></i>} 
                size="sm"
                title="Eliminar Servicios"
                getDataDelete={getDataDelete}
                />
            </div>
            ),
        }
    ];
    return ( 
        <div className="containerPanel1">
            <div className="container-table">
                <div className="titlePanelPrincipal">
                    {pagos && pagos[0] ? `Servicios de ${nombreMes}, del Plan: ${pagos[0].nombre_plan}` : 'Selecciona un Mes'}
                </div>
                {showCampos && (
                    <div className="containerPanelPrincipalServices">
                        <div className="infoPanelPrincipal">
                            <div className="mb-3" id='Imensual'>
                                <label htmlFor="" className='form-label label'>Ingreso Mensual</label>
                                <input type="text"
                                    className='form-control input' 
                                    placeholder='Ingreso mensual'
                                    id='Ingreso_mensual'
                                    name='Ingreso_mensual'
                                    value={ingresos?.monthly_income ?? ''}
                                    onChange={() => {}}
                                    readOnly
                                />
                            </div>     
                        </div>
                        <div className="btnNuevoServicioPanelPrincipal">
                           
                            <div className="mt-4" id='Imensual'>
                            < ButtonAdd ModalComponent = {AddModalServiciosMes} 
                                        category={{planes, mesNumero, planesPorMes}} 
                                        size='sm' title={'Agregar Servicio'}
                                        value={'Nuevo Servicio +'}
                                        onRefreshOtro={onRefreshOtro}   // ✅ pasamos la prop
                            />
                            </div>
                        </div>

                    </div>
                )}
            </div>
            <div className="Myservices-tabla">
                <DataTable
                    columns={columnas}
                    data={filteredItems}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 20]}
                    highlightOnHover
                    striped
                    responsive
                    subHeader
                    subHeaderComponent={
                        <div 
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                        
                            {/* Totales */}
                            <div style={{ display: "flex", gap: "20px" }}>
                                <div><strong>1ra 15na:</strong> ${totalQ15na1.toFixed(2)}</div>
                                <div><strong>2da 15na:</strong> ${totalQ15na2.toFixed(2)}</div>
                                <div><strong>Mes:</strong> ${totalMonto.toFixed(2)}</div>
                            </div>

                            <input
                                type="text"
                                className="form-control"
                                style={{ width: "250px" }}
                                placeholder="Buscar..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>
                    }
                />
            </div>
        </div>
     );
}
 
export default PanelPrincipal;