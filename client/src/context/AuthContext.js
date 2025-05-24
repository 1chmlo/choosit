import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // axios will automatically send cookies with the request
      const { data } = await axios.get(`${REACT_APP_BACKEND_URL}/api/users/me`, { 
        withCredentials: true 
      });
      
      if (data.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data?.message || "Error al obtener datos del usuario");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, contrasena) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/auth/login`,
        { email, contrasena },
        { withCredentials: true }
      );
      
      if (response.data.ok) {
        // Después de iniciar sesión correctamente, obtener los datos del usuario
        await fetchUserData();
        return { success: true };
      } else {
        setError(response.data.message || "Error de inicio de sesión");
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      console.error("Error en inicio de sesión:", err);
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors && err.response?.data?.errors.length > 0 
                            ? err.response.data.errors[0].msg 
                            : "Error al iniciar sesión");
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Hacer la llamada al endpoint de logout si existe
      await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      // Limpiar el estado del usuario
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login,
      fetchUserData,
      logout,
      isAuthenticated: !!user
    }}> 
      {children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);