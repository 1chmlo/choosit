"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./OlvideContrasena.css"
import { REACT_APP_BACKEND_URL } from '../config';

export default function OlvideContrasena() {
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Llamar a la API para solicitar recuperación de contraseña
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/forgot-password`, {
        email: email
      })
      
      console.log("Correo de recuperación enviado:", response.data)
      
      // Guardar el email enviado y cambiar al estado de confirmación
      setSubmittedEmail(email)
      setIsEmailSent(true)
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error)
      setError(
        error.response?.data?.message || 
        "No se pudo enviar el correo de recuperación. Por favor, intenta de nuevo más tarde."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Llamar a la API para reenviar el correo
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/forgot-password`, {
        email: submittedEmail
      })
      
      console.log("Correo de recuperación reenviado:", response.data)
      alert("Correo de recuperación reenviado. Por favor revisa tu bandeja de entrada.")
    } catch (error) {
      console.error("Error al reenviar correo:", error)
      alert(
        error.response?.data?.message || 
        "No se pudo reenviar el correo. Por favor, intenta de nuevo más tarde."
      )
    } finally {
      setLoading(false)
    }
  }

  // Añadimos un botón para usar esta función o desactivamos la advertencia
  // eslint-disable-next-line no-unused-vars
  const handleBackToForm = () => {
    setIsEmailSent(false)
    setEmail("")
    setSubmittedEmail("")
    setError("")
  }

  // Pantalla de confirmación (después de enviar el email)
  if (isEmailSent) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
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

          <h1 className="confirmation-title">¡Revisa tu correo electrónico!</h1>

          <p className="confirmation-message">
            Te enviamos un correo con las instrucciones para recuperar tu contraseña. Por favor revisa tu bandeja de
            entrada y sigue las instrucciones que te llegaron por correo.
          </p>

          <div className="email-info">
            <p>
              Enviado a: <strong>{submittedEmail}</strong>
            </p>
          </div>

          <div className="confirmation-actions">
            <button 
              onClick={handleResendEmail} 
              className={`resend-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Reenviar correo"}
            </button>
            
            {/* Podemos usar la función handleBackToForm aquí si queremos usarla */}
            <button
              onClick={handleBackToForm}
              className="back-button"
            >
              Usar otro correo
            </button>
          
            <Link to="/login" className="login-link">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Formulario inicial (solicitar email)
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {/* Icono de candado */}
        <div className="lock-icon">
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="m12 13 0 4"></path>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
          </svg>
        </div>

        <h1 className="forgot-title">¿Olvidaste tu contraseña?</h1>
        <p className="forgot-subtitle">
          No te preocupes, te ayudamos a recuperarla. Ingresa tu correo electrónico y te enviaremos las instrucciones.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className={`submit-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>

        <div className="back-to-login">
          <Link to="/login" className="login-link">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}