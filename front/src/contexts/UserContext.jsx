import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiMain } from '../components/api/registro_login';

// Crea el contexto
export const UserContext = createContext();

// Crea el Provider del contexto
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Mueve verifyToken fuera de useEffect
  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const data = await ApiMain(token);
      setUserData(data.user);
      console.log(data);
    } catch (error) {
      console.error('Token inválido:', error);
      localStorage.removeItem('token'); // Elimina el token
      setUserData(null); // Limpia contexto
      navigate('/'); // Redirige al login
    }
  };


  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dejar el array vacío si estás seguro de que no hay dependencias que cambian
  
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
