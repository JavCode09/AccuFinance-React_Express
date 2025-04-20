import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Boostratrap react
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Font Awesome 4
import 'font-awesome/css/font-awesome.min.css';

// Crear y renderizar la raíz de la app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
