import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from '../config';
import "./ActivarCuenta.css";

export default function ActivarCuenta() {
  const [searchParams] = useSearchParams();
  const [activationStatus, setActivationStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  const token = searchParams.get("token");

  const activateAccount = useCallback(async () => {
    try {
      setActivationStatus("loading");
      
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/activate-account?token=${token}`);
      
      if (response.data) {
        setActivationStatus("success");
        setMessage("Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.");
      }
    } catch (error) {
      console.error("Error al activar cuenta:", error);
      setActivationStatus("error");
      setMessage(
        error.response?.data?.message || 
        "No se pudo activar tu cuenta. El enlace puede haber expirado o ser inválido."
      );
    }
  }, [token]);

  const handleRetry = async () => {
    setIsRetrying(true);
    await activateAccount();
    setIsRetrying(false);
  };

  useEffect(() => {
    if (!token) {
      setActivationStatus("error");
      setMessage("Token de activación no encontrado.");
      return;
    }

    activateAccount();
  }, [token, activateAccount]);


  if (activationStatus === "loading") {
    return (
      <div className="activate-container">
        <div className="activate-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h1>Activando tu cuenta...</h1>
          <p>Por favor espera mientras procesamos tu solicitud.</p>
        </div>
      </div>
    );
  }

  if (activationStatus === "success") {
    return (
      <div className="activate-container">
        <div className="activate-card">
          <div className="success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          </div>
          <h1 className="success-title">¡Cuenta activada!</h1>
          <p className="success-message">{message}</p>
          <div className="activation-actions">
            <Link to="/login" className="login-button-link">
              Iniciar Sesión
            </Link>
            <Link to="/" className="home-link">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  return (
    <div className="activate-container">
      <div className="activate-card">
        <div className="error-icon">
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
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 className="error-title">Error al activar cuenta</h1>
        <p className="error-message">{message}</p>
        <div className="activation-actions">
          <button 
            onClick={handleRetry} 
            className="retry-button"
            disabled={isRetrying}
          >
            {isRetrying ? "Intentando..." : "Intentar nuevamente"}
          </button>
          <Link to="/login" className="login-link">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}