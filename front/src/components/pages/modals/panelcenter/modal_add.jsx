import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal,Button } from 'react-bootstrap';
import useChoices from '../../../../utils/useChoices';

//Data del login
import {UserContext} from '../../../../contexts/UserContext';

const AddNewPlan = ({showModal, closeModal}) => {
    //Data login
    const {userData} = useContext(UserContext)

    //Select multiple
    const selectRef = useRef(null);
    useChoices(selectRef);

    //Estado de años 
    const [years, setYears] = useState([]);

    useEffect(()=> {
        const currentYear = new Date().getFullYear();
        const yearsOpcions = [];
        //Bucle de años
        for (let i = 0; i < 5; i++) {
           //Guardamos en el array los años
           yearsOpcions.push(currentYear + i);
        }

        setYears(yearsOpcions)
    }, [])

    return ( 
        <Modal show={showModal} onHide={closeModal}   dialogClassName="custom-modal" centered>
            <Modal.Header>
                <Modal.Title>Nuevo sistema de pagos.</Modal.Title>
            </Modal.Header>
            <form className='form_NewPanel'>
                <Modal.Body>
                    <div className="mb-3">
                        <input className='form-control input' type="text" value={userData?.id || '' } />
                    </div>
                    <div className="mb-3 d-flex">
                        <div className="col me-3">
                            <label htmlFor="Año" className='form-label label'>Selecciona un año</label>
                            <select name="Año" id="Año" className='form-control input'>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))

                                }
                            </select>
                        </div>
                        <div className="col">
                            <label htmlFor="Meses" className='form-label label '>Meses</label>
                            <select multiple ref={selectRef} name='Meses' id='Meses' className='form-control input'>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                            </select>
                        </div>
                    </div>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button>Cancelar</Button>
                    <Button>Crear</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default AddNewPlan;