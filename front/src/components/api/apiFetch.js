const apiFetch = (url, options = {}) =>
    fetch(url, {
        ...options,
        credentials: "include"
    });

export default apiFetch;
