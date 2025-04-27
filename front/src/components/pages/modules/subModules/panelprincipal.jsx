import React from 'react';
import { Button } from 'react-bootstrap';


const PanelPrincipal = ({planesPorMes,mesNumero}) => {

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(); // te da algo como 22/04/2025
    };

    // console.log('planesPorMes: ' , planesPorMes);
    
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // OJO: si mesNumero es string, conviértelo a número restando 1
    const nombreMes = meses[parseInt(mesNumero) - 1];


    return ( 
        <div className="containerPanel1">
            <center>Tus planes de pago, {nombreMes}</center>
            <table className='Myservices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Pago</th>
                            <th>Estado</th>
                            <th>Fecha de Pago</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {
                            planesPorMes.map((pdp)=>(
                                <tr key={pdp.id_payment}>
                                    <td>{pdp.id_payment}</td>
                                    <td>{pdp.nombre}</td>
                                    <td>${pdp.monto}</td>
                                    <td>{pdp.service_status}</td>
                                    <td>{formatDate(pdp.paid_at)}</td>
                                    <td>{formatDate(pdp.due_date)}</td>
                                    <td>Opciones</td>
                                </tr>
                            ))
                        }
                       
                            
                    </tbody>
                </table>
        </div>
     );
}
 
export default PanelPrincipal;