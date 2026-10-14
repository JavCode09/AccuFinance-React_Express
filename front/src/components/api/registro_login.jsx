//llamamos la ruta 
import config from "./config";
import apiFetch from "./apiFetch";

//comensamos con las expotaciones de la api al servidro 

export const add_registro = async(formData) => {
    try {
        const response = await apiFetch(`${config.API_URL}auth/registro` ,  {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || "Error al crear el registro");
            error.status = response.status;
            throw error;
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export const SelectLogin = async(formData) => {
    try {
        const response = await apiFetch(`${config.API_URL}auth/login` , {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || "No fue posible iniciar sesión.");
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        throw error;
    }
    
}


export const ApiMain = async () => {
    try {
        const response = await apiFetch(`${config.API_URL}api`, {
            method: 'GET',
        });

        if (!response.ok) {
            const data = await response.json();
            const error = new Error(data.message || "Sesión inválida o expirada.");
            error.status = response.status;
            throw error;
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const logoutSession = async () => {
    const response = await apiFetch(`${config.API_URL}auth/logout`, {
        method: "POST"
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "No fue posible cerrar la sesión en el servidor.");
    }
};
