import React from 'react';


//css Login
import "../styles/login.css";

// Animation
import Seccion_login from '../styles/styles-animation/login/section';

const Login = () => {
    return ( 
        <div className="principal">
            <div className='Container'>  
                <div className="title">
                    <p className='title-page'>AccuFinance</p>
                </div>
                <form action="" className='formulario-login'>
                    <div className="title-login">
                        <p className='title-login'>Login</p>
                    </div>
                    <div className="group-F">
                        <label htmlFor="Usuario">Usuario / Email</label>
                        <input className='usuario' 
                            type="text"
                            placeholder='Usuario / Email'
                            name='usuario'
                            value={FormData.usuario}
                        />
                    </div>
                    <div className="group-F">
                        <label htmlFor="Password">Password</label>
                        <input className='password'
                            type="password"
                            placeholder='Contraseña'
                            name='contrasena'
                            value={FormData.contrasena}
                        />
                    </div>
                    <div className="btn-login">
                        <button className='btn-aceptar'>Aceptar</button>
                        <button className='btn-registro'>Registro</button>
                    </div>
                </form>
                {/* Animacion */}
                <Seccion_login />
            </div>
        </div>
     );
}
 
export default Login;