
import config from "./config";
import apiFetch from "./apiFetch";
const tabla = 'categories';
//Funcion para agregar categoria
export const add_categories = async(formData) => {
    try {
        const response = await apiFetch(`${config.API_URL}categories/add` , {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
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
        const response = await apiFetch(`${config.API_URL}categories`, {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json",
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
        const response = await apiFetch(`${config.API_URL}categories/update`, {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json",
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

// Funcion para eliminar categoria
export const deleteCategories = async(formData) => {
    try {
        const response = await apiFetch(`${config.API_URL}categories/delete`, {
            method: 'DELETE',
            headers: {
                "Content-Type" : "application/json",
            },
            body:JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`Error en la peticion, API: ${tabla}`);
        }
        return  await response.json();
    } catch (error) {
        throw error;
    }
}