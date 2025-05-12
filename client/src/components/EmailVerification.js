"use client"

import { useLocation } from "react-router-dom"; // Añadir esta importación
import "./EmailVerification.css"

export default function EmailVerification() {
  // Usar useLocation para obtener el estado pasado durante la navegación
  const location = useLocation();
  const email = location.state?.email || "tu correo"; // Usar el email del estado o un valor por defecto

  const handleResendEmail = () => {
    // Aquí iría la lógica para reenviar el correo de verificación
    console.log("HACER LOGICA DE REENVIO DE CORREO", email)
    alert("Correo de verificación NO reenviado porque todavia no está hecha la ruta.")
  }

  return (
    <div className="verification-container">
      <div className="verification-card">
        {/* Icono de correo */}
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

        <h1 className="verification-title">¡Verifica tu correo electrónico!</h1>

        <p className="verification-message">
          Te enviamos un correo para verificar tu cuenta, por favor revisa tu bandeja de entrada / spam y confirma el
          correo.
        </p>

        <div className="email-info">
          <p>
            Enviado a: <strong>{email}</strong>
          </p>
        </div>

        <div className="verification-actions">
          <button onClick={handleResendEmail} className="resend-button">
            Reenviar correo
          </button>
          <a href="/" className="home-link">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}























