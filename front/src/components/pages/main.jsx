import React, { useContext, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './dashboard'; // Importa el componente Dashboard

// Importa el UserProvider
import { UserContext } from '../../contexts/UserContext';

// btns ADD
import Categories from './modules/subModules/categories';
import NewService from './modules/subModules/newService';
import MyServices from './modules/subModules/myservices';

// css estructura 
import '../styles/dashboard/contenido.css';

//Paginate style
import '../styles/common_style/paginate.css';

const Main = () => {
    const location = useLocation();
    const { userData } = useContext(UserContext);
    const [openModule, setOpenModule] = useState({});

    const toggleSubModules = (moduleName, hasSubmodules) => {
        setOpenModule((prevState) => {
            if (!hasSubmodules) {
                // Si es un módulo sin submódulos, cerrar todos los demás
                return {};
            }
    
            // Alternar el estado del módulo seleccionado
            return {
                [moduleName]: !prevState[moduleName],
            };
        });
    };
    
    
    const modules = [
        { name: 'Inicio', path: '/main',  icon: 'fa-th-large'  },
        {
            name: 'Servicios', icon: 'fa-bolt',
            submodules: [
                { name: 'Categorias', path: '/main/categories',  icon: 'fa-th-large'},
                { name: 'Nuevo Servicio', path: '/main/new_Services' },
                { name: 'Mis Servicios', path: '/main/my_Services' },
            ],
        },
        { name: 'Panel de Control', path: '/main/Servicios' },
        {
            name: 'Inversiones',
            submodules: [
                { name: 'Categorias', path: '/main/Inversiones' },
                { name: 'Nuevo Servicio', path: '/main/MyInversiones' },
                { name: 'Mis Servicios', path: '/main/eee' },
            ],
        },
        { name: 'Usuarios', path: '/main/Usuarios' },
    ];

    return (
        <div className="main-container">
            <div className="sidebar">
                <div className="title-sidebar">
                    <img src="/logo_AccuFinace.png" alt="" />
                    <h3 className='title-sistem'>AccusFinance</h3>
                </div>
                <div className="modules-list">
                    <ul className="module-list">
                        {modules.map((module, index) => (
                            <li key={index} className='liModulos'>
                                {module.submodules ? (
                                    <>
                                        <div
                                            className={`module ${openModule[module.name] ? 'open' : ''}`}
                                            onClick={() => toggleSubModules(module.name, true)} // Pasa true si tiene submódulos
                                        >
                                            <i className={`fa ${module.icon} mr-2`}></i> {/* Icono del módulo */}
                                            {module.name}
                                        </div>
                                        {openModule[module.name] && (
                                            <ul className="submodule-list">
                                                {module.submodules.map((subModule, subIndex) => (
                                                    <li key={subIndex}>
                                                        <div
                                                            className={`module ${location.pathname === subModule.path ? 'active' : 'inactive'}`}
                                                        >
                                                            <i className={`fa ${subModule.icon} mr-2`}></i> {/* Icono del submódulo */}
                                                            <Link to={subModule.path}>{subModule.name}</Link>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <div className={`module ${location.pathname === module.path ? 'active' : ''}`} 
                                        onClick={() => toggleSubModules(module.name, false)} // Pasa false si NO tiene submódulos
                                    >
                                        <i className={`fa ${module.icon} mr-2`}></i> {/* Icono del módulo */}
                                        <Link to={module.path}>{module.name}</Link>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="content">
                <div className="navbar">
                    <span className='span_navbar'>Navbar - Título</span>
                    <div className="session">
                        {userData ? (
                            <span>Bienvenido, {userData.nombre_completo}</span>
                        ) : (
                            <span>Cargando usuario...</span>
                        )}
                    </div>
                </div>
                <div className="content_Modules">
                    <Routes>
                        <Route path="/main" element={<Dashboard />} />
                        <Route path="/categories" element={<Categories titleModule={'Categorias'} />} />
                        <Route path="/new_Services" element={<NewService titleModule={'Nuevos Servicios'} />} />
                        <Route path="/my_Services" element={<MyServices titleModule={'Mis Servicios'} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Main;
