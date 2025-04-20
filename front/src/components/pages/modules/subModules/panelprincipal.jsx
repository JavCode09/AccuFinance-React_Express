import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PanelPrincipal = () => {
    return ( 
        <div className="containerPanel1">
            <center>Tabla del mes corriendo o Por mes seleccionado</center>
            <table className='Myservices-tabla'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Descripcion</th>
                            <th>Monto $</th>
                            <th>Dias de pago</th>
                            {/* <th>Fecha inicial del servicio</th> */}
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                
                    </tbody>
                </table>
        </div>
     );
}
 
export default PanelPrincipal;