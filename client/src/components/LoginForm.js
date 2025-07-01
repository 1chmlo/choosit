import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from '../config';
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showcontrasena, setShowcontrasena] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [activateError, setActivateError] = useState("");
  const [activateSuccess, setActivateSuccess] = useState(false);
  const [deactivatedEmail, setDeactivatedEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    setServerError("");

    try {
      const result = await login(formData.email, formData.contrasena);
      
      if (result.success) {
        navigate("/perfil");
      } else {
        // Verificar si es una cuenta desactivada
        if (result.error === "Cuenta desactivada") {
          setDeactivatedEmail(formData.email);
          setShowActivateModal(true);
        } else {
          setServerError(result.error);
        }
      }
    } catch (error) {
      setServerError("Ocurrió un error en el inicio de sesión. Inténtalo de nuevo más tarde.");
    }
  };

  const handleRequestActivate = async () => {
    setActivateLoading(true);
    setActivateError("");

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/request-activate`, {
        email: deactivatedEmail
      });

      if (response.data.ok) {
        setActivateSuccess(true);
      }
    } catch (error) {
      console.error("Error al solicitar activación:", error);
      setActivateError(
        error.response?.data?.message || 
        "No se pudo enviar el correo de activación. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setActivateLoading(false);
    }
  };

  const closeModal = () => {
    setShowActivateModal(false);
    setActivateSuccess(false);
    setActivateError("");
    setDeactivatedEmail("");
  };

  // Modal de activación de cuenta
  const ActivateModal = () => {
    if (!showActivateModal) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {activateSuccess ? (
            // Pantalla de confirmación
            <div className="activate-confirmation">
              <div className="email-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <h2>¡Correo enviado!</h2>
              <p>
                Te hemos enviado un correo con las instrucciones para activar tu cuenta.
                Por favor revisa tu bandeja de entrada.
              </p>
              <p className="email-sent-to">
                Enviado a: <strong>{deactivatedEmail}</strong>
              </p>
              <div className="modal-actions">
                <button onClick={handleRequestActivate} className="resend-button" disabled={activateLoading}>
                  {activateLoading ? "Enviando..." : "Reenviar correo"}
                </button>
                <button onClick={closeModal} className="close-button">
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            // Pantalla inicial
            <div className="activate-request">
              <div className="warning-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <path d="M12 9v4"/>
                  <path d="m12 17 .01 0"/>
                </svg>
              </div>
              <h2>Cuenta desactivada</h2>
              <p>
                Tu cuenta está desactivada. Para poder acceder nuevamente, 
                necesitas activar tu cuenta.
              </p>
              
              {activateError && (
                <div className="error-message">{activateError}</div>
              )}

              <div className="modal-actions">
                <button 
                  onClick={handleRequestActivate} 
                  className="activate-button"
                  disabled={activateLoading}
                >
                  {activateLoading ? "Enviando..." : "Enviar correo de activación"}
                </button>
                <button onClick={closeModal} className="cancel-button">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
            <Link to="/olvide-contrasena" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
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

      {/* Modal de activación */}
      <ActivateModal />
    </div>
  );
}