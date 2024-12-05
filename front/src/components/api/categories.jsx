import config from "./config";
const tabla = 'categories';

export const add_categories = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}categories/add` , {
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
        const response = await fetch(`${config.API_URL}categories`, {
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