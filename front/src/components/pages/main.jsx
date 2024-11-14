import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Importa el componente Dashboard

import NuevoServicio from './modules/subModules/NuevoServicios'; // Importa NuevoServicio
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
            navigate('/');
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
                    <span>Navbar - Título</span>
                </div>
                <div className="content_Modules">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/new_Services" element={<NuevoServicio />} />
                        {/* Agrega más rutas aquí para otros submódulos */}
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Main;
