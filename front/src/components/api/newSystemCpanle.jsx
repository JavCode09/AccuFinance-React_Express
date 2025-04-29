import { data } from "jquery";
import config from "./config"; //URL del BACK END


//Token de verificacion del localstorage del JWT
const token = localStorage.getItem("token");

//Optenemos toda la informacion de los servicios
export const selectMyServicesPanel = async(id) => {
    try {
        const response = await fetch(`${config.API_URL}myServicesPanle/all?id=${id}`, {
            method:'GET',
            headers:{ 'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
            }
        })
        if (!response) {
            const errorData = await response.json();
            const error = new Error("Error en la solicitud a la API");
            error.response = {status:response.status, data:errorData};
            throw error;
        }
        return await response.json();

    } catch (error) {
        console.error("Error en la petición: ", error);
        throw error; //Esto lo marca en consola normal
    }
}


//Insert plan de pagos
export const inseertNewSystemPanel = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}myServicesPanle/add` , {
            method:"POST",
            headers:{ 'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(formData)
        })
        if (!response) {
            const errorData = await response.json();
            const error = new Error("Error en la solicitud a la API");
            error.response = {status:response.status, data:errorData}
            throw error;
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la peticion: ", error);
        throw error;
        
    }
}

//Select planes
export const API_selectPlanes = async(idUser) => {
    try {
        const response = await fetch(`${config.API_URL}myServicesPanle/allPlan?idUser=${idUser}`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error("Error en la solicitud a la API");
            error.response = {status:response.status, data:errorData}
            throw error
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la peticion: ", error);
        throw error
        
    }
}

export const API_planes_de_pago = async(idPlan, id_user, mes) => {
    try {
        const response = await fetch(`${config.API_URL}myServicesPanle/planesdp`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`,
            },
            body:JSON.stringify({
                idPlan,
                id_user,
                mes
            })
        })
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error("Error en la solicitud a la API");
            error.response = {status:response.status, data:errorData}
            throw error
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la peticion: ", error);
        throw error;
    }
}