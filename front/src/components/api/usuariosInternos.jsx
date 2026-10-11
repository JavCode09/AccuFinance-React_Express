import config from "./config";

const request = async (path, method = "GET", body) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${config.API_URL}UsuariosInternos${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    });

    if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || "Error en la petición a la API.");
        error.response = { status: response.status, data: errorData };
        throw error;
    }

    return response.json();
};

export const getUsuariosInternos = () => request("");

export const getRoles = () => request("/rolesAll");

export const addUsuarioInterno = (user) =>
    request("", "POST", user);

export const updateUsuarioInterno = (id, user) =>
    request(`/${id}`, "PUT", user);

export const deleteUsuarioInterno = (id) =>
    request(`/${id}`, "DELETE");
