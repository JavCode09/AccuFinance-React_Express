import { useState } from 'react';

//css
import '../../styles/views/PanelControl.css';

//Buttons
import ButtonAdd from '../../common/buttons/btn-add';

//Modales
import AddNewPlan from '../modals/panelcenter/modal_add';

//Vistas
import Planes from './subModules/planes';
import PanelPrincipal from './subModules/panelprincipal';
import MesesDePlanes from './subModules/planes_de_pago';


//Funciones
import { API_planes_de_pago } from '../../api/newSystemCpanle';


// Importante inicializa vacio todo los planes por Mes
const initialPlanesPorMes = {
  pagos: [],
  ingresos: null
};


const AdminServices = ({titleModule}) => {

    const [mesesUnicos, setMeses] = useState([]);
    const [NombrePlan, setNombrePlan] =useState(null)
    const [idpla, setIdplan] =useState(null)

    const getMesesYidplan = (meses,id_plan, nombrePlan) => {
        // console.log('Meses:', meses);
        // console.log('ID Plan:', id_plan);
        // console.log('nombrePlan:', nombrePlan);
        //pasamos al hook de cambio de meses
        setMeses(meses)
        setNombrePlan(nombrePlan)
        setIdplan(id_plan)
    }
   
    //hook de estado planes de pago optenidos por el mes
    const [planesPorMes, setPlanesPorMes] = useState(initialPlanesPorMes);

    const [mesNumero, setmesNumero] = useState([])
    const [planes, setplanes] = useState({ //Aqui se pasa el id_plan y nombre_plan en los ocmponetes
        id_plan: null,
        nombre_plan: ''
    });

    //funcion para porcesar el estado de planes de pago
    const Getplanes_de_pago = (planesdp, mes, id_plan, dataIngresos) => {
        // console.log('dataIngresos: '  , dataIngresos); //Objeto con varios datos de planes y planes_de_pago
        
        //Pasamos al estado
        setPlanesPorMes({
            pagos: planesdp,                 // array de servicios
            ingresos: dataIngresos?.[0] ?? null // solo el objeto de ingreso
        });
        setmesNumero(mes);
        setplanes({ id_plan });

    }

    const [refreshPlanes, setRefreshPlanes] = useState(false);

    //Recarga todos los Planes desde el plan anual general
    const getData = () => {
        // console.log("Se actualiza aqui");
        
        setRefreshPlanes(prev => !prev); // Cambia el valor a su opuesto para forzar la actualización
        
        // Limpia meses e id_plan si se eliminó un plan anual
        setMeses([]); // Limpiamos meses
        setIdplan(null); //Limpiamos idplan

        // Limpiamos campo servicios
        setPlanesPorMes(initialPlanesPorMes);

    };

    //Al actualizar los meses de un plan de pagos anual
    const updateInfo = (meses,id_plan) => {
        // console.log("Actualizar meses");
        
        // Limpia meses e id_plan si se eliminó un plan anual
        setMeses(meses) // Ontenemos por la prop los meses nuevos
        setIdplan(id_plan) // obtenemos el id_plan 
    }
     

    const updateInfoMeses = (meses,id_plan) => {
        // console.log('Meses:', meses);
        // console.log('ID Plan:', id_plan);
        
        // Limpia meses e id_plan si se eliminó un mes dentro de un plan
        setMeses(meses) // Ontenemos por la prop los meses nuevos
        setIdplan(id_plan) // obtenemos el id_plan 

        setPlanesPorMes(initialPlanesPorMes);
        // Limpia los servicios del panel
        setmesNumero(0);  // Limpia el número del mes
        setRefreshPlanes(prev => !prev);// ✅ Forzar que Planes recargue los datos desde la BD (meses)
    }

    // pero se unifico todo llamando a una sola funcion
    const onRefreshOtro = async({idplan, idUsuario, mesid}) => {
        // LLamamos la misma funcion del panel MesesDePlanes que ocupa para traer los datos de un plan espesiifco y lo mandanmos a panelPrincipal para renderizar
         const responseApiplanes = await API_planes_de_pago(idplan,idUsuario,mesid)

            if (responseApiplanes) {
                setPlanesPorMes({
                    pagos: responseApiplanes.data, //info de planes de pago inner varias tablas
                    ingresos: responseApiplanes.data2?.[0] ?? null //info de mes plan_monthly_income trae id_plan y monthly income mensual
                });

                setmesNumero(mesid);
                setplanes({ id_plan: idplan });
            }
        
    };

    // Recarga solo meses y servicios lo mismo que onRefreshOtro pero desde actualizacion y updateInfo no se pudo ocupar ya que ya existe funcion
    // por suerte tenemos getDataUpdate tambien en el boton actualizar
    const getDataUpdate = async ({ idplan, idUsuario, mesid }) => {
        const responseApiplanes = await API_planes_de_pago(idplan, idUsuario, mesid);

        if (responseApiplanes) {
            setPlanesPorMes({
                pagos: responseApiplanes.data, //info de planes de pago inner varias tablas
                ingresos: responseApiplanes.data2?.[0] ?? null //info de mes plan_monthly_income trae id_plan y monthly income mensual
            });

            setmesNumero(mesid);
            setplanes({ id_plan: idplan });
        }
    };

    const getDataDelete = async({idplan, idUsuario, mesid}) => {

        // LLamamos la misma funcion del panel MesesDePlanes que ocupa para traer los datos de un plan espesiifco y lo mandanmos a panelPrincipal para renderizar
         const responseApiplanes = await API_planes_de_pago(idplan,idUsuario,mesid)
            // console.log(responseApiplanes);
            if (responseApiplanes) {
                // console.log("Datos: " , responseApiplanes);
                
                //Pasamos al estado
                setPlanesPorMes({
                    pagos: responseApiplanes.data,
                    ingresos: responseApiplanes.data2?.[0] ?? null
                });
                
                setmesNumero(mesid);
                setplanes({ id_plan: idplan });
            }
    };


    return ( 
        <div className='containerPanel'>
            <div className="bodyHead">
                <div className="containerPanel-title">
                    <h2>{titleModule}</h2>
                </div>
                <div className="containerPanel_add">
                    <ButtonAdd ModalComponent={AddNewPlan} value={'Nuevo Plan'} getData={getData} />
                </div>
            </div>
            <div className="bodyPanelbox1">
                <div className="myservicesAdmin">
                    <Planes getMeses={getMesesYidplan} refresh={refreshPlanes} getData={getData} updateInfo={updateInfo}/>
                </div>
                <div className="bodyExtras">
                    <MesesDePlanes meses={mesesUnicos} NombrePlan={NombrePlan} id_plan={idpla} 
                                                        Getplanes_de_pago={Getplanes_de_pago} 
                                                        getDataUpdate={getDataUpdate}
                                                        getDataDelete={updateInfoMeses}
                    />
                </div>
            </div>
            <div className="bodyPanelbox2">
                <PanelPrincipal planesPorMes={planesPorMes} mesNumero={mesNumero} planes={planes} 
                                onRefreshOtro={onRefreshOtro} 
                                getDataUpdate={getDataUpdate}
                                getDataDelete={getDataDelete}
                />
            </div>
        </div>
     );
}
 
export default AdminServices;