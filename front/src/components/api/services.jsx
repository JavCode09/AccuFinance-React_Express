import config from "./config";
const tabla = 'servicios';
//Importante el token para porteger rutas, si no se pasa el token se toman las 
// consultas invalidas y no mostrara nada nidejara hacer add y update (esto es solo si la ruta esta protegida)
const token = localStorage.getItem("token"); // Asumiendo que guardas el token en localStorage

// Select
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

// Slector de categorias modal_add
export const AddCategorySelectorModal = async() => {
    try {
        const response = await fetch(`${config.API_URL}services/select`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization" : `Bearer ${token}`,
            }
        })
        if (!response.ok) {
            throw new Error(`Error en la peticion, API: ${tabla}`)
        }
        return await response.json();
    } catch (error) {
        console.log(error);
        
    }
}

// Funcion para agregar nuevo servicio (INSERT)
export const add_newSevice = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}services/add`, {
            method: 'POST',
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
              // Intentar parsear el mensaje de error del backend
              const errorData = await response.json();
              throw new Error(errorData.message || 'Error desconocido');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en la petición:', error.message);
        throw error; // Re-lanzar el error para manejarlo en el frontend
    }
}

//Update newServices
export const update_newService = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}services/update`, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error desconocido" );
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la petición: ", error.message );
        throw error;
    }   
}

// Delete newService
export const NewServiceDelete = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}services/delete`, {
            method:"DELETE",
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error desconocido");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la petición: ", error.message );
        throw error;
    }
}