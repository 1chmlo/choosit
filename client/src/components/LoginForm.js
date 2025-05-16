import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config";
import { useAuth } from "../context/AuthContext";  // Importa el contexto
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();   // Obtiene la función login del contexto
  const [showcontrasena, setShowcontrasena] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mensajes de error del servidor
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Limpiar errores del servidor cuando el usuario empieza a escribir
    if (serverError) {
      setServerError("");
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar cualquier error del servidor anterior
    setServerError("");

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/auth/login`,
        {
          email: formData.email,
          contrasena: formData.contrasena,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Inicio de sesión exitoso:", response.data);
      login();        // Marca usuario como logueado
      navigate("/");  // Redirige a home

    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      
      // Mostrar mensaje de error del servidor
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setServerError(error.response.data.message);
        } else if (error.response.data.errors && error.response.data.errors.length > 0) {
          setServerError(error.response.data.errors[0].msg);
        } else {
          setServerError(JSON.stringify(error.response.data));
        }
      } else {
        setServerError("Ocurrió un error en el inicio de sesión. Inténtalo de nuevo más tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <Link to="/">
          <img
            src="https://i.imgur.com/EXI0FXm.png"
            alt="Logo de Choosit"
            className="logo-image"
          />
        </Link>

        <h1 className="login-title">Iniciar Sesión</h1>
        
        {/* Mostrar mensaje de error del servidor si existe */}
        {serverError && (
          <div className="server-error-message">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena" className="form-label">
              Contraseña
            </label>
            <div className="contrasena-container">
              <input
                id="contrasena"
                name="contrasena"
                type={showcontrasena ? "text" : "password"}
                placeholder="••••••••"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowcontrasena(!showcontrasena)}
                className="toggle-contrasena"
              >
                {showcontrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="forgot-contrasena">
            <Link to="/reset-contrasena" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Cargando
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="register-prompt">
          <span>¿No tienes una cuenta?</span>{" "}
          <Link to="/register" className="register-link">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}