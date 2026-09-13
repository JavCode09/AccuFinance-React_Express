import { useContext, useEffect, useState } from 'react';

import { Button, Table } from 'react-bootstrap';

import '../../../styles/views/Planes.css';

// ================================================================
// INFORMACIÓN DE SESIÓN
// ================================================================

import { UserContext } from '../../../../contexts/UserContext';

// ================================================================
// BUTTONS
// ================================================================

import ButtonUpdate from '../../../common/buttons/btn-update';
import ButtonDelete from '../../../common/buttons/btn-delete';

// ================================================================
// MODALES
// ================================================================

import UpdateModalPlanes from '../../modals/panelcenter/modal_update';
import ModalDeletePlanAnual from '../../modals/panelcenter/modal_delete';

// ================================================================
// API
// ================================================================

import { API_selectPlanes } from '../../../api/newSystemCpanle';


const Planes = ({
    getMeses,
    refresh,
    getData,
    updateInfo,
    setTotalPlanes
}) => {


    // ================================================================
    // INFORMACIÓN DEL USUARIO
    // ================================================================

    const { userData } = useContext(UserContext);


    // ================================================================
    // ESTADO DE PLANES
    // ================================================================

    const [planes, setPlanes] = useState([]);


    // ================================================================
    // PLAN SELECCIONADO
    //
    // Lo utilizamos únicamente para darle feedback visual al usuario.
    // ================================================================

    const [planSeleccionado, setPlanSeleccionado] = useState(null);

    
    // ================================================================
    // OBTENER PLANES
    // ================================================================

    useEffect(() => {

        if (userData?.id) {

            const idUsuario = userData.id;

            APIselectPlanes(idUsuario);

        }

    }, [userData?.id, refresh]);


    // ================================================================
    // CONSULTAR PLANES
    // ================================================================

    const APIselectPlanes = async (idUsuario) => {

        try {

            const resultPlanes = await API_selectPlanes(idUsuario);

            setPlanes(resultPlanes.data);
            setTotalPlanes(resultPlanes.data.length);

        } catch (error) {

            console.error(
                "Error en la función:",
                error
            );

        }

    };


    // ================================================================
    // ACTUALIZAR PLANES
    // ================================================================

    const getDataUpdate = () => {

        if (userData?.id) {

            APIselectPlanes(userData.id);

        }

    };


    // ================================================================
    // ELIMINAR PLAN
    // ================================================================

    const getDataDelete = () => {

        if (userData?.id) {

            APIselectPlanes(userData.id);

        }

    };


    // ================================================================
    // SELECCIONAR PLAN
    // ================================================================

    const seleccionarPlan = (
        meses,
        id_plan,
        nombre_plan
    ) => {

        setPlanSeleccionado(id_plan);

        getMeses(
            meses,
            id_plan,
            nombre_plan
        );

    };


    // ================================================================
    // RENDER
    // ================================================================

    return (

        <div className="planes-container">
            {/* ========================================================
                HEADER INTERNO
                ======================================================== */}
            {/* <div className="planes-header">

                <div>

                    <span className="planes-count">

                        {planes.length}

                    </span>

                    <span className="planes-count-label">

                        {planes.length === 1
                            ? ' plan registrado'
                            : ' planes registrados'
                        }

                    </span>

                </div>

            </div> */}


            {/* ========================================================
                ESTADO VACÍO
                ======================================================== */}

            {planes.length === 0 ? (

                <div className="planes-empty">

                    <div className="planes-empty-icon">

                        <i className="fa fa-folder-open-o"></i>

                    </div>

                    <h4>
                        No hay planes registrados
                    </h4>

                    <p>
                        Crea un nuevo plan para comenzar
                        a administrar tus periodos financieros.
                    </p>

                </div>

            ) : (


                /* ====================================================
                   TABLA
                   ==================================================== */

                <div className="planes-table-container">

                    <Table
                        responsive
                        className="stylesTableAños"
                        hover
                    >

                        <thead>

                            <tr>

                                <th>
                                    Plan
                                </th>

                                <th>
                                    Año
                                </th>

                                <th className="column-actions">
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {planes.map((dataPlanes) => (

                                <tr
                                    key={dataPlanes.id_plan}
                                    className={
                                        planSeleccionado === dataPlanes.id_plan
                                            ? 'plan-selected'
                                            : ''
                                    }
                                >


                                    {/* =================================================
                                        NOMBRE
                                        ================================================= */}

                                    <td>

                                        <div className="plan-name">

                                            <div className="plan-icon">

                                                {/* <i className="fa fa-file-text-o"></i> */}

                                            </div>

                                            <div className="plan-name-text">

                                                <strong>

                                                    {dataPlanes.nombre_plan}

                                                </strong> 
                                                <br />
                                                <span>
                                                    Plan financiero
                                                </span>

                                            </div>

                                        </div>

                                    </td>


                                    {/* =================================================
                                        AÑO
                                        ================================================= */}

                                    <td>

                                        <span className="plan-year">

                                            {dataPlanes.año}

                                        </span>

                                    </td>


                                    {/* =================================================
                                        ACCIONES
                                        ================================================= */}

                                    <td>

                                        <div className="planes-divcss">


                                            {/* =========================================
                                                VER MESES
                                                ========================================= */}

                                            <Button

                                                size="sm"
                                                title="Ver meses"
                                                className={
                                                    planSeleccionado === dataPlanes.id_plan
                                                        ? 'plan-action plan-action-active'
                                                        : 'plan-action'
                                                }

                                                onClick={() =>
                                                    seleccionarPlan(
                                                        dataPlanes.meses,
                                                        dataPlanes.id_plan,
                                                        dataPlanes.nombre_plan
                                                    )
                                                }

                                                value={
                                                    <i
                                                        className="fa fa-calendar"
                                                        aria-hidden="true"
                                                    />
                                                }
                                            >
                                                
                                                <i
                                                    className="fa fa-calendar"
                                                    aria-hidden="true"
                                                />

                                            </Button>


                                            {/* =========================================
                                                EDITAR
                                                ========================================= */}

                                            <ButtonUpdate

                                                size="sm"

                                                title="Agregar o modificar meses"

                                                value={
                                                    <i
                                                        className="fa fa-pencil"
                                                        aria-hidden="true"
                                                    />
                                                }

                                                ModalCategoriesUpdate={
                                                    UpdateModalPlanes
                                                }

                                                category={
                                                    dataPlanes.id_plan
                                                }

                                                getDataUpdate={
                                                    getDataUpdate
                                                }

                                                updateInfo={
                                                    updateInfo
                                                }

                                            />


                                            {/* =========================================
                                                ELIMINAR
                                                ========================================= */}

                                            <ButtonDelete

                                                size="sm"

                                                title="Eliminar plan"

                                                value={
                                                    <i
                                                        className="fa fa-trash"
                                                        aria-hidden="true"
                                                    />
                                                }

                                                ModalCategoriesDelete={
                                                    ModalDeletePlanAnual
                                                }

                                                category={
                                                    dataPlanes
                                                }

                                                getDataDelete={
                                                    getDataDelete
                                                }

                                                getData={
                                                    getData
                                                }

                                            />

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>

                </div>

            )}

        </div>

    );

};


export default Planes;