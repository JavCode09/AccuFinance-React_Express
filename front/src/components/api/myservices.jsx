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
            const error = new Error("Error en la solicitud de la API"); // Creamos un error con un mensaje genérico
            error.response = { status: response.status, data: errorData }; // Agregamos datos al error
            throw error; // Lanzamos el error con la información adjunta
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la peteción: ", error);
        throw error; //Esto lo marca en consola normal
    }
}

// Select : Informacion del modal actualizar
export const getMyServices = async(id_Myservice) => {
    try {
        const response = await fetch(`${config.API_URL}myServices/GetMyService?id_Myservice=${id_Myservice}`, {
            method: 'GET',
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
        })
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error("Error en la solicitud a la API");
            error.response = {status:response.status, data:errorData};
            throw error
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la petición: ", error);
        throw error; //Esto lo marca en consola normal
        
    }
}

export const UpdateMyServices = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}myServices/updateMyServices`, {
            method:"PUT",
            headers: {
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`
            },
            body:JSON.stringify(formData)
        })
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error("Error en la solicitud de la API", errorData); // Creamos un error con un mensaje genérico
            error.response = { status: response.status, data: errorData }; // Agregamos datos al error
            throw error; // Lanzamos el error con la información adjunta
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la petición: ", error);
        throw error;
    }
}

export const DeleteMyServices = async(idDelete) => {
    try {
        const response = await fetch(`${config.API_URL}myServices/deleteMyService`, {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`,
            },
            body: JSON.stringify({idDelete})
        })
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error("Error en la solicitud de la API", errorData); // Creamos un error con un mensaje genérico
            error.response = { status: response.status, data: errorData }; // Agregamos datos al error
            throw error; // Lanzamos el error con la información adjunta
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la peticion ", error);
        throw error;
        
    }
}