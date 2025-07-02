"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./RegisterForm.css"
//mport "./EmailVerification.css"
import { REACT_APP_BACKEND_URL } from "../config"

export default function RegisterForm() {
  const [step, setStep] = useState("form") // "form" o "verification"
  const [registeredEmail, setRegisteredEmail] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [serverError, setServerError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const emailInputRef = useRef(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "@mail.udp.cl",
    password: "",
    confirmPassword: "",
    anioIngreso: ""
  })

  const validateEmail = (email) => {
    if (email.includes(' ')) return false;
    const udpPattern = /@mail\.udp\.cl$/
    if (!email) return true
    return udpPattern.test(email)
  }

  const validatePassword = (password) => {
    if (!password) return true
    return password.length >= 8 && password.length <= 40
  }

  const focusEmailInput = () => {
    if (emailInputRef.current) {
      try {
        emailInputRef.current.focus()
        const value = emailInputRef.current.value || ""
        const position = value.indexOf('@') !== -1 ? value.indexOf('@') : 0
        setTimeout(() => {
          try {
            if (emailInputRef.current && emailInputRef.current.setSelectionRange) {
              emailInputRef.current.setSelectionRange(0, position)
            }
          } catch (error) {
            console.log("No se pudo establecer la posición del cursor")
          }
        }, 10)
      } catch (error) {
        console.log("Error al manipular el input de correo electrónico", error)
      }
    }
  }

  useEffect(() => {
    if (formData.email && formData.email.includes("@")) {
      const username = formData.email.split("@")[0]
      setFormData(prev => ({
        ...prev,
        username
      }))
    }
  }, [formData.email])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (serverError) setServerError("")

    if (name === "email") {
      let newEmail = value.replace(/\s+/g, '')
      if (!newEmail.endsWith('@mail.udp.cl')) {
        const username = newEmail.split('@')[0] || ''
        newEmail = `${username}@mail.udp.cl`
      }
      const isValidEmail = validateEmail(newEmail)
      setEmailError(isValidEmail ? "" : "El correo debe tener el formato usuario@mail.udp.cl sin espacios")
      if (isValidEmail && newEmail.includes("@")) {
        const username = newEmail.split("@")[0]
        setFormData(prev => ({
          ...prev,
          email: newEmail,
          username
        }))
        return
      }
      setFormData(prev => ({
        ...prev,
        email: newEmail
      }))
      return
    }

    if (name === "password") {
      const isValidPassword = validatePassword(value)
      setPasswordError(isValidPassword || value === "" ? "" : "La contraseña debe tener entre 8 y 40 caracteres")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "confirmPassword" || name === "password") {
      const password = name === "password" ? value : formData.password
      const confirmPassword = name === "confirmPassword" ? value : formData.confirmPassword
      setPasswordMatch(password === confirmPassword || confirmPassword === "")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")

    if (!validateEmail(formData.email)) {
      setEmailError("El correo debe tener el formato usuario@mail.udp.cl sin espacios")
      return
    }

    if (!validatePassword(formData.password)) {
      setPasswordError("La contraseña debe tener entre 8 y 40 caracteres")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false)
      return
    }

    try {
      setIsLoading(true)

      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/register`, {
        email: formData.email,
        contrasena: formData.password,
        username: formData.username,
        anio_ingreso: formData.anioIngreso
      })

      console.log('Registro exitoso:', response.data)
      setRegisteredEmail(formData.email)
      setStep("verification")

    } catch (error) {
      console.error('Error en el registro:', error)
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setServerError(error.response.data.message)
        } else if (error.response.data.errors?.length > 0) {
          setServerError(error.response.data.errors[0].msg)
        } else {
          setServerError(JSON.stringify(error.response.data))
        }
      } else {
        setServerError("Ocurrió un error en el registro. Inténtalo de nuevo más tarde.")
      }
    } finally {
      setIsLoading(false)
    }
  }
// ...existing code...

const handleResendEmail = async () => {
  try {
    setIsLoading(true)
    
    const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/resend-verification-email`, {
      email: registeredEmail
    })

    if (response.status === 200) {
      alert("Correo de verificación reenviado exitosamente. Revisa tu bandeja de entrada.")
    }
  } catch (error) {
    console.error('Error al reenviar correo:', error)
    if (error.response?.data?.message) {
      alert(`Error: ${error.response.data.message}`)
    } else if (error.response?.data?.errors?.length > 0) {
      alert(`Error: ${error.response.data.errors[0].msg}`)
    } else {
      alert("Error al reenviar el correo de verificación. Inténtalo de nuevo más tarde.")
    }
  } finally {
    setIsLoading(false)
  }
}

// ...existing code...
  const years = Array.from({ length: 2025 - 1989 + 1 }, (_, i) => 2025 - i)

  if (step === "verification") {
    return (
      <div className="verification-container">
        <div className="verification-card">
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
            Te enviamos un correo para verificar tu cuenta. Revisa tu bandeja de entrada o spam y confirma el correo.
          </p>

          <div className="email-info">
            <p>Enviado a: <strong>{registeredEmail}</strong></p>
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

  return (
    <div className="register-container">
      <div className="register-card">
        <Link to="/">
          <img
            src="https://i.imgur.com/EXI0FXm.png"
            alt="Logo de Choosit"
            className="logo-image"
          />
        </Link>

        <h1 className="register-title">Crear Cuenta</h1>

        {serverError && (
          <div className="server-error-message">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo electrónico UDP</label>
            <input
              id="email"
              name="email"
              type="email"
              ref={emailInputRef}
              onClick={() => setTimeout(focusEmailInput, 50)}
              placeholder="usuario@mail.udp.cl"
              value={formData.email}
              onChange={handleChange}
              required
              className={`form-input ${emailError ? "input-error" : ""}`}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de usuario (se extrae automáticamente del correo)
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Se completa automáticamente"
              value={formData.username}
              readOnly
              className="form-input read-only"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
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
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
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

          <div className="form-group">
            <label htmlFor="anioIngreso" className="form-label">Año de ingreso</label>
            <select
              id="anioIngreso"
              name="anioIngreso"
              value={formData.anioIngreso}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Seleccionar año</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="terms-container">
            <input type="checkbox" id="terms" required className="terms-checkbox" />
            <label htmlFor="terms" className="terms-label">
              Acepto los{" "}
              <Link to="/terms" className="terms-link">términos y condiciones</Link>
            </label>
          </div>

          <button
            type="submit"
            className={`register-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Cargando" : "Registrarse"}
          </button>
        </form>

        <div className="login-prompt">
          <span>¿Ya tienes una cuenta?</span>{" "}
          <Link to="/login" className="login-link">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  )
}
