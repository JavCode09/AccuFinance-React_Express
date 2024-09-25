//llamamos la ruta 
import config from "./config";
const tabla = "users"

//comensamos con las expotaciones de la api al servidro 

export const add_registro = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}Registro/add` ,  {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            throw new Error(`Error en la petecion al servidor, ${tabla}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en la funcion API, ${tabla}`);
        throw error;
        
    }
}