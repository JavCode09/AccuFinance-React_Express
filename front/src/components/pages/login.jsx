import React, { useState } from 'react';

// css Login
import "../styles/login.css";

// Animation
import Seccion_login from '../styles/styles-animation/login/section';

// APIs
import { add_registro } from '../api/registro_login';

const Login = () => {
    // Manejar la visibilidad del formulario usando el estado
    const [showLogin, setShowLogin] = useState(true);

    // Estado para maniupular los registros
    const [addRegistro, setRegistro] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        verificar_password: ''
    });

    // Estado para maniupular los login
    const [addLogin, setLogin] = useState({
        usuario: '',
        contrasena: ''

    });

    const registro_form = (event) => {
        event.preventDefault();
        setShowLogin(false); // Ocultar login y mostrar registro
    };

    const login_form = (event) => {
        event.preventDefault();
        setShowLogin(true); // Mostrar login y ocultar registro
    };


    //handleChange
    const handleChange = (e) => {
        const {name, value} = e.target;
        setRegistro({
            ...addRegistro, // Mantiene los otros valores del formulario
            [name]: value // Actualiza el campo que está cambiando
        })
    }

    //funcion registro_add
    const registro_add = async(e) => {
        e.preventDefault();

        if (addRegistro.password === "" || addRegistro.verificar_password === "" || addRegistro.nombre === "" || addRegistro.apellidos === ""
            || addRegistro.email === ""
        ) {
            console.log("Datos incompletos");
            return;
            
        }

        if (addRegistro.password !== addRegistro.verificar_password) {
            console.log("Error, Las contraseñas no coinciden");
            return;
            
        }

        try {
            const call_query = await add_registro(addRegistro);
            console.log("Registro Exitoso: ", call_query);
            alert("Registro Exitoso: ", call_query);

            // Limpiar el formulario después del registro exitoso
            setRegistro({
                nombre: '',
                apellidos: '',
                email: '',
                password: '',
                verificar_password: ''
            });
            
            // Pasamos a login
            setShowLogin(true); // Mostrar login y ocultar registro
            
        } catch (error) {
            console.log("Erro en la peticion API, Registro");
            
        }
    }

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
                                type="email"
                                placeholder='Usuario / Email'
                                name='usuario'
                                value={addRegistro.usuario || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Password">Password</label>
                            <input className='password'
                                type="password"
                                placeholder='Contraseña'
                                name='contrasena'
                                value={addRegistro.contrasena || ''}
                                onChange={handleChange}
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
                    <form action="" className='formulario-login-re' onSubmit={registro_add}>
                        <div className="title-login">
                            <p className='title-login'>Registrate</p>
                        </div>
                        <div className="group-F">
                            <label htmlFor="Nombre">Nombre</label>
                            <input className='Nombre' 
                                type="text"
                                placeholder='Nombre'
                                name='nombre'
                                value={addRegistro.nombre || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Apellidos">Apellidos</label>
                            <input className='Apellidos' 
                                type="text"
                                placeholder='Apellidos'
                                name='apellidos'
                                value={addRegistro.apellidos || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Email">Email</label>
                            <input className='Email' 
                                type="text"
                                placeholder='Email'
                                name='email'
                                value={addRegistro.email || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="Password">Password</label>
                            <input className='password'
                                type="password"
                                placeholder='Contraseña'
                                name='password'
                                value={addRegistro.password || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="group-F">
                            <label htmlFor="verifi_Password">Verifica Password</label>
                            <input className='verifi_password'
                                type="password"
                                placeholder='Verifica Contraseña'
                                name='verificar_password'
                                value={addRegistro.verificar_password || ''}
                                onChange={handleChange}
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
