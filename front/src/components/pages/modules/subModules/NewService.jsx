import React, { useEffect, useState } from 'react';

//css
import '../../../styles/views/NewService.css';

//componentes
import Search_bar from '../../../common/search_engines/search_bar';
import Button_add from '../../../common/buttons/btn-add'; //bootn add
import Button_update from '../../../common/buttons/btn-update';
import Button_delete from '../../../common/buttons/btn-delete';
// Modals
import Modal_newServices from '../../modals/newServices/modal_add'; //modal add

// API
import { select_services } from '../../../api/services';

const NuevoServicio = ({titleModule}) => { 

    //Creamos el estado para selet
    const [DataServicios,setDataServicios] = useState([]);

    useEffect(() => {
        const effectServicios = async() => {
            try {
                const getDataServicios = await select_services();
                setDataServicios(getDataServicios);
                console.log("Success");
                
            } catch (error) {
                console.log(error);
                
            }
        }
        effectServicios();
    },[])

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
                        <Button_add ModalComponent={Modal_newServices} />
                    </div>
            
            </div>
            <div className="NewServices-content">
                <table className='NewServices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Categoria</th>
                            <th>Servicio</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataServicios.map((dataServ) => (
                            <tr key={dataServ.id}>
                                <td>{dataServ.id}</td>
                                <td>{dataServ.nombre_categoria}</td>
                                <td>{dataServ.nombre}</td>
                                <td>
                                    <div className="btns_option_NewServices">
                                        <Button_update />
                                        <Button_delete />
                                    </div>
                                </td>
                            </tr>
                        ))}
                       
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NuevoServicio;
