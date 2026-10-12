//llamamos la ruta 
import config from "./config";

//comensamos con las expotaciones de la api al servidro 

export const add_registro = async(formData) => {
    try {
        const response = await fetch(`${config.API_URL}auth/registro` ,  {
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
        const response = await fetch(`${config.API_URL}auth/login` , {
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


// api/registro_login.js
export const ApiMain = async (token) => {
    try {
        // Llamada a la API del backend para verificar el token
        const response = await fetch(`${config.API_URL}api`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Se pasa el token en el header Authorization
            }
        });

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Token inválido o expirado.');
        }

        // Si la respuesta es válida, retornar los datos
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la API:', error);
        throw error;
    }
};
