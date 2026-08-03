import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiMain } from '../components/api/registro_login';

// Crea el contexto
export const UserContext = createContext();

// Crea el Provider del contexto
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Mueve verifyToken fuera de useEffect
  const verifyToken = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      logout();
      return;
    }

    try {
      const data = await ApiMain(token);
      // console.log(data);
      
      setUserData(data.user || null);
      // console.log(data);

      // Accesos desde local storage
      const accesos = localStorage.getItem("accesos");
      setAccesos(accesos ? JSON.parse(accesos) : []);

      setLoading(false);
      
    } catch (error) {

      // console.error('Token inválido:', error);
      logout();
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accesos");
    localStorage.removeItem("user");

    setUserData(null);
    setAccesos([]);

    navigate("/");
  }
  
  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dejar el array vacío si estás seguro de que no hay dependencias que cambian
  
  return (
    <UserContext.Provider
      value={{
        userData,
        accesos,
        loading,
        setUserData,
        setAccesos,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
