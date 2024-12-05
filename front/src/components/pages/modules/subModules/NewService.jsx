import React from 'react';

//componentes
import Search_bar from '../../../common/search_engines/search_bar';
import Button_add from '../../../common/buttons/btn-add'; //bootn add
import Modal_newServices from '../../modals/newServices/modal_add'; //modal add

//css
import '../../../styles/views/NewService.css';


const NuevoServicio = ({titleModule}) => {



    return (
        <div className="NewServices-container">
            <div className="NewServices-title">
                <h2>{titleModule}</h2>
            </div>
           <div className="NewServices-option">

                <div className="NewServices-search">
                  <Search_bar />
                </div>
                <div className="NewServices-btns">
                    {/* componente */}
                    <Button_add ModalComponent = {Modal_newServices}/>
                </div>
           
           </div>
           <div className="NewServices-content">
                <table>
                    <thead>
                        <tr>
                            <th>Titulo1</th>
                            <th>Titulo2</th>
                            <th>Titulo3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Data1</td>
                            <td>Data2</td>
                            <td>Data3</td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </div>
    );
};

export default NuevoServicio;
