import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard'; // Importa el componente Dashboard

// btns ADD
import Categories from './modules/subModules/categories';
import NewService  from './modules/subModules/newService';

// Api al server
import { ApiMain } from '../api/registro_login';

// css estructura 
import '../styles/dashboard/contenido.css';

const Main = () => {
    const navigate = useNavigate();
    
    const verifyToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const data = await ApiMain(token);
            console.log('Datos protegidos:', data);
        } catch (error) {
            console.error('Error verificando el token:', error);
            navigate('/'); //Si el token esta expirado o no hay direcciona al inicio / -> es el login y registro
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const [openModule, setOpenModule] = useState({});

    const togleSubModules = (moduleName) => {
        setOpenModule((prevState) => ({
            ...prevState,
            [moduleName]: !prevState[moduleName],
        }));
    };

    const modules = [
        { name: 'Inicio', path: '/main' },
        {
            name: 'Servicios',
            submodules: [
                { name: 'Categorias', path: '/main/categories'},
                { name: 'Nuevo Servicio', path: '/main/new_Services' },
                { name: 'Mis Servicios', path: '/main/my_Services' },
            ],
        },
        { name: 'Mis Clasificaciones', path: '/Servicios' },
        { name: 'Inversiones', path: '/Inversiones' },
        { name: 'Usuarios', path: '/Usuarios' },
    ];

    return (
        <div className="main-container">
            <div className="sidebar">
                <div className="title-sidebar">
                    {/* Si la imagen esta en Carpeta Public es ruta relativa */}
                    <img src="/logo_AccuFinace.png" alt="" />
                    <h3 className='title-sistem'>AccusFinance</h3>
                </div>
                <div className="modules-list">
                    <ul className="module-list">
                        {modules.map((module, index) => (
                            <li key={index}>
                                {module.submodules ? (
                                    <>
                                        <div className="module" onClick={() => togleSubModules(module.name)}>
                                            {module.name}
                                        </div>
                                        {openModule[module.name] && (
                                            <ul className="submodule-list">
                                                {module.submodules.map((subModule, subIndex) => (
                                                    <li key={subIndex}>
                                                        <div className="module">
                                                            <Link to={subModule.path}>{subModule.name}</Link>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <div className="module">
                                        <Link to={module.path}>{module.name}</Link>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="content">
                 {/* Navbar */}
                <div className="navbar">
                    <span className='span_navbar'>Navbar - Título</span>
                </div>
                <div className="content_Modules">
                    <Routes>
                        {/* Agrega más rutas aquí para otros submódulos */}
                        <Route path="/main" element={<Dashboard />} />
                        <Route path="/new_Services" element={<NewService titleModule ={'Nuevos Servicios'} />} />
                        <Route path="/categories" element={<Categories titleModule = {'Categorias'}/>} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Main;
