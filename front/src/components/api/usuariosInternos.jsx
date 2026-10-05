import config from "./config";

//Importante el token para porteger rutas, si no se pasa el token se toman las 
// consultas invalidas y no mostrara nada nidejara hacer add y update (esto es solo si la ruta esta protegida)
const token = localStorage.getItem("token"); // Asumiendo que guardas el token en localStorage

// Leer usuarios internos
export const getUsuariosInternos = async() => {
    try {
        const response = await fetch(`${config.API_URL}UsuariosInternos`, {
            method:"GET",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok){
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la peticon a la API");
            error.response = {status: response.status, data: errorData};
            throw error;
        }

        return await response.json();

    } catch (error) {
        // console.log(error);
        throw error;
    }
}

// leer roles 
export const getRoles = async() =>{
    try {
        const response = await fetch(`${config.API_URL}UsuariosInternos/rolesAll`,{
            method:"GET",
            heraders:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });

        if(!response.ok){
            const errorData = await response.json();
            const error = new Error(errorData.message || "Error en la peticion a la API");
            error.response = {status:response.status, data:errorData}
            throw error;
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
};