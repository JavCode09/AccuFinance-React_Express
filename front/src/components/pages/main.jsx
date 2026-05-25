import React, { useContext, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard'; // Importa el componente Dashboard

// Importa el UserProvider
import { UserContext } from '../../contexts/UserContext';

// btns ADD para abrir modulos y sub modulos
import Categories from './modules/subModules/categories';
import NewService from './modules/subModules/newService';
import MyServices from './modules/subModules/myservices';
import AdminServices from './modules/adminservices';
import UsuariosInternos from './modules/subModules/usuarios_internos';
import Roles from './modules/subModules/roles';

// css estructura global
import '../styles/dashboard/contenido.css';

//Paginate style global
import '../styles/common_style/paginate.css';


const Main = () => {
    const {logout  } = useContext(UserContext);
    const [openModule, setOpenModule] = useState({});

    const modulos = JSON.parse(localStorage.getItem("accesos"));
    const user = JSON.parse(localStorage.getItem("user"));

    // console.log("user" , user); 
    

   const toggleSubModules = (id, hasSubmodules) => {
        setOpenModule((prev) => {
            if (!hasSubmodules) return {};

            return {
                [id]: !prev[id],
            };
        });
    };
    
    // Funcion para ordenar modulos sin importar el nivel
    const renderModulos = (modulos) => {
        return modulos
            .sort((a, b) => a.orden - b.orden)
            .map((modulo) => {
                if (modulo.permisos?.ver !== true) return null;

                const tieneHijos = modulo.hijos  && modulo.hijos.length > 0 ;

                return (
                    <li key={modulo.modulo_id}>
                            <div className={`module ${openModule[modulo.modulo_id] ? 'open' : ''}`}
                                onClick={() => toggleSubModules(modulo.modulo_id, tieneHijos)}
                            >
                                    <i className={`fa ${modulo.icon} mr-2`}></i>
                                {modulo.ruta ? (
                                    <Link to={modulo.ruta} onClick={(e) => e.stopPropagation()}>
                                        {modulo.nombre_modulo}
                                    </Link>
                                ): (
                                    modulo.nombre_modulo
                                )}
                            
                            </div>
                            
                        

                        {/* Hijos */}
                        {tieneHijos && openModule[modulo.modulo_id] && (
                            <ul className="submodule-list">
                                {renderModulos(modulo.hijos)}
                            </ul>
                        )}
                    </li>
                );
            });
    };

    return (
        <div className="main-container">
            <div className="sidebar">
                <div className="title-sidebar">
                    {/* <img src="/logo_AccuFinace.png" alt="" /> */}
                    <h3 className='title-sistem'>AccusFinance</h3>
                </div>
                <div className="modules-list">
                    <ul className="module-list">
                        {modulos && renderModulos(modulos)}
                    </ul>
                </div>
            </div>
            <div className="content">
                <div className="navbar">
                    <span className='span_navbar'>Navbar - Título</span>
                    <div className="session">
                        {user ? (
                            <span>Bienvenido, {user.nombre_completo}</span>
                        ) : (
                            <span>Cargando usuario...</span>
                        )}
                        <h3 onClick={logout}>Cerrar Session</h3>
                    </div>
                </div>
                <div className="content_Modules">
                    <Routes>
                        <Route path="/main" element={<Dashboard />} />
                        <Route path="/AdminServices" element={<AdminServices titleModule={'Panel de Control'} />} />
                        <Route path="/categories" element={<Categories titleModule={'Categorias'} />} />
                        <Route path="/new_Services" element={<NewService titleModule={'Nuevos Servicios'} />} />
                        <Route path="/my_Services" element={<MyServices titleModule={'Mis Servicios'} />} />
                        <Route path="/roll_users" element={<UsuariosInternos titleModule={'Usuarios Internos'} />}/>
                        <Route path="/rolls" element={<Roles titleModule={'Roles'} />}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Main;
