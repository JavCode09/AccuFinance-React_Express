import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

//Jquery y select2
import $, { initSelect2, destroySelect2 }  from '../../../../utils/jqueryYselect2';

const ModalUpdateServices = ({showModal_Update , closeModal_update , category}) => {
    //Selector de estado
    const Estados = useRef();

    // console.log(category);
    // Agregamos variables y guardamos informacion 
    // Creamos el estado que contendra la info de category
    const [DataCategory, setDataCategory] = useState({
        id_payment: "",
        monto: "",
        service_status: "",
        paid_at:"",
        due_date:""
    })

    useEffect(() => {

        if (category) {
            setDataCategory({
                id_payment: category.id_payment || "",
                monto: category.monto || "",
                service_status: category.service_status || "" ,
                paid_at: category.paid_at || "",
                due_date: category.due_date || ""
            })
        }

        // Mandamos cada cajita y instrucciones (detalles) como un placeholder
        initSelect2(Estados, {placeholder:"Selecciona un estado"});

         //Cambio manual en el estado
        $(Estados.current).on('change', (e) => {
            const valueRef = $(e.target).val();
            setDataCategory(prev => ({
                ...prev,
                service_status:valueRef
            }))
        })

        //  cerramos modal destruye las referencias a los select entrando al return
        return () => {
            $(Estados.current).off('change');
            destroySelect2(Estados);
        };      

    },[showModal_Update])
    
    //Para las fechas
    const fechaDate = (fechaT) => {
        if (!fechaT) return "";
        return fechaT.split("T")[0]; // "2025-09-30"
    }

    //Funciona de cambio de datos en el formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setDataCategory({
            ...DataCategory , [name]: value
        })
    }

    const API_UbdateService = (e) => {
        e.preventDefault();

        if (isNaN(DataCategory.monto) || DataCategory.monto === '') {
            alert("El campo 'Monto' debe ser un número");
            return;
        }

        console.log("Entro a la funcion");
        console.log("Data actualizada: " , DataCategory);
        //Precesamos la informacion al back
        
    }


    return ( 
        <Modal show={showModal_Update} onHide={closeModal_update}>
            <Modal.Header closeButton>
                <Modal.Title>Actualiza tu servicio</Modal.Title>
            </Modal.Header>
            <form onSubmit={API_UbdateService}>
                <Modal.Body>
                    <div className="mb-3">
                        <input type="hidden"
                            id='id_payment'
                            name='id_payment'
                            placeholder='Aqui va el id unico'
                            value={DataCategory.id_payment}
                            className='form-control input'
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="monto" className='form-label label'>Monto a pagar</label>
                        <input type="number" 
                            min="0"   // para evitar números negativos
                            step="0.01" // si quieres decimales
                            id='monto' 
                            name='monto'
                            placeholder='Monto a pagar'
                            value={DataCategory.monto}
                            className='form-control input'
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="service_status" className='form-label label'>Estado</label>
                        <select name="service_status" id="service_status" required
                                className='form-select mb-3'
                                value={DataCategory.service_status}
                                ref={Estados}
                                onChange={handleChange}
                                
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="paid_at" className='form-label label'>Fecha de pago</label>
                        <input type="date"
                            id='paid_at' 
                            name='paid_at'
                            placeholder='Monto a pagar'
                            value={DataCategory.paid_at}
                            className='form-control input'
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="due_date" className='form-label label'>Fecha de vencimiento</label>
                        <input type="date"
                            id='due_date' 
                            name='due_date'
                            placeholder='Monto a pagar'
                            value={fechaDate(DataCategory.due_date)}
                            className='form-control input'
                            onChange={handleChange}
                        />                              
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal_update}>Cancelar</Button>
                    <Button variant='primary' type='submit'>Actualizar</Button>
                </Modal.Footer>
            </form>
        </Modal>
     );
}
 
export default ModalUpdateServices;