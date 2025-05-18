import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config";
import "./VerificarCorreo.css";

const VerificarCorreo = () => {
  const [status, setStatus] = useState("verificando"); // "verificando", "verificado", "error"
  const [message, setMessage] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verificarCorreo = async () => {
      try {
        // Obtener el token de los query params
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");
        
        if (!token) {
          setStatus("error");
          setMessage("No se encontró el token de verificación en la URL");
          return;
        }
        
        // Realizar la solicitud al backend
        const response = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/auth/verify?token=${token}`
        );
        
        // Usar la respuesta del servidor
        setStatus("verificado");
        setMessage(response.data.message || "¡Tu correo ha sido verificado correctamente! Ahora puedes iniciar sesión.");
        if (response.data.id) {
          setUserId(response.data.id);
        }
      } catch (error) {
        setStatus("error");
        if (error.response && error.response.data) {
          setMessage(error.response.data.message || "Error al verificar el correo");
        } else {
          setMessage("Error al conectar con el servidor");
        }
        console.error("Error al verificar correo:", error);
      }
    };
    
    verificarCorreo();
  }, [location]);
  
  const handleRedirect = () => {
    navigate(status === "verificado" ? "/login" : "/register");
  };
  
  return (
    <div className="verificar-correo-container">
      <div className="verificar-correo-card">
        <h1 className="verificar-correo-title">Verificación de Correo</h1>
        
        {status === "verificando" && (
          <div className="verificar-correo-loading">
            <div className="spinner"></div>
            <p>Verificando tu correo...</p>
          </div>
        )}
        
        {status === "verificado" && (
          <div className="verificar-correo-success">
            <div className="verificar-correo-icon-container">
              <img 
                src="https://i.imgur.com/TGLp6hz.jpeg" 
                alt="Éxito" 
                className="verificar-correo-icon-img" 
              />
            </div>
            <p className="verificar-correo-message">{message}</p>
            <button 
              className="verificar-correo-button" 
              onClick={handleRedirect}
            >
              Iniciar Sesión
            </button>
          </div>
        )}
        
        {status === "error" && (
          <div className="verificar-correo-error">
            <div className="verificar-correo-icon-container">
              <img 
                src="https://i.imgur.com/SmdWMRZ.jpeg" 
                alt="Error" 
                className="verificar-correo-icon-img" 
              />
            </div>
            <p className="verificar-correo-message">{message}</p>
            <button 
              className="verificar-correo-button" 
              onClick={handleRedirect}
            >
              Volver al Registro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificarCorreo;