import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/pages/main'; // Asegúrate de que esta ruta es correcta
import Login from './components/pages/login'; // Si tienes un login

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Si tienes un login */}
                <Route path="/main/*" element={<Main />} /> {/* Aquí se gestionan todas las subrutas de /main */}
            </Routes>
        </Router>
    );
}

export default App;
