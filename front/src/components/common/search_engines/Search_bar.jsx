import React from 'react';
import { Button } from 'react-bootstrap';

const Search_bar = () => {
    return ( 
        <div className="input-group">
            <input type="text" 
                    className='form-control'
                    placeholder='Buscador...' />
            <Button>Buscar</Button>
        </div>
    );
}

export default Search_bar;
