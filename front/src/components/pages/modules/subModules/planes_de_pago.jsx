import { useContext, useEffect, useState } from 'react';

import { Table, Button } from 'react-bootstrap';

// ================================================================
// INFORMACIÓN DE SESIÓN
// ================================================================

import { UserContext } from '../../../../contexts/UserContext';

// ================================================================
// API
// ================================================================

import {
    API_planes_de_pago,
    APIestadosMeses
} from '../../../api/newSystemCpanle';

// ================================================================
// BUTTONS
// ================================================================

import ButtonDelete from '../../../common/buttons/btn-delete';
import ButtonUpdates from '../../../common/buttons/btn-update';

// ================================================================
// MODALES
// ================================================================

import ModalDeleteMeses from '../../modals/panelcenter/modal_deleteMeses';
import UpdateMesespanle from '../../modals/panelcenter/modal_updateMeses';

// ================================================================
// CSS
// ================================================================

import '../../../styles/views/MesesDePlanes.css';


const MesesDePlanes = ({
    meses,
    NombrePlan,
    id_plan,
    Getplanes_de_pago,
    getDataDelete,
    getDataUpdate
}) => {


    // ================================================================
    // INFORMACIÓN DEL USUARIO
    // ================================================================

    const { userData } = useContext(UserContext);

    const idUsuario = userData?.id;


    // ================================================================
    // NOMBRES DE LOS MESES
    // ================================================================

    const nombresMeses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];


    // ================================================================
    // ESTADOS
    // ================================================================

    const [mesesArray, setMesesArray] = useState([]);

    const [estadosMes, setEstadosmes] = useState([]);

    // Mes que actualmente está seleccionado
    const [mesSeleccionado, setMesSeleccionado] = useState(null);


    // ================================================================
    // PROCESAR MESES
    // ================================================================

    useEffect(() => {

        if (!meses || meses.length === 0) {

            setMesesArray([]);

            setEstadosmes([]);

            return;

        }


        let arrayConvertido = [];


        // ------------------------------------------------------------
        // Convertir JSON string a array
        // ------------------------------------------------------------

        if (typeof meses === 'string') {

            try {

                arrayConvertido = JSON.parse(meses);

            } catch (error) {

                console.error(
                    'Error parseando meses:',
                    error
                );

                arrayConvertido = [];

            }

        } else {

            arrayConvertido = meses;

        }


        // ------------------------------------------------------------
        // Ordenar Enero -> Diciembre
        // ------------------------------------------------------------

        arrayConvertido.sort(
            (a, b) => parseInt(a) - parseInt(b)
        );


        setMesesArray(arrayConvertido);


        // ------------------------------------------------------------
        // Obtener estados de los meses
        // ------------------------------------------------------------

        const functionEstadosMes = async () => {

            try {

                const resultMesesStado =
                    await APIestadosMeses(id_plan);

                setEstadosmes(
                    resultMesesStado.data || []
                );

            } catch (error) {

                console.error(
                    'Error obteniendo estados de meses:',
                    error
                );

            }

        };


        if (id_plan) {

            functionEstadosMes();

        }

    }, [meses, id_plan]);


    // ================================================================
    // OBTENER PLANES DE PAGO
    // ================================================================

    const API_planesPago = async (
        idplan,
        id_user,
        mes
    ) => {

        try {

            const responseApiplanes =
                await API_planes_de_pago(
                    idplan,
                    id_user,
                    mes
                );


            if (responseApiplanes) {

                // ----------------------------------------------------
                // Marcar mes seleccionado
                // ----------------------------------------------------

                setMesSeleccionado(
                    Number(mes)
                );


                // ----------------------------------------------------
                // Mandar información al PanelPrincipal
                // ----------------------------------------------------

                Getplanes_de_pago(
                    responseApiplanes.data,
                    mes,
                    id_plan,
                    responseApiplanes.data2
                );

            }

        } catch (error) {

            console.error(error);

            if (
                error.response &&
                error.response.status === 400
            ) {

                alert(
                    `${error.response.data.message}`
                );

            } else {

                alert(
                    'Ocurrió un error al obtener los servicios del mes.'
                );

            }

        }

    };


    // ================================================================
    // OBTENER NOMBRE DEL MES
    // ================================================================

    const getNombreMes = (mes) => {

        return (
            nombresMeses[
                parseInt(mes, 10) - 1
            ] || 'Mes inválido'
        );

    };


    // ================================================================
    // RENDER
    // ================================================================

    return (

        <div className="meses-container">

            {/* ========================================================
                CONTENIDO
                ======================================================== */}

            {mesesArray.length > 0 ? (

                <div className="meses-table-container">

                    <Table
                        className="stylesTableMeses"
                        hover
                    >

                        {/* =================================================
                            HEADER TABLA
                            ================================================= */}

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Mes
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th className="meses-column-actions">
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        {/* =================================================
                            CUERPO
                            ================================================= */}

                        <tbody>

                            {mesesArray.map(
                                (mes, index) => {

                                    const estado =
                                        estadosMes.find(
                                            e =>
                                                Number(e.month) ===
                                                Number(mes)
                                        );


                                    const nombreMes =
                                        getNombreMes(mes);


                                    return (

                                        <tr

                                            key={index}

                                            className={
                                                mesSeleccionado ===
                                                Number(mes)
                                                    ? 'mes-selected'
                                                    : ''
                                            }

                                        >


                                            {/* --------------------------------
                                                NÚMERO
                                                -------------------------------- */}

                                            <td>

                                                <span className="mes-number">

                                                    {index + 1}

                                                </span>

                                            </td>


                                            {/* --------------------------------
                                                MES
                                                -------------------------------- */}

                                            <td>

                                                <div className="mes-name">

                                                    <div className="mes-calendar-icon">

                                                        <i className="fa fa-calendar-o"></i>

                                                    </div>

                                                    <strong>
                                                        {nombreMes}
                                                    </strong>

                                                </div>

                                            </td>


                                            {/* --------------------------------
                                                ESTADO
                                                -------------------------------- */}

                                            <td>

                                                <span
                                                    className={
                                                        `mes-status ${
                                                            estado?.name
                                                                ? estado.name
                                                                    .toLowerCase()
                                                                    .replace(
                                                                        /\s+/g,
                                                                        '-'
                                                                    )
                                                                : 'sin-estado'
                                                        }`
                                                    }
                                                >

                                                    <span className="status-dot"></span>

                                                    {estado?.name ||
                                                        'Sin estado'}

                                                </span>

                                            </td>


                                            {/* --------------------------------
                                                ACCIONES
                                                -------------------------------- */}

                                            <td>

                                                <div className="buttonsstylesTableMeses">


                                                    {/* ==========================
                                                        VER SERVICIOS
                                                        ========================== */}

                                                    <Button

                                                        size="sm"

                                                        title="Ver servicios"

                                                        className={
                                                            mesSeleccionado ===
                                                            Number(mes)
                                                                ? 'mes-action mes-action-active'
                                                                : 'mes-action'
                                                        }

                                                        onClick={() =>
                                                            API_planesPago(
                                                                id_plan,
                                                                userData?.id,
                                                                mes
                                                            )
                                                        }

                                                    >

                                                        <i
                                                            className="fa fa-eye"
                                                            aria-hidden="true"
                                                        />

                                                    </Button>


                                                    {/* ==========================
                                                        EDITAR
                                                        ========================== */}

                                                    <ButtonUpdates

                                                        ModalCategoriesUpdate={
                                                            UpdateMesespanle
                                                        }

                                                        title="Editar mes"

                                                        value={
                                                            <i
                                                                className="fa fa-pencil"
                                                                aria-hidden="true"
                                                            />
                                                        }

                                                        size="sm"

                                                        category={{

                                                            id_plan,

                                                            mes,

                                                            nombreMes

                                                        }}

                                                        getDataUpdate={
                                                            getDataUpdate
                                                        }

                                                    />


                                                    {/* ==========================
                                                        ELIMINAR
                                                        ========================== */}

                                                    <ButtonDelete

                                                        ModalCategoriesDelete={
                                                            ModalDeleteMeses
                                                        }

                                                        title="Eliminar mes"

                                                        value={
                                                            <i
                                                                className="fa fa-trash"
                                                                aria-hidden="true"
                                                            />
                                                        }

                                                        size="sm"

                                                        category={{

                                                            mes,

                                                            idUsuario,

                                                            id_plan,

                                                            NombrePlan,

                                                            nombreMes

                                                        }}

                                                        getDataDelete={
                                                            getDataDelete
                                                        }

                                                    />

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                }

                            )}

                        </tbody>

                    </Table>

                </div>

            ) : (

                /* ====================================================
                   ESTADO VACÍO
                   ==================================================== */

                <div className="meses-empty">

                    <div className="meses-empty-icon">

                        <i className="fa fa-calendar-o"></i>

                    </div>

                    <h4>
                        No hay periodos disponibles
                    </h4>

                    <p>
                        Selecciona un plan que tenga
                        meses configurados para comenzar.
                    </p>

                </div>

            )}

        </div>

    );

};


export default MesesDePlanes;