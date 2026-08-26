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
import { UpdatePermisosModulos } from '../../../api/roles';
import { UpdatePermisosAll } from '../../../api/roles';

const RolesPermisos = ({titleModule}) => {
    // Data del login tokenisado JWT (desifrado)
    const { userData, loading} = useContext(UserContext);

    // Hook de estado para los permisos
    const [permisos, setPermisos] = useState([]);

    // Id de la ruta (id el registro)
    const { id } = useParams();
    
    useEffect(() => {
        if (!userData) return;

        if (id) {
            modulosYpermisos();
        }

    }, [id, userData]);

    //  Esperamos a que carguen y se desifre el token y poderlo usar
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!userData) {
        return <div>No hay información del usuario.</div>;
    }

    // console.log("id:", userData.id);
    // console.log("rol:", userData.rol);

 

    // Funcion  get modulos y permisos
    const modulosYpermisos = async() =>{
        // console.log("Entro a la funcion");
        
        try {
            const get_roles = await getPermisos(id);
            // console.log(get_roles);
            
            setPermisos(get_roles.data);
        } catch (error) {
            console.error(error);
            
            if (error.response?.status === 404) {
                alert(error.message);
                return;
            }if (error.response?.status === 500) {
                alert(error.message);
                return;
            }

            alert("Ocurrió un error.");
        }
    }

    // Funcion para configurar de form aindividual cada permiso por modulo (individual)
    const cambioIndividual = (moduloID, permisoID) => {
        setPermisos((prevModulo) => {
            return prevModulo.map((modulo)=>{
                if (modulo.modulo_id !== moduloID) {
                    return modulo;
                }

                return {
                    ...modulo,
                    permisos: modulo.permisos.map((permiso)=>{
                        if (permiso.permiso_id !== permisoID) {
                            return permiso;
                        }

                        const nuevoEstado = !permiso.activo;
                        
                        // console.log("modulo: ", moduloID);
                        // console.log("Permisos: ", permiso);
                        // console.log("Nuevo estado: ", nuevoEstado);
                        
                        return {
                            ...permiso,
                            activo: nuevoEstado
                        }
                    })
                }
            });
        });
    }

    // Funcion para el chek de todos por modulo (poner a todos checked o no )
    const todosChecked = (moduloID) => {
        setPermisos((prevChecked) => {
            return prevChecked.map((modulo) => {
                if (modulo.modulo_id !== moduloID) {
                    return modulo;
                }

                const activaTodos = !modulo.permisos.every((permiso)=> permiso.activo === true);

                return{
                    ...modulo,
                    permisos: modulo.permisos.map((permiso) => ({
                        ...permiso,
                        activo: activaTodos
                    }))
                }
            })
        });
    }

    // Funcion para el check general de todos los permisos no importa el modulo
    const todosModulosPermisos = (permisosTodos) => {
        setPermisos((prevTodos) => {
            
            // Validamos si estan activos todos los estados de ls permisos
            const todosActivos = prevTodos.every((modulo) => 
                modulo.permisos.every((permiso) => permiso.activo === true)
            )

            // Pasamos a viseversa si es true sera false o false a true
            const nuevoEstado = !todosActivos;

            // Realizamos copia y sustitucion para nuevos estados 
            return prevTodos.map((modulo) => {
                
                // Retornamos cada permiso de cad amodulo
                return {
                    ...modulo,
                    permisos: modulo.permisos.map((permiso) => ({
                        ...permiso,
                        activo: nuevoEstado
                    }))
                }
            })

        });
    }

    // Botn de guardar por modulo
    const btnGuardar = async(module) => {
        // console.log(module.modulo_id);
        // console.log(module.permisos);

        // Validamos los camopos
        if (!module) {
            alert("No hay modulos y permisos relacionados");
            return;
        }

        if (!id) {
            alert("No se encontro el rol relacionado a los modulos y permisos");
            return;
        }


        try {
            // Mandamos la información al back 
            const updatePermisos = await UpdatePermisosModulos(id, module.modulo_id, module.permisos);
            console.log(updatePermisos);
            
            if (updatePermisos.success) {
                alert(updatePermisos.message);
            }
            
        } catch (error) {
            console.error();
            
            if (error.response && error.response.status === 400) {
                alert(error.response.message);
            }else{
                alert(error.response.message);
            }
        }

        
    }

    // Boton para guardar todo 
    const btnGuardarAll = async(permisos) => {
        console.log(permisos);
    
        if (!permisos) {
            alert("No hay permisos en este modulo");
            return;
        }
        
        if (!id) {
            alert("No se encontro el rol relacionado a los modulos y permisos");
            return;
        }

        try {
            // Prosesamos datos 
            const response = await UpdatePermisosAll(id, permisos);
            // console.log('response: ' , response);
            alert(response.message);

        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                alert(error.response.message);
            }else{
                alert(error.response.message);
            }
        }
    }

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
                        <input type="checkbox"
                                checked = {
                                    permisos.every((modulo) => modulo.permisos.every((permiso) => permiso.activo === true))
                                }
                                onChange={() => todosModulosPermisos()}
                        />
                        Seleccionar todo
                    </label>
                    <label className={style.checkAll}>
                        <button
                            type='button'
                            className='btn btn-warning'
                            onClick={()=> btnGuardarAll(permisos)}
                        >
                            Actualizar Todos
                        </button>
                    </label>


                </div>



                <div className={style.modulesGrid}>


                    {permisos.map((module)=>(

                        <div 
                            className={style.moduleCard}
                            key={module.modulo_id}
                        >


                            <div className={style.moduleHeader}>

                                <h3>
                                    {module.nombre_modulo}
                                </h3>

                                <button
                                    type="button"
                                    className='btn btn-dark  btn-sm'
                                    onClick={() => btnGuardar(module)}
                                >
                                    Guardar
                                </button>

                            </div>



                            <div className={style.permissionsGrid}>

                                {module.permisos.map((permission)=>(

                                    <label 
                                        key={permission.permiso_id}
                                        className={style.permissionItem}
                                    >

                                        <input type="checkbox"  
                                                checked={permission.activo}
                                                onChange={()=> 
                                                    cambioIndividual(module.modulo_id, permission.permiso_id)
                                                }
                                                
                                        />

                                        {permission.nombre_permiso}

                                    </label>

                                ))}

                            </div>

                            <div className={style.footerGrid}>
                                <label className={style.checkAll}>
                                    <input
                                        type="checkbox"
                                        title="Todos"
                                        checked={module.permisos.every(
                                            (permiso) => permiso.activo === true
                                        )}
                                        onChange={() => todosChecked(module.modulo_id)}
                                    />
                                    <h3>Todos</h3>
                                </label>
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

                


                </div>


            </div>


        </div>

    );
}

export default RolesPermisos;