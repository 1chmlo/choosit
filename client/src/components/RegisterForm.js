"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./RegisterForm.css"

export default function RegisterForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [emailError, setEmailError] = useState("")
  const emailInputRef = useRef(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "@mail.udp.cl",
    password: "",
    confirmPassword: "",
    anioIngreso: ""
  })

  // Validar el formato de correo electrónico UDP
  const validateEmail = (email) => {
    const udpPattern = /@mail\.udp\.cl$/
    if (!email) return true // No mostrar error si está vacío
    return udpPattern.test(email)
  }

  // Función para posicionar el cursor antes de @mail.udp.cl - versión corregida
  const focusEmailInput = () => {
    if (emailInputRef.current) {
      try {
        emailInputRef.current.focus();
        
        // Coloca el cursor al principio
        const value = emailInputRef.current.value || "";
        const position = value.indexOf('@') !== -1 ? value.indexOf('@') : 0;
        
        // Usar setTimeout para asegurar que el focus haya sucedido
        setTimeout(() => {
          try {
            if (emailInputRef.current && emailInputRef.current.setSelectionRange) {
              emailInputRef.current.setSelectionRange(0, position);
            }
          } catch (error) {
            console.log("No se pudo establecer la posición del cursor");
          }
        }, 10);
      } catch (error) {
        console.log("Error al manipular el input de correo electrónico", error);
      }
    }
  };

  // Extraer username del email automáticamente
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
    
    // Manejo especial para el email
    if (name === "email") {
      // Asegurarse de que siempre termine con @mail.udp.cl
      let newEmail = value
      
      if (!newEmail.endsWith('@mail.udp.cl')) {
        const username = newEmail.split('@')[0] || ''
        newEmail = `${username}@mail.udp.cl`
      }
      
      const isValidEmail = validateEmail(newEmail)
      setEmailError(isValidEmail ? "" : "El correo debe tener el formato @mail.udp.cl")
      
      // Si cambia el email y es válido, actualizar el username
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
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Verificar si las contraseñas coinciden
    if (name === "confirmPassword" || name === "password") {
      const password = name === "password" ? value : formData.password
      const confirmPassword = name === "confirmPassword" ? value : formData.confirmPassword
      setPasswordMatch(password === confirmPassword || confirmPassword === "")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Verificaciones de validación
    if (!validateEmail(formData.email)) {
      setEmailError("El correo debe tener el formato @mail.udp.cl")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false)
      return
    }

    try {
      console.log('URL de la API:', `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`)
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        contrasena: formData.password,
        username: formData.username,
        anio_ingreso: formData.anioIngreso
      });
      
      console.log('Registro exitoso:', response.data);
      // Redirigir al usuario a la página de inicio de sesión
      navigate('/login');
      
    } catch (error) {
      console.error('Error en el registro:', error);
      // Aquí podrías manejar errores específicos o mostrar mensajes al usuario
    }
  }

  // Generar opciones para el año de ingreso (últimos 50 años)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Espacio para el logo */}
        <Link to="/">
            <img
              src="https://i.imgur.com/EXI0FXm.png" 
              alt="Logo de Choosit" 
              className="logo-image" 
            />
          </Link>

        <h1 className="register-title">Crear Cuenta</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Tu apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico UDP
            </label>
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
            <label htmlFor="password" className="form-label">
              Contraseña
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
                className="form-input"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
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

          <div className="form-group">
            <label htmlFor="anioIngreso" className="form-label">
              Año de ingreso
            </label>
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
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="terms-container">
            <input type="checkbox" id="terms" required className="terms-checkbox" />
            <label htmlFor="terms" className="terms-label">
              Acepto los{" "}
              <Link to="/terms" className="terms-link">
                términos y condiciones
              </Link>
            </label>
          </div>

          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>

        <div className="login-prompt">
          <span>¿Ya tienes una cuenta?</span>{" "}
          <Link to="/login" className="login-link">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}