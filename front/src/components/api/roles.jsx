
import config from "./config";

//Importante el token para porteger rutas, si no se pasa el token se toman las 
// consultas invalidas y no mostrara nada nidejara hacer add y update (esto es solo si la ruta esta protegida)
const token = localStorage.getItem("token"); // Asumiendo que guardas el token en localStorage

// Insertar roles
export const add_rol = async(nombre) => {
    try {
        const response = await fetch(`${config.API_URL}roles`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : `Bearer ${token}`
            },
            body:JSON.stringify({
                nombre
            })
        })

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status: response.status, data: errorData};
            throw error;
        }
         return await response.json();
    } catch (error) {
         console.error(error);
        throw error;
    }
}

// Leer todos los datos
export const getDataAll = async() => {
    try {
        const response = await fetch(`${config.API_URL}roles`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status: response.status, data: errorData};
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
        
    }
}

// Obtener permisos  
export const getPermisos = async(id) => {
    // console.log(id);
    
    try {
        const response = await fetch(`${config.API_URL}roles/${id}`,{
            method:"GET",
            headers:{
                "Content-Type" :"application/json",
                "Authorization": `Bearer ${token}`
            },
            // body: JSON.stringify({id})
        });

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status: response.status, data: errorData};
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error();
        throw error;
    }
}

// Actualizar permisos
export const UpdatePermisosModulos = async(rol_id, modulo_id, permisos)=> {
    // console.log('rol_id: ' + rol_id);
    // console.log('modulo_id: ' + modulo_id);
    // console.log('permisos: ' , permisos);

    try {
        const response = await fetch(`${config.API_URL}roles`,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                rol_id,
                modulo_id,
                permisos
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status: response.status, data: errorData};
            throw error;
        }
        
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
    
}

export const UpdatePermisosAll = async(rol_id, permisos) => {
    console.log('rol_id: ' + rol_id);
    console.log('permisos: ' , permisos);
    try {
        const response = await fetch(`${config.API_URL}roles/${rol_id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body: JSON.stringify({
                permisos,
            })
        })

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status: response.status, data:errorData};
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
        
    }

}

export const DeleteRolesp = async(rol_id) => {
    try {
        const response = await fetch(`${config.API_URL}roles`, {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                rol_id
            })
        })

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status: response.status, data:errorData};
            throw error;
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}