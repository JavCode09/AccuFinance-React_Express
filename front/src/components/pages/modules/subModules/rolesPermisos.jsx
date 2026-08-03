import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Data del logueo
import { UserContext } from '../../../../contexts/UserContext';

// css 
import style from '../../../styles/views/RolesUpdate.module.css';

// btns
import ButtonBack from '../../../common/buttons/btn-back';

// APIs
import { getPermisos } from '../../../api/roles';

const RolesPermisos = ({titleModule}) => {
    // Data del login tokenisado JWT (desifrado)
    const { userData, loading} = useContext(UserContext);

    const [permisos, setPermisos] = useState([]);

    // Id de la ruta (id el registro)
    const { id } = useParams();
    
    useEffect(() => {
        if (!userData) return;

        if (id) {
            modulosYpermisos();
        }

    }, [id, userData]);

    //  Esperamso a que carguen y se desifre el token y poderlo usar
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!userData) {
        return <div>No hay información del usuario.</div>;
    }

    console.log("id:", userData.id);
    console.log("rol:", userData.rol);

 

    // Funcion modulos y permisos
    const modulosYpermisos = async() =>{
        console.log("Entro a la funcion");
        
        const get_roles = await getPermisos();
        
    }

    const modules = [
        {
            name: "Usuarios",
            permissions: [
                "Ver",
                "Insertar",
                "Actualizar",
                "Eliminar"
            ]
        },
        {
            name: "Roles",
            permissions: [
                "Ver",
                "Insertar",
                "Actualizar",
                "Eliminar"
            ]
        },
        {
            name: "Reportes",
            permissions: [
                "Ver",
                "Exportar",
                "Descargar"
            ]
        }
    ];


    const users = [
        "Juan Pérez",
        "María López",
        "Carlos García"
    ];


    return (

        <div className={style.permissionsContainer}>


            {/* CARD MODULOS */}

            <div className={style.card}>
            <ButtonBack 
                size = {"sm"}
                styleColor = {""}
                buttonvariant = {"outline-dark"}
                title = {"Regresar"}
                page = {"/main/rolls"}
                value = {
                            <>
                            <i className="fa fa-arrow-left" aria-hidden="true"> </i>  Regresar
                            </>
                        }
            />
            <br />

                <div className={style.cardHeader}>
                    <div>
                        <h2>{titleModule}</h2>
                        <p>
                            Administra los permisos disponibles del rol
                        </p>
                    </div>


                    <label className={style.checkAll}>
                        <input type="checkbox"/>
                        Seleccionar todo
                    </label>


                </div>



                <div className={style.modulesGrid}>


                    {modules.map((module,index)=>(

                        <div 
                            className={style.moduleCard}
                            key={index}
                        >


                            <div className={style.moduleHeader}>

                                <h3>
                                    {module.name}
                                </h3>


                                <label>
                                    <input type="checkbox"/>
                                    Todos
                                </label>

                            </div>



                            <div className={style.permissionsGrid}>

                                {module.permissions.map((permission,i)=>(

                                    <label 
                                        key={i}
                                        className={style.permissionItem}
                                    >

                                        <input type="checkbox"/>

                                        {permission}

                                    </label>

                                ))}

                            </div>


                        </div>

                    ))}


                </div>


            </div>




            {/* CARD USUARIOS */}


            <div className={style.card}>


                <div className={style.cardHeader}>

                    <div>
                        <h2>
                            Usuarios asignados al rol
                        </h2>

                        <p>
                            Usuarios que tienen este rol asignado
                        </p>
                    </div>


                </div>



                <div className={style.usersGrid}>

                    {users.map((user,index)=>(

                        <div 
                            className={style.userCard}
                            key={index}
                        >

                            <div className={style.avatar}>
                                {user.charAt(0)}
                            </div>

                            <span>
                                {user}
                            </span>

                        </div>

                    ))}


                </div>


            </div>


        </div>

    );
}

export default RolesPermisos;