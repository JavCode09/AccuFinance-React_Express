import React, { useContext, useState } from 'react';
import {  Link, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard'; // Importa el componente Dashboard

// Importa el UserProvider
import { UserContext } from '../../contexts/UserContext';

// btns ADD
import Categories from './modules/subModules/categories';
import NewService  from './modules/subModules/newService';
import MyServices from './modules/subModules/myservices';

// css estructura 
import '../styles/dashboard/contenido.css';
//Paginate style- Se colocan aqui por que al importaar los modulos se importan sus CSS por lo que afecta de forma global
import '../styles/common_style/paginate.css';

const Main = () => {
    const { userData } = useContext(UserContext); // Obtiene los datos del usuario del contexto

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
                        <div className="session">
                        {userData ? (
                            <span>Bienvenido, {userData.nombre_completo}</span> // Aquí muestras el nombre del usuario desde userData
                        ) : (
                            <span>Cargando usuario...</span> // Muestra un mensaje mientras se obtiene el usuario
                        )}
                        </div>
                    </div>
                    <div className="content_Modules">
                        <Routes>
                            {/* Agrega más rutas aquí para otros submódulos */}
                            <Route path="/main" element={<Dashboard />} />
                            <Route path="/categories" element={<Categories titleModule = {'Categorias'}/>} />
                            <Route path="/new_Services" element={<NewService titleModule ={'Nuevos Servicios'} />} />
                            <Route path="/my_Services" element={<MyServices titleModule ={'Mis Servicios'} />} />
                        </Routes>
                    </div>
                </div>
            </div>
    );
};

export default Main;
