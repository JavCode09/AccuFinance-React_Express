import React from 'react';

//css
import '../../styles/views/PanelControl.css';

//Buttons
import ButtonAdd from '../../common/buttons/btn-add';

//Modales
import AddNewPlan from '../modals/panelcenter/modal_add';

//Vistas
import Planes from './subModules/planes';
import PanelPrincipal from './subModules/panelprincipal';

const AdminServices = ({titleModule}) => {
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
                    <Planes />
                </div>
                <div className="bodyExtras">
                    Plan por mes sobre el del año seleccionado
                </div>
            </div>
            <div className="bodyPanelbox2">
                <PanelPrincipal />
            </div>
        </div>
     );
}
 
export default AdminServices;