import React, { useState } from 'react';

// css Login
import "../styles/login.css";

// Animation
import Seccion_login from '../styles/styles-animation/login/section';

const Login = () => {
    // Manejar la visibilidad del formulario usando el estado
    const [showLogin, setShowLogin] = useState(true);

    const registro_form = (event) => {
        event.preventDefault();
        setShowLogin(false); // Ocultar login y mostrar registro
    };

    const login_form = (event) => {
        event.preventDefault();
        setShowLogin(true); // Mostrar login y ocultar registro
    };

    return ( 
        <div className="principal">
            {showLogin ? (
                <div className='Container' id='login'>
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
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Password">Password</label>
                            <input className='password'
                                type="password"
                                placeholder='Contraseña'
                                name='contrasena'
                            />
                        </div>
                        <div className="btn-login">
                            <button className='btn-aceptar'>Aceptar</button>
                            <button className='btn-registro' onClick={registro_form}>Registro</button>
                        </div>
                    </form>
                    {/* Animacion */}
                    <Seccion_login />
                </div>
            ) : (
                <div className='Container' id='registro'>
                    <div className="title">
                        <p className='title-page'>AccuFinance</p>
                    </div>
                    <form action="" className='formulario-login-re'>
                        <div className="title-login">
                            <p className='title-login'>Registrate</p>
                        </div>
                        <div className="group-F">
                            <label htmlFor="Nombre">Nombre</label>
                            <input className='Nombre' 
                                type="text"
                                placeholder='Nombre'
                                name='Nombre'
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Apellidos">Apellidos</label>
                            <input className='Apellidos' 
                                type="text"
                                placeholder='Apellidos'
                                name='Apellidos'
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Email">Email</label>
                            <input className='Email' 
                                type="text"
                                placeholder='Email'
                                name='usuario'
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Password">Password</label>
                            <input className='password'
                                type="password"
                                placeholder='Contraseña'
                                name='contrasena'
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="verifi_Password">Verifica Password</label>
                            <input className='verifi_password'
                                type="password"
                                placeholder='Verifia Contraseña'
                                name='verifi_contrasena'
                            />
                        </div>
                        <div className="btn-login">
                            <button type="submit" className='btn-aceptar'>Aceptar</button>
                            <button className='btn-registro' onClick={login_form}>Login</button>
                        </div>
                    </form>
                    {/* Animacion */}
                    <Seccion_login />
                </div>
            )}
        </div>
    );
}
 
export default Login;
