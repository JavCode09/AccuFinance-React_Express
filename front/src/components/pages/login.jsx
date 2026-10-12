import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

// css Login
import styles from "../styles/Login.module.css";

// Animation
import LoginWaves from '../styles/styles-animation/login/section';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState("");
    const [formMessageType, setFormMessageType] = useState("error");


    const registro_form = (event) => {
        event.preventDefault();
        setShowLogin(false); // Ocultar login y mostrar registro
        setFormMessage("");
        setErrorPassword("");
        setPasswordValid(false);

        setRegistro({
            nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            email: '',
            password: '',
            verificar_password: ''
        })
    };

    const login_form = (event) => {
        event.preventDefault();
        setShowLogin(true); // Mostrar login y ocultar registro
        setFormMessage("");
        setErrorPassword("");
        setPasswordValid(false);

        setLogin({
            usuario: '',
            contrasena: ''
        });
    };


    //handleChange
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormMessage("");
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
        setFormMessage("");
        setLogin({
            ...addLogin, // Mantiene los otros valores del login
            [name]: value // Actualiza el campo que está cambiando
        });
    }


    //funcion registro_add
    const registro_add = async(e) => {
        e.preventDefault();
        setFormMessageType("error");

        const nombrePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s-]+$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nombre = addRegistro.nombre.trim();
        const apellidoPaterno = addRegistro.apellido_paterno.trim();
        const apellidoMaterno = addRegistro.apellido_materno.trim();
        const email = addRegistro.email.trim();

        if (!nombre || !apellidoPaterno || !apellidoMaterno || !email ||
            !addRegistro.password || !addRegistro.verificar_password) {
            setFormMessage("Completa todos los campos para continuar.");
            return;
        }

        if (![nombre, apellidoPaterno, apellidoMaterno].every(value => nombrePattern.test(value))) {
            setFormMessage("Nombre y apellidos solo pueden contener letras, espacios o guiones.");
            return;
        }

        if (!emailPattern.test(email)) {
            setFormMessage("Introduce un correo electrónico válido.");
            return;
        }

        if (!/^[A-Z]/.test(addRegistro.password)) {
            setErrorPassword("La contraseña debe iniciar con una letra mayúscula.");
            setPasswordValid(false);
            setFormMessage("Revisa los requisitos de la contraseña.");
            return;
        }

        if (!/^[A-Za-z0-9]+$/.test(addRegistro.password)) {
            setErrorPassword("Usa únicamente letras y números.");
            setPasswordValid(false);
            setFormMessage("Revisa los requisitos de la contraseña.");
            return;
        }

        if (addRegistro.password.length < 8 || addRegistro.password.length > 72) {
            setErrorPassword("La contraseña debe tener entre 8 y 72 caracteres.");
            setPasswordValid(false);
            setFormMessage("Revisa los requisitos de la contraseña.");
            return;
        }

        if (addRegistro.password !== addRegistro.verificar_password) {
            setFormMessage("Las contraseñas no coinciden.");
            return;
        }

        setIsSubmitting(true);
        setFormMessage("");
        try {
            await add_registro({
                ...addRegistro,
                nombre,
                apellido_paterno: apellidoPaterno,
                apellido_materno: apellidoMaterno,
                email
            });
            setRegistro({
                nombre: '',
                apellido_paterno: '',
                apellido_materno:'',
                email: '',
                password: '',
                verificar_password: ''
            });
            setShowLogin(true);
            setFormMessageType("success");
            setFormMessage("Solicitud recibida. Si el correo es elegible, podrás iniciar sesión.");
        } catch (error) {
            setFormMessage(error.message || "No fue posible completar el registro. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Llamada a la API 
    const LoginSystem = async(e) =>{
        e.preventDefault();
        setFormMessageType("error");

        if (!addLogin.usuario.trim() || !addLogin.contrasena) {
            setFormMessage("Escribe tu correo electrónico y contraseña.");
            return;
        }

        setIsSubmitting(true);
        setFormMessage("");
        try {
            const loginStart = await SelectLogin({
                ...addLogin,
                usuario: addLogin.usuario.trim()
            });

            if (loginStart.success) {
                localStorage.setItem("token", loginStart.token);
                localStorage.setItem("accesos", JSON.stringify(loginStart.accesos));
                localStorage.setItem("user", JSON.stringify(loginStart.usuario));
                window.location.href = '/main';
            } else {
                setFormMessage(loginStart.message || "No fue posible iniciar sesión.");
            }
        } catch (error) {
            setFormMessage(error.message || "No fue posible conectar con el servidor. Inténtalo más tarde.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return ( 
        <main className={styles.Container}>
            <aside className={styles.brandPanel}>
                <div className={styles.brandContent}>
                    <span className={styles.brandMark} aria-hidden="true">AF</span>
                    <p className={styles.brandName}>AccuFinance</p>
                    <h1 className={styles.titlePage}>Precisión y Control en la Gestión de tus Finanzas</h1>
                    <p className={styles.SubTitle}>Administra tu actividad financiera con claridad y seguridad.</p>
                    <div className={styles.brandRule} aria-hidden="true" />
                    <p className={styles.brandNote}>Una plataforma para gestionar tu actividad con seguridad y claridad.</p>
                </div>
                <LoginWaves />
            </aside>

            <section className={styles.formPanel} aria-labelledby="form-heading">
                <div className={styles.formularioLoginRe}>
                    <p className={styles.formEyebrow}>{showLogin ? "ACCESO SEGURO" : "CUENTA PÚBLICA"}</p>
                    <h2 className={styles.titleLogin} id="form-heading">
                        {showLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                    </h2>
                    <p className={styles.formIntro}>
                        {showLogin
                            ? "Ingresa tus datos para continuar."
                            : "Completa tus datos para registrarte en AccuFinance."}
                    </p>

                    {formMessage && (
                        <div
                            className={`${styles.formMessage} ${formMessageType === "success" ? styles.successMessage : styles.errorMessage}`}
                            role={formMessageType === "success" ? "status" : "alert"}
                            aria-live={formMessageType === "success" ? "polite" : "assertive"}
                        >
                            {formMessage}
                        </div>
                    )}

                    {showLogin ? (
                        <form className={styles.formFields} onSubmit={LoginSystem} aria-busy={isSubmitting}>
                            <div className={`${styles.groupF} ${styles.full}`}>
                                <label htmlFor="login-email" className={styles.label}>Correo electrónico</label>
                                <input
                                    className={styles.input}
                                    id="login-email"
                                    type="email"
                                    placeholder="nombre@correo.com"
                                    name="usuario"
                                    autoComplete="username"
                                    value={addLogin.usuario}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            <div className={`${styles.groupF} ${styles.full}`}>
                                <label htmlFor="login-password" className={styles.label}>Contraseña</label>
                                <input
                                    className={styles.input}
                                    id="login-password"
                                    type="password"
                                    placeholder="Tu contraseña"
                                    name="contrasena"
                                    autoComplete="current-password"
                                    value={addLogin.contrasena}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            <div className={styles.btnLogin}>
                                <Button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                                    {isSubmitting ? "Ingresando..." : "Ingresar"}
                                </Button>
                                <Button type="button" variant="link" className={styles.secondaryButton} onClick={registro_form} disabled={isSubmitting}>
                                    Crear una cuenta
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form className={styles.formFields} onSubmit={registro_add} aria-busy={isSubmitting}>
                            <div className={`${styles.groupF} ${styles.full}`}>
                                <label htmlFor="register-name" className={styles.label}>Nombre</label>
                                <input
                                    className={styles.input}
                                    id="register-name"
                                    type="text"
                                    placeholder="Nombre"
                                    name="nombre"
                                    autoComplete="given-name"
                                    value={addRegistro.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.groupF}>
                                <label htmlFor="register-surname" className={styles.label}>Apellido paterno</label>
                                <input
                                    className={styles.input}
                                    id="register-surname"
                                    type="text"
                                    placeholder="Apellido paterno"
                                    name="apellido_paterno"
                                    autoComplete="family-name"
                                    value={addRegistro.apellido_paterno}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.groupF}>
                                <label htmlFor="register-second-surname" className={styles.label}>Apellido materno</label>
                                <input
                                    className={styles.input}
                                    id="register-second-surname"
                                    type="text"
                                    placeholder="Apellido materno"
                                    name="apellido_materno"
                                    value={addRegistro.apellido_materno}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={`${styles.groupF} ${styles.full}`}>
                                <label htmlFor="register-email" className={styles.label}>Correo electrónico</label>
                                <input
                                    className={styles.input}
                                    id="register-email"
                                    type="email"
                                    placeholder="nombre@correo.com"
                                    name="email"
                                    autoComplete="email"
                                    value={addRegistro.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.groupF}>
                                <label htmlFor="register-password" className={styles.label}>Contraseña</label>
                                <input
                                    className={styles.input}
                                    id="register-password"
                                    type="password"
                                    placeholder="Al menos 8 caracteres"
                                    name="password"
                                    autoComplete="new-password"
                                    value={addRegistro.password}
                                    onChange={handleChange}
                                    aria-describedby="password-guidance"
                                    required
                                />
                                <span id="password-guidance" className={styles.passwordGuidance}>
                                    Inicia con mayúscula; usa letras y números (8 a 72 caracteres).
                                </span>
                                {errorPassword && (
                                    <span className={passwordValid ? styles.passwordValid : styles.passwordError} role="status">
                                        {errorPassword}
                                    </span>
                                )}
                            </div>
                            <div className={styles.groupF}>
                                <label htmlFor="register-password-confirm" className={styles.label}>Confirmar contraseña</label>
                                <input
                                    className={styles.input}
                                    id="register-password-confirm"
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    name="verificar_password"
                                    autoComplete="new-password"
                                    value={addRegistro.verificar_password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={`${styles.btnLogin} ${styles.full}`}>
                                <Button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                                    {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                                </Button>
                                <Button type="button" variant="link" className={styles.secondaryButton} onClick={login_form} disabled={isSubmitting}>
                                    Ya tengo una cuenta
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}
 
export default Login;
