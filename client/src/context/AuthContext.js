import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // contexto para verificar si está logeado

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false); // login y logout

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}> 
      {children} 
    </AuthContext.Provider>
  );//envolviendo en auth context
};

export const useAuth = () => useContext(AuthContext);