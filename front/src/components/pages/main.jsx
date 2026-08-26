import React, { useContext, useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';

// Contexto del usuario
import { UserContext } from '../../contexts/UserContext';

// Dashboard
import Dashboard from './dashboard';

// Módulos
import Categories from './modules/subModules/categories';
import NewService from './modules/subModules/newService';
import MyServices from './modules/subModules/myservices';
import AdminServices from './modules/adminservices';
import UsuariosInternos from './modules/subModules/usuarios_internos';
import Roles from './modules/subModules/roles';
import RolesPermisos from './modules/subModules/rolesPermisos';

// CSS global del sistema
import '../styles/dashboard/contenido.css';

// CSS de paginación
import '../styles/common_style/paginate.css';


const Main = () => {

    /*
    |--------------------------------------------------------------------------
    | CONTEXTO DE USUARIO
    |--------------------------------------------------------------------------
    */

    const { logout } = useContext(UserContext);


    /*
    |--------------------------------------------------------------------------
    | ROUTER
    |--------------------------------------------------------------------------
    |
    | useLocation nos permite saber en qué ruta estamos actualmente.
    | Con esto podemos marcar automáticamente el módulo activo.
    |
    */

    const location = useLocation();


    /*
    |--------------------------------------------------------------------------
    | ESTADO DEL SIDEBAR
    |--------------------------------------------------------------------------
    |
    | false = sidebar completo
    | true  = sidebar reducido
    |
    */

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | ESTADO DE MÓDULOS ABIERTOS
    |--------------------------------------------------------------------------
    |
    | Guarda qué módulos padre están desplegados.
    |
    */

    const [openModule, setOpenModule] = useState({});


    /*
    |--------------------------------------------------------------------------
    | OBTENER INFORMACIÓN DEL LOCALSTORAGE
    |--------------------------------------------------------------------------
    */

    const modulos = JSON.parse(localStorage.getItem('accesos'));
    const user = JSON.parse(localStorage.getItem('user'));


    /*
    |--------------------------------------------------------------------------
    | ABRIR AUTOMÁTICAMENTE LOS PADRES DEL MÓDULO ACTUAL
    |--------------------------------------------------------------------------
    |
    | Si estamos dentro de:
    |
    | /rolls/roles_permisos/5
    |
    | el módulo "Roles" se abre automáticamente.
    |
    */

    useEffect(() => {

        if (!modulos) return;

        const nuevosAbiertos = {};


        const buscarRutaPadre = (lista, padres = []) => {

            for (const modulo of lista) {

                /*
                | Si la ruta actual pertenece a este módulo,
                | abrimos todos sus padres.
                */

                if (
                    modulo.ruta &&
                    (
                        location.pathname === modulo.ruta ||
                        location.pathname.startsWith(modulo.ruta + '/')
                    )
                ) {

                    padres.forEach((id) => {
                        nuevosAbiertos[id] = true;
                    });

                    return true;
                }


                /*
                | Buscar dentro de los hijos.
                */

                if (modulo.hijos && modulo.hijos.length > 0) {

                    const encontrado = buscarRutaPadre(
                        modulo.hijos,
                        [...padres, modulo.modulo_id]
                    );

                    if (encontrado) {
                        return true;
                    }
                }
            }

            return false;
        };


        buscarRutaPadre(modulos);

        setOpenModule((prev) => ({
            ...prev,
            ...nuevosAbiertos
        }));

    }, [location.pathname]);


    /*
    |--------------------------------------------------------------------------
    | ABRIR / CERRAR SUBMÓDULOS
    |--------------------------------------------------------------------------
    */

    const toggleSubModules = (id, hasSubmodules) => {

        /*
        | Si no tiene hijos no hacemos nada.
        */

        if (!hasSubmodules) return;


        setOpenModule((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


    /*
    |--------------------------------------------------------------------------
    | DETERMINAR SI UNA RUTA ESTÁ ACTIVA
    |--------------------------------------------------------------------------
    */

    const isActiveRoute = (ruta) => {

        if (!ruta) return false;

        /*
        | Dashboard
        */

        if (ruta === '/') {
            return location.pathname === '/';
        }

        /*
        | Resto de módulos
        */

        return (
            location.pathname === ruta ||
            location.pathname.startsWith(ruta + '/')
        );
    };


    /*
    |--------------------------------------------------------------------------
    | RENDERIZAR MÓDULOS RECURSIVAMENTE
    |--------------------------------------------------------------------------
    |
    | Esta función funciona con cualquier cantidad de niveles.
    |
    | Ejemplo:
    |
    | Módulo
    |   └── Submódulo
    |       └── Sub-submódulo
    |
    */

    const renderModulos = (modulos) => {

        if (!modulos) return null;


        return modulos

            /*
            | Ordenar módulos.
            |
            | [...modulos] evita modificar directamente
            | el arreglo original.
            */

            .slice()
            .sort((a, b) => a.orden - b.orden)

            .map((modulo) => {


                /*
                |--------------------------------------------------------------------------
                | VALIDAR PERMISO DE VISUALIZACIÓN
                |--------------------------------------------------------------------------
                */

                if (modulo.permisos?.ver !== true) {
                    return null;
                }


                /*
                |--------------------------------------------------------------------------
                | SABER SI TIENE HIJOS
                |--------------------------------------------------------------------------
                */

                const tieneHijos =
                    modulo.hijos &&
                    modulo.hijos.length > 0;


                /*
                |--------------------------------------------------------------------------
                | SABER SI ESTÁ ABIERTO
                |--------------------------------------------------------------------------
                */

                const estaAbierto =
                    openModule[modulo.modulo_id];


                /*
                |--------------------------------------------------------------------------
                | SABER SI ESTÁ ACTIVO
                |--------------------------------------------------------------------------
                */

                const estaActivo =
                    isActiveRoute(modulo.ruta);


                return (

                    <li
                        key={modulo.modulo_id}
                        className="module-item"
                    >


                        {/* 
                        ============================================================
                        CABECERA DEL MÓDULO
                        ============================================================
                        */}

                        <div
                            className={`
                                module
                                ${estaActivo ? 'active' : ''}
                                ${estaAbierto ? 'open' : ''}
                                ${tieneHijos ? 'has-children' : ''}
                            `}

                            onClick={() =>
                                toggleSubModules(
                                    modulo.modulo_id,
                                    tieneHijos
                                )
                            }
                        >


                            {/* 
                            ========================================================
                            ICONO
                            ========================================================
                            */}

                            <span className="module-icon">

                                <i className={`fa ${modulo.icon}`}></i>

                            </span>


                            {/* 
                            ========================================================
                            NOMBRE
                            ========================================================
                            */}

                            {modulo.ruta ? (

                                <Link
                                    to={modulo.ruta}
                                    className="module-link"
                                    onClick={(e) => e.stopPropagation()}
                                >

                                    <span className="module-name">
                                        {modulo.nombre_modulo}
                                    </span>

                                </Link>

                            ) : (

                                <span className="module-name">
                                    {modulo.nombre_modulo}
                                </span>

                            )}


                            {/* 
                            ========================================================
                            FLECHA PARA SUBMÓDULOS
                            ========================================================
                            */}

                            {tieneHijos && (

                                <span className="module-arrow">

                                    <i
                                        className={`fa fa-chevron-down ${
                                            estaAbierto ? 'rotated' : ''
                                        }`}
                                    ></i>

                                </span>

                            )}

                        </div>


                        {/* 
                        ============================================================
                        SUBMÓDULOS
                        ============================================================
                        */}

                        {tieneHijos && (

                            <div
                                className={`
                                    submodule-container
                                    ${estaAbierto ? 'expanded' : ''}
                                `}
                            >

                                <ul className="submodule-list">

                                    {renderModulos(modulo.hijos)}

                                </ul>

                            </div>

                        )}

                    </li>

                );
            });
    };


    /*
    |--------------------------------------------------------------------------
    | CERRAR SIDEBAR EN MÓVIL AL CAMBIAR DE RUTA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (window.innerWidth <= 768) {
            setSidebarCollapsed(true);
        }

    }, [location.pathname]);


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className={`
                main-container
                ${sidebarCollapsed ? 'sidebar-collapsed' : ''}
            `}
        >


            {/* 
            =========================================================================
            SIDEBAR
            =========================================================================
            */}

            <aside className="sidebar">


                {/* 
                =====================================================================
                HEADER DEL SIDEBAR
                =====================================================================
                */}

                <div className="sidebar-header">


                    {/* Logo / nombre */}

                    <div className="brand">


                        <div className="brand-icon">

                            <i className="fa fa-line-chart"></i>

                        </div>


                        <div className="brand-text">

                            <span className="brand-name">
                                Accus
                            </span>

                            <span className="brand-name-light">
                                Finance
                            </span>

                        </div>

                    </div>


                    {/* Botón colapsar */}

                    <button
                        className="sidebar-toggle"
                        onClick={() =>
                            setSidebarCollapsed(
                                (prev) => !prev
                            )
                        }
                        title="Contraer menú"
                    >

                        <i className="fa fa-bars"></i>

                    </button>

                </div>


                {/* 
                =====================================================================
                SEPARADOR
                =====================================================================
                */}

                <div className="sidebar-divider"></div>


                {/* 
                =====================================================================
                TÍTULO DEL MENÚ
                =====================================================================
                */}

                <div className="menu-title">

                    <span>
                        MENÚ PRINCIPAL
                    </span>

                </div>


                {/* 
                =====================================================================
                LISTA DE MÓDULOS
                =====================================================================
                |
                | IMPORTANTE:
                |
                | Este es el elemento que tendrá scroll.
                |
                | El resto del sidebar permanecerá fijo.
                |
                */}

                <nav className="modules-list">

                    <ul className="module-list">

                        {modulos &&
                            renderModulos(modulos)
                        }

                    </ul>

                </nav>


                {/* 
                =====================================================================
                FOOTER DEL SIDEBAR
                =====================================================================
                */}

                <div className="sidebar-footer">


                    {/* Usuario */}

                    <div className="sidebar-user">


                        <div className="user-avatar">

                            {user?.nombre_completo
                                ? user.nombre_completo
                                    .charAt(0)
                                    .toUpperCase()
                                : 'U'
                            }

                        </div>


                        <div className="user-info">

                            <span className="user-name">

                                {user
                                    ? user.nombre_completo
                                    : 'Usuario'
                                }

                            </span>

                            <span className="user-role">

                                Usuario del sistema

                            </span>

                        </div>

                    </div>


                    {/* Cerrar sesión */}

                    <button
                        className="logout-button"
                        onClick={logout}
                    >

                        <i className="fa fa-sign-out"></i>

                        <span>
                            Cerrar sesión
                        </span>

                    </button>

                </div>

            </aside>


            {/* 
            =========================================================================
            CONTENIDO PRINCIPAL
            =========================================================================
            */}

            <main className="content">


                {/* 
                =====================================================================
                NAVBAR
                =====================================================================
                */}

                <header className="navbar">


                    {/* Botón móvil */}

                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setSidebarCollapsed(
                                (prev) => !prev
                            )
                        }
                    >

                        <i className="fa fa-bars"></i>

                    </button>


                    {/* Título */}

                    <div className="navbar-title">

                        <span className="navbar-title-main">
                            Panel administrativo
                        </span>

                        <span className="navbar-title-sub">
                            Gestión financiera
                        </span>

                    </div>


                    {/* 
                    =================================================================
                    ACCIONES DERECHA
                    =================================================================
                    */}

                    <div className="navbar-actions">


                        {/* Estado del sistema */}

                        <div className="system-status">

                            <span className="status-dot"></span>

                            <span>
                                Sistema activo
                            </span>

                        </div>


                        {/* Usuario */}

                        <div className="navbar-user">

                            <div className="navbar-avatar">

                                {user?.nombre_completo
                                    ? user.nombre_completo
                                        .charAt(0)
                                        .toUpperCase()
                                    : 'U'
                                }

                            </div>


                            <div className="navbar-user-info">

                                <span className="navbar-user-name">

                                    {user
                                        ? user.nombre_completo
                                        : 'Cargando...'
                                    }

                                </span>

                                <span className="navbar-user-label">

                                    Cuenta activa

                                </span>

                            </div>

                        </div>


                    </div>

                </header>


                {/* 
                =====================================================================
                CONTENIDO DE LOS MÓDULOS
                =====================================================================
                */}

                <section className="content_Modules">

                    <Routes>


                        {/* Dashboard */}

                        <Route
                            path="/"
                            element={
                                <Dashboard
                                    titleModule="Inicio"
                                />
                            }
                        />


                        {/* Panel de control */}

                        <Route
                            path="/AdminServices"
                            element={
                                <AdminServices
                                    titleModule="Panel de Control"
                                />
                            }
                        />


                        {/* Categorías */}

                        <Route
                            path="/categories"
                            element={
                                <Categories
                                    titleModule="Categorias"
                                />
                            }
                        />


                        {/* Nuevos servicios */}

                        <Route
                            path="/new_Services"
                            element={
                                <NewService
                                    titleModule="Nuevos Servicios"
                                />
                            }
                        />


                        {/* Mis servicios */}

                        <Route
                            path="/my_Services"
                            element={
                                <MyServices
                                    titleModule="Mis Servicios"
                                />
                            }
                        />


                        {/* Usuarios internos */}

                        <Route
                            path="/roll_users"
                            element={
                                <UsuariosInternos
                                    titleModule="Usuarios Internos"
                                />
                            }
                        />


                        {/* Roles */}

                        <Route
                            path="/rolls"
                            element={
                                <Roles
                                    titleModule="Roles"
                                />
                            }
                        />


                        {/* Permisos de roles */}

                        <Route
                            path="/rolls/roles_permisos/:id"
                            element={
                                <RolesPermisos
                                    titleModule="Módulos"
                                />
                            }
                        />

                    </Routes>

                </section>

            </main>

        </div>
    );
};


export default Main;