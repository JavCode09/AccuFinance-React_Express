import config from "./config";
import apiFetch from "./apiFetch";

export const search_barModule = async (formData, routeName) => {
    try {
        const response = await apiFetch(`${config.API_URL}search/${routeName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
