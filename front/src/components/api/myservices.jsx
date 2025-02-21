import config from "./config";
const tabla = "my_services";

//Importamos token
const token = localStorage.getItem("token");

//Select 
export const selectMyServices = async() => {
    try {
        const response = await fetch(`${config.API_URL}myServices/all`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error(`Error en la peticion, API: ${tabla}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los registros: ", error.message);
        throw error;
    }
}


//Servicios para el selectr
export const selectServices = async() => {
    try {
        const response = await fetch(`${config.API_URL}myServices/AllServices`, {
            method: 'GET',
            headers:{ 
                'Content-Type':'application/json',
                "Authorization": `Bearer ${token}` // Agregar el token JWT
            }
        })
        if (!response.ok) {
            throw new Error(`Error en la peticion, API: ${tabla}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        throw error; // Vuelve a lanzar el error si quieres manejarlo en otro lugar
    }
}

export const AddMyServices = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}myServices/AddMyService` , {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify(formData)
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify({ status: response.status, data: errorData }));

        }
        return await response.json();
    } catch (error) {
        console.error("Error en la peteción: ", error.message);
        throw error;
    }
}