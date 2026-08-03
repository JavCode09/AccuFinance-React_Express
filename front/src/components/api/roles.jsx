
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

        if (!response) {
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
    try {
        const response = await fetch(`${config.API_URL}roles/${id}`,{
            method:"POST",
            headers:{
                "Content-Type" :"application/json",
                "Authorization": `Bearrer ${token}`
            },
            body: JSON.stringify({id})
        });

        if (!response) {
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