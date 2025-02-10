import config from "./config";

const token = localStorage.getItem("token");

export const search_barModule = async (formData, routeName) => {
    try {
        const response = await fetch(`${config.API_URL}search/${routeName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Error en la petición al servidor`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la función API:", error);
        throw error;
    }
};

