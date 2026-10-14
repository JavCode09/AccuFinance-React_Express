import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiMain, logoutSession } from '../components/api/registro_login';

// Crea el contexto
export const UserContext = createContext();

// Crea el Provider del contexto
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const verifySession = async () => {
    try {
      const data = await ApiMain();
      setUserData(data.user || null);
      setAccesos(Array.isArray(data.accesos) ? data.accesos : []);
    } catch (error) {
      setUserData(null);
      setAccesos([]);
      if (error.status !== 401) {
        console.error("No fue posible recuperar la sesión.", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutSession();
    } catch (error) {
      console.error("No fue posible cerrar la sesión en el servidor.", error);
    } finally {
      setUserData(null);
      setAccesos([]);
      setLoading(false);
      navigate("/");
    }
  };

  useEffect(() => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("accesos");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("No fue posible limpiar los datos de sesión antiguos.", error);
    }
    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
