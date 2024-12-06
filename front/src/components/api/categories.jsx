
import config from "./config";
const tabla = 'categories';
//Importante el token para porteger rutas, si no se pasa el token se toman las 
// consultas invalidas y no mostrara nada nidejara hacer add y update (esto es solo si la ruta esta protegida)
const token = localStorage.getItem("token"); // Asumiendo que guardas el token en localStorage


export const add_categories = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}categories/add` , {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                "Authorization": `Bearer ${token}` // Agregar el token JWT
            },
            body: JSON.stringify(formData)
        })

        if (!response.ok) {
            // pUEDE SER QN EL BACK NO NECESARIAMENTE AQUI
            throw new Error(`Error en la peticion, API: ${tabla}`); //se ve en el front en la catch
        }
        return await response.json();
    } catch (error) {        
        throw error; 
    }

}


//Funcion select categories
export const selectCategories = async() => {
    try {
        const response = await fetch(`${config.API_URL}categories`, {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}` // Agregar el token JWT
            },
        })

        if (!response.ok) {
            throw new Error(`Error en la peticion, API: ${tabla}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw error; // Vuelve a lanzar el error si quieres manejarlo en otro lugar
    }
}

//Funcion Para Actualizar registro 
export const updateCategories = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}categories/update`, {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}` // Agregar el token JWT
            },
            body: JSON.stringify(formData)
        });

        if(!response.ok){
            throw new Error(`Error en la peticion, API: ${tabla}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
