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
    // const [showCampos, setShowCampos] = useState(false);

   

    // const showCampos = planesPorMes.pagos.length > 0;
    const showCampos = Boolean(mesNumero);

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

            {/* =====================================================
                HEADER DEL PANEL DE SERVICIOS
            ====================================================== */}

            <div className="panel-services-header">

                <div className="panel-services-title">

                    <div className="panel-services-icon">
                        <i className="fa fa-credit-card"></i>
                    </div>

                    <div>

                        <h3>
                            {pagos && pagos[0]
                                ? `Servicios de ${nombreMes}`
                                : 'Servicios del periodo'
                            }
                        </h3>

                        <span>
                            {pagos && pagos[0]
                                ? `Plan: ${pagos[0].nombre_plan}`
                                : 'Selecciona un mes para consultar sus servicios'
                            }
                        </span>

                    </div>

                </div>

                {showCampos && (

                    <div className="panel-services-count">

                        <strong>
                            {pagos.length}
                        </strong>

                        <span>
                            {pagos.length === 1
                                ? ' servicio'
                                : ' servicios'
                            }
                        </span>

                    </div>

                )}

            </div>


            {/* =====================================================
                INFORMACIÓN DEL PERIODO
            ====================================================== */}

            {showCampos && (

                <div className="panel-services-info">

                    {/* Ingreso mensual */}

                    <div className="monthly-income">

                        <div className="monthly-income-icon">
                            <i className="fa fa-money"></i>
                        </div>

                        <div>

                            <span className="info-label">
                                Ingreso mensual
                            </span>

                            <strong className="info-value">
                                ${Number(
                                    ingresos?.monthly_income ?? 0
                                ).toLocaleString(
                                    'es-MX',
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* Nuevo servicio */}

                    <div className="panel-new-service">

                        <ButtonAdd
                            ModalComponent={AddModalServiciosMes}
                            category={{
                                planes,
                                mesNumero,
                                planesPorMes
                            }}
                            size="sm"
                            title="Agregar Servicio"
                            value={
                                <>
                                    <i className="fa fa-plus"></i>
                                    <span>Nuevo Servicio</span>
                                </>
                            }
                            onRefreshOtro={onRefreshOtro}
                        />

                    </div>

                </div>

            )}


            {/* =====================================================
                RESUMEN FINANCIERO
            ====================================================== */}

            {showCampos && (

                <div className="financial-summary">

                    {/* Primera quincena */}

                    <div className="summary-card">

                        <div className="summary-icon">
                            <i className="fa fa-calendar"></i>
                        </div>

                        <div className="summary-content">

                            <span>
                                1ª quincena
                            </span>

                            <strong>
                                ${totalQ15na1.toLocaleString(
                                    'es-MX',
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* Segunda quincena */}

                    <div className="summary-card">

                        <div className="summary-icon">
                            <i className="fa fa-calendar"></i>
                        </div>

                        <div className="summary-content">

                            <span>
                                2ª quincena
                            </span>

                            <strong>
                                ${totalQ15na2.toLocaleString(
                                    'es-MX',
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* Total mensual */}

                    <div className="summary-card summary-card-total">

                        <div className="summary-icon">
                            <i className="fa fa-line-chart"></i>
                        </div>

                        <div className="summary-content">

                            <span>
                                Total del mes
                            </span>

                            <strong>
                                ${totalMonto.toLocaleString(
                                    'es-MX',
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================================
                TABLA DE SERVICIOS
            ====================================================== */}

            <div className="Myservices-tabla">

                <DataTable

                    columns={columnas}

                    data={filteredItems}

                    pagination

                    paginationPerPage={5}

                    paginationRowsPerPageOptions={[
                        5,
                        10,
                        20
                    ]}

                    highlightOnHover

                    striped

                    responsive

                    subHeader

                    subHeaderComponent={

                        <div className="services-table-toolbar">

                            <div className="services-table-title">

                                <i className="fa fa-list"></i>

                                <span>
                                    Servicios registrados
                                </span>

                            </div>


                            <div className="services-search">

                                <i className="fa fa-search"></i>

                                <input
                                    type="text"
                                    placeholder="Buscar servicio..."
                                    value={filterText}
                                    onChange={(e) =>
                                        setFilterText(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>
                    }

                />

            </div>

        </div>

    );
}
 
export default PanelPrincipal;