import config from "./config";
import apiFetch from "./apiFetch";
const tabla = 'servicios';
// Select
export const select_services = async() => {
    try {
        const response = await apiFetch(`${config.API_URL}services/all`, {
            method: 'GET',
            headers: {
                "Content-Type":"application/json",
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
        const response = await apiFetch(`${config.API_URL}services/select`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
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
        const response = await apiFetch(`${config.API_URL}services/add`, {
            method: 'POST',
            headers: {
                "Content-Type":"application/json",
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
        const response = await apiFetch(`${config.API_URL}services/update`, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
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
        const response = await apiFetch(`${config.API_URL}services/delete`, {
            method:"DELETE",
            headers: {
                'Content-Type':'application/json',
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