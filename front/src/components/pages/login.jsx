import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

// css Login
import styles from "../styles/Login.module.css";

// Animation
import Seccion_login from '../styles/styles-animation/login/section';

// APIs
import { add_registro, SelectLogin } from '../api/registro_login';

const Login = () => {
    // Manejar la visibilidad del formulario usando el estado
    const [showLogin, setShowLogin] = useState(true);

    // Estado para maniupular los registros
    const [addRegistro, setRegistro] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        password: '',
        verificar_password: ''
    });

    // Estado para maniupular los login
    const [addLogin, setLogin] = useState({
        usuario: '',
        contrasena: ''

    });

    // Estados para validar pasword en tiempo real
    const [errorPassword, setErrorPassword] = useState(""); //Mensaje de eror o valido
    const [passwordValid, setPasswordValid] = useState(false); // Status true o false


    const registro_form = (event) => {
        event.preventDefault();
        setShowLogin(false); // Ocultar login y mostrar registro

        setRegistro({
            nombre: '',
            apellidos: '',
            email: '',
            password: '',
            verificar_password: ''
        })
    };

    const login_form = (event) => {
        event.preventDefault();
        setShowLogin(true); // Mostrar login y ocultar registro

        setLogin({
            usuario: '',
            contrasena: ''
        });
    };


    //handleChange
    const handleChange = (e) => {
        const {name, value} = e.target;
        setRegistro({
            ...addRegistro, // Mantiene los otros valores del formulario
            [name]: value // Actualiza el campo que está cambiando
        })

        if (name === "password") {

            // 1. Validar primer caracter
            if (!value) {
                setErrorPassword("");
                setPasswordValid(false);
                return;
            }

            if (!/^[A-Za-z]/.test(value)) {
                setErrorPassword("Inicia con una letra mayúscula");
                setPasswordValid(false);
                return;
            }

            if (!/^[A-Z]/.test(value)) {
                setErrorPassword("Inicia con una letra mayúscula");
                setPasswordValid(false);
                return;
            }

            // 2. Solo letras y números
            if (!/^[A-Za-z0-9]+$/.test(value)) {
                setErrorPassword("Solo se permiten letras y números");
                setPasswordValid(false);
                return;
            }

            // 3. Longitud mínima
            if (value.length < 8) {
                setErrorPassword("Mínimo 8 caracteres");
                setPasswordValid(false);
                return;
            }

            // ✅ Todo correcto
            setErrorPassword("Contraseña válida");
            setPasswordValid(true);
        }
    }

    // Para el login form
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLogin({
            ...addLogin, // Mantiene los otros valores del login
            [name]: value // Actualiza el campo que está cambiando
        });
    }


    //funcion registro_add
    const registro_add = async(e) => {
        e.preventDefault();

        if (addRegistro.password === "" || 
            addRegistro.verificar_password === "" || 
            addRegistro.nombre === "" || 
            addRegistro.apellido_paterno === "" ||
            addRegistro.apellido_materno === "" || 
            addRegistro.email === ""
        ) {
            console.log("Datos incompletos");
            return;
            
        }

        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; //Acepta letras y acentos y ñ y espacios

        // Validamos que el campo nombre, apellidos sean unicapmente acepten letras
        if (!soloLetras.test(addRegistro.nombre)) {
            console.log("El campo nombre solo permite letras");
            return;
        }

        if (!soloLetras.test(addRegistro.apellido_paterno)) {
            console.log("El campo apellido paterno solo permite letras");
            return;
        }

        if (!soloLetras.test(addRegistro.apellido_materno)) {
            console.log("El campo apellido materno solo permite letras");
            return;
        }


        if (!/^[A-Z]/.test(addRegistro.password)) {
            setErrorPassword("La password debe iniciar con una letra mayúscula");
            setPasswordValid(false);
           return;
        }

        // 2. Solo letras y números
        if (!/^[A-Za-z0-9]+$/.test(addRegistro.password)) {
            setErrorPassword("En la password solo se permiten letras y números");
            setPasswordValid(false);
            return;
        }

        // Tamaño de contraseña
        if (addRegistro.password.length < 8) {
            console.log("La password debe de tener al menos 8 caracteres");
            return;
        }

            
        if (addRegistro.password !== addRegistro.verificar_password) {
            console.log("Error, Las contraseñas no coinciden");
            return;      
        }

        try {
            const call_query = await add_registro(addRegistro);
            console.log("Mensaje: ", call_query);

            alert(call_query.message);
            
            // Limpiar el formulario después del registro exitoso
            setRegistro({
                nombre: '',
                apellido_paterno: '',
                apellido_materno:'',
                email: '',
                password: '',
                verificar_password: ''
            });
            
            // Pasamos a login
            setShowLogin(true); // Mostrar login y ocultar registro
            
        } catch (error) {
            // console.log(error);

            if (error.status === 400) {
                alert(error.message);
            } else if (error.status === 409) {
                alert(error.message);
            } else {
                console.error(error);
            }
        }
    }

    // Llamada a la API 
    const LoginSystem = async(e) =>{
        e.preventDefault();

        if (addLogin.usuario === "" || addLogin.contrasena === "") {
            console.log("Campos vacíos");
            alert("Por favor, llena ambos campos.");
            return;
        }
        
        
        try {
            // Llamada a la función SelectLogin
            const loginStart = await SelectLogin(addLogin);
    
            // Verificación si el login fue exitoso o no
            if (loginStart.success) {
                // console.log("Login exitoso:", loginStart.usuario);
                // console.log("Login token JWT:", loginStart.token);

                // Redirigir a la ruta protegida
                window.location.href = '/main'; // Cambia '/ruta-protegida' a la ruta que desees
                alert("Login exitoso");
            } else {
                // Manejo de error en login (por ejemplo, usuario o contraseña incorrecta)
                console.log("Error en el login:", loginStart.message);
                alert(loginStart.message);  // Mostrar el mensaje de error del servidor
            }
            
        } catch (error) {
            console.log("Error en la petición API, Login");
            alert("Ocurrió un error en la conexión con el servidor. Inténtalo más tarde.");
        }
    }
    

    return ( 
        <div className={styles.container}>
            {showLogin ? (
                <div className={styles.Container} id='login'>
                    <div className={styles.title}>
                        <p className={styles.titlePage}>AccuFinance</p>
                        <p className={styles.SubTitle}>
                            Precisión y Control en la Gestión de tus Finanzas
                        </p>
                    </div>
                    <form className={styles.formularioLoginRe} onSubmit={LoginSystem}>
                        <div className={`${styles.titleLogin} ${styles.full}`}>
                            <p className='title-login'>INICIA SESION</p>
                        </div>
                        <div className={`${styles.groupF} ${styles.full}`}>
                            <label htmlFor="Usuario" className={styles.label}>Email</label>
                            <input className={styles.input} 
                                type="email"
                                placeholder='Correo Electronico'
                                name='usuario'
                                value={addLogin.usuario || ''}
                                onChange={handleLoginChange}
                            />
                        </div>
                       <div className={`${styles.groupF} ${styles.full}`}>
                            <label htmlFor="Password" className={styles.label}>Password</label>
                            <input className={styles.input}
                                type="password"
                                placeholder='Contraseña'
                                name='contrasena'
                                value={addLogin.contrasena || ''}
                                onChange={handleLoginChange}
                            />
                        </div>
                        <div className={`${styles.btnLogin} ${styles.full}`}>
                            <Button type='submit' variant='success' className=' m-1 w-100'>Ingresar</Button>
                            <Button variant='link' className=' m-1 w-100 text-warning' onClick={registro_form}>Registro</Button>
                        </div>
                    </form>
                    {/* Animacion */}
                    <Seccion_login />
                </div>
            ) : (
                <div className={styles.Container} id='registro'>
                    <div className={styles.title}>
                        <p className={styles.titlePage}>AccuFinance</p>
                        <p className={styles.SubTitle}>
                            Precisión y Control en la Gestión de tus Finanzas
                        </p>
                    </div>
                    <form action="" className={styles.formularioLoginRe} onSubmit={registro_add}>
                        <div className={`${styles.titleLogin} ${styles.full}`}>
                            <p className={styles.titleLogin}>REGISTRO</p>
                        </div>
                        <div className={`${styles.btnLogin} ${styles.full}`}>
                            <label htmlFor="nombre" className={styles.label} >Nombre</label>
                            <input className={styles.input} 
                                type="text"
                                placeholder='Nombre'
                                name='nombre'
                                value={addRegistro.nombre || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.groupF}>
                            <label htmlFor="apellido_paterno" className={styles.label}>Apellido Paterno</label>
                            <input className={styles.input} 
                                type="text"
                                placeholder='Apellido Paterno'
                                name='apellido_paterno'
                                value={addRegistro.apellido_paterno || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.groupF}>
                            <label htmlFor="apellido_materno" className={styles.label}>Apellido Materno</label>
                            <input className={styles.input} 
                                type="text"
                                placeholder='Apellido Materno'
                                name='apellido_materno'
                                value={addRegistro.apellido_materno || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${styles.btnLogin} ${styles.full}`}>
                            <label htmlFor="Email" className={styles.label}>Email</label>
                            <input className={styles.input} 
                                type="email"
                                placeholder='Email'
                                name='email'
                                value={addRegistro.email || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.groupF}>
                            <label htmlFor="Password" className={styles.label}>Password</label>
                            <input className={styles.input} 
                                type="password"
                                placeholder='Contraseña'
                                name='password'
                                value={addRegistro.password || ''}
                                onChange={handleChange}
                            />
                            {errorPassword && (
                                <span
                                    style={{ 
                                        color: passwordValid ? '#2bff00' : '#F7B801', 
                                        fontSize: '15px', 
                                        marginTop: '5px' 
                                    }}
                                >
                                    {errorPassword}
                                </span>
                            )}
                        </div>
                        <div className={styles.groupF}>
                            <label htmlFor="verifi_Password" className={styles.label}>Verifica Password</label>
                            <input className={styles.input} 
                                type="password"
                                placeholder='Verifica Contraseña'
                                name='verificar_password'
                                value={addRegistro.verificar_password || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${styles.btnLogin} ${styles.full}`}>
                            <Button  variant="success" type="submit" className='m-1 w-100'>Registrar</Button>
                            <Button type='button' variant="link" className='m-1 w-100 text-warning' onClick={login_form}>  Ya tengo cuenta  </Button>
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
