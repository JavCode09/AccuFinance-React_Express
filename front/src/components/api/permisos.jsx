import config from "./config";

//Importante el token para porteger rutas, si no se pasa el token se toman las 
// consultas invalidas y no mostrara nada nidejara hacer add y update (esto es solo si la ruta esta protegida)
const token = localStorage.getItem("token"); // Asumiendo que guardas el token en localStorage



export const getPermisos = async() => {
    try {
        // Mandamos a pedir la informacion
        const response = await fetch(`${config.API_URL}permisos`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
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
        const response = await fetch(`${config.API_URL}permisos`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
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