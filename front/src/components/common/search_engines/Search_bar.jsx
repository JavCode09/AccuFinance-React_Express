import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import debounce from 'lodash.debounce'; // Para evitar llamadas excesivas

const Search_bar = ({ plaholderName, onSearch }) => {
    const [query, setQuery] = useState('');

    // Función con debounce para optimizar las búsquedas
    const handleInputChange = debounce((e) => {
        const value = e.target.value;
        // console.log(value);
        
        setQuery(value);
        onSearch(value); // Llamamos a la función de búsqueda
    }, 200); // 300 ms de retraso

    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder={`Buscar en ${plaholderName}...`}
                defaultValue={query} // Usamos defaultValue con debounce
                onChange={handleInputChange}
            />
            <Button onClick={() => onSearch(query)}>Buscar</Button>
        </div>
    );
};

export default Search_bar;
