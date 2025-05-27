"use client"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import axios from "axios"
import "./ReestablecerContrasena.css"
import { REACT_APP_BACKEND_URL } from '../config'

export default function RestablecerContrasena() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [token, setToken] = useState("")
  const [tokenInvalido, setTokenInvalido] = useState(false)
  
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  // Extraer y validar el token cuando el componente se monta
  useEffect(() => {
    console.log("URL completa:", location.search)
    const searchParams = new URLSearchParams(location.search)
    const tokenFromUrl = searchParams.get("token")
    console.log("Token obtenido de URL:", tokenFromUrl)
    
    if (!tokenFromUrl) {
      setTokenInvalido(true)
      setError("Token no proporcionado. Por favor solicita un nuevo enlace de recuperación.")
      return
    }
    
    setToken(tokenFromUrl)
    
    // Establecer el token en una cookie para enviarlo en las solicitudes
    document.cookie = `token=${tokenFromUrl}; path=/; max-age=3600; SameSite=Strict`;
    
  }, [location])

  // Nueva función para validar contraseña (8-40 caracteres) - igual que en RegisterForm
  const validatePassword = (password) => {
    if (!password) return true // No mostrar error si está vacío
    return password.length >= 8 && password.length <= 40
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Manejo especial para password (igual que en RegisterForm)
    if (name === "password") {
      const isValidPassword = validatePassword(value)
      setPasswordError(isValidPassword || value === "" ? "" : "La contraseña debe tener entre 8 y 40 caracteres")
    }

    // Verificar si las contraseñas coinciden
    if (name === "confirmPassword" || name === "password") {
      const password = name === "password" ? value : formData.password
      const confirmPassword = name === "confirmPassword" ? value : formData.confirmPassword
      setPasswordMatch(password === confirmPassword || confirmPassword === "")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Verificaciones de validación (igual que en RegisterForm)
    if (!validatePassword(formData.password)) {
      setPasswordError("La contraseña debe tener entre 8 y 40 caracteres")
      return
    }

    // Verificar que las contraseñas coincidan antes de enviar
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false)
      return
    }

    setLoading(true)
    setError("")
    
    try {
      console.log("Iniciando envío de formulario")
      console.log("Token almacenado:", token)
      console.log("Contraseña a enviar:", formData.password)
      
      // Enviar la solicitud para restablecer la contraseña
      // El token ya está en las cookies, solo enviamos la contraseña en el body
      const response = await axios.post(
        `${REACT_APP_BACKEND_URL}/api/auth/reset-password`, 
        {
          contrasena: formData.password // Cambiado a "contrasena" según la especificación
        },
        {
          withCredentials: true // Esto asegura que las cookies se envíen con la solicitud
        }
      )
      
      console.log("Contraseña restablecida:", response.data)
      setIsPasswordReset(true)
    } catch (error) {
      console.error("Error completo:", error)
      
      if (error.response) {
        console.log("Detalles del error:", error.response.data)
        setError(
          error.response.data.message || 
          JSON.stringify(error.response.data) ||
          "No se pudo restablecer la contraseña. Por favor, intenta de nuevo más tarde."
        )
      } else {
        setError("Error de conexión. Verifica tu conexión a internet e intenta nuevamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Pantalla de token inválido
  if (tokenInvalido) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          
          <h1 className="reset-title">Enlace inválido</h1>
          <p className="reset-error-message">
            {error}
          </p>
          
          <div className="reset-actions">
            <Link to="/olvide-contrasena" className="request-link">
              Solicitar un nuevo enlace
            </Link>
            
            <Link to="/login" className="login-link">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de éxito (después de restablecer la contraseña)
  if (isPasswordReset) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          {/* Icono de éxito */}
          <div className="success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>

          <h1 className="success-title">¡Contraseña restablecida!</h1>

          <p className="success-message">
            Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </p>

          <div className="success-actions">
            <Link to="/login" className="login-button">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Formulario de restablecer contraseña
  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
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

        <h1 className="reset-title">Restablecer Contraseña</h1>
        <p className="reset-subtitle">Ingresa tu nueva contraseña para completar el proceso de recuperación.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Nueva contraseña
            </label>
            <div className="password-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className={`form-input ${passwordError ? "input-error" : ""}`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="toggle-password"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            <small className="password-requirements-hint">
              La contraseña debe tener entre 8 y 40 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar nueva contraseña
            </label>
            <div className="password-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`form-input ${!passwordMatch ? "input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password"
              >
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {!passwordMatch && <p className="error-message">Las contraseñas no coinciden</p>}
          </div>

          <button 
            type="submit" 
            className={`submit-button ${loading ? "loading" : ""}`}
            disabled={!passwordMatch || loading || (formData.password && !validatePassword(formData.password))}
          >
            {loading ? "Procesando..." : "Restablecer Contraseña"}
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