import config from "./config";
import apiFetch from "./apiFetch";

export const getPermisos = async() => {
    try {
        // Mandamos a pedir la informacion
        const response = await apiFetch(`${config.API_URL}permisos`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API")
            error.response = {status: response.status, data: errorData};
            throw error;
        }

        return await response.json();
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createPermiso = async(namePermiso) => {
    try {
        const response = await apiFetch(`${config.API_URL}permisos`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                namePermiso,
            })
        })

        if(!response.ok){
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

export const getPermisosUpdate = async(permiso_id) => {
    try {
        const response = await apiFetch(`${config.API_URL}permisos/${permiso_id}`,{
            method: "GET",
            headers:{
                "Content-Type":"application/json",
            }
        })
    
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status: response.status, data: errorData}
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updatePermiso = async(permiso_id,nombre) => {
    try {
        const response = await apiFetch(`${config.API_URL}permisos/${permiso_id}`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                nombre,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = {status:response.status, data:errorData};
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;

    }
}

export const deletePermiso = async(permiso_id) => {
    try {
        const response = await apiFetch(`${config.API_URL}permisos/${permiso_id}`, {
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la solicitud a la API");
            error.response = { status: response.status, data: errorData };
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }
}