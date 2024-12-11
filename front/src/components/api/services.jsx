import config from "./config";
const tabla = 'servicios';
//Importante el token para porteger rutas, si no se pasa el token se toman las 
// consultas invalidas y no mostrara nada nidejara hacer add y update (esto es solo si la ruta esta protegida)
const token = localStorage.getItem("token"); // Asumiendo que guardas el token en localStorage


export const select_services = async() => {
    try {
        const response = await fetch(`${config.API_URL}services/all`, {
            method: 'GET',
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}` // Agregar el token JWT
            }
        })
        if (!response.ok) {
            throw new Error(`Error en la peticion, API: ${tabla}`);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
        
    }
}