import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

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

const AdminServices = ({titleModule}) => {

    const [mesesUnicos, setMeses] = useState([]);
    const [idpla, setIdplan] =useState(null)

    const getMesesYidplan = (meses,id_plan) => {
        // console.log('Meses:', meses);
        // console.log('ID Plan:', id_plan);
        //pasamos al hook de cambio de meses
        setMeses(meses)
        setIdplan(id_plan)
    }
   
    //hook de estado planes de pago optenidos por el mes
    const [planesPorMes, setplanesPorMes] = useState([])
    const [mesNumero, setmesNumero] = useState([])

    //funcion para porcesar el estado de planes de pago
    const Getplanes_de_pago = (planesdp, mes) => {
        // console.log('planesdp: '  , planesdp);
        
        //Pasamos al estado
        setplanesPorMes(planesdp);
        setmesNumero(mes);
    }

    return ( 
        <div className='containerPanel'>
            <div className="bodyHead">
                <div className="containerPanel-title">
                    <h2>{titleModule}</h2>
                </div>
                <div className="containerPanel_add">
                    <ButtonAdd ModalComponent={AddNewPlan} value={'Nuevo Plan'} />
                </div>
            </div>
            <div className="bodyPanelbox1">
                <div className="myservicesAdmin">
                    <Planes getMeses={getMesesYidplan} />
                </div>
                <div className="bodyExtras">
                    <MesesDePlanes meses={mesesUnicos} id_plan={idpla} Getplanes_de_pago={Getplanes_de_pago}/>
                </div>
            </div>
            <div className="bodyPanelbox2">
                <PanelPrincipal planesPorMes={planesPorMes} mesNumero={mesNumero}/>
            </div>
        </div>
     );
}
 
export default AdminServices;