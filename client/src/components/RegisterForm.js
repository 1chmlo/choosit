"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./RegisterForm.css"
import { REACT_APP_BACKEND_URL } from "../config"

export default function RegisterForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [emailError, setEmailError] = useState("")
  // Nuevos estados para errores
  const [nombreError, setNombreError] = useState("")
  const [apellidoError, setApellidoError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  // Estado para mensajes de error del servidor
  const [serverError, setServerError] = useState("")

  const [isLoading, setIsLoading] = useState(false)

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
    // Verificar que no tenga espacios
    if (email.includes(' ')) return false;
    
    const udpPattern = /@mail\.udp\.cl$/
    if (!email) return true // No mostrar error si está vacío
    return udpPattern.test(email)
  }

  // Nueva función para validar nombre y apellido (permite tildes y ñ)
  const validateName = (name) => {
    const namePattern = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]{2,20}$/
    if (!name) return true // No mostrar error si está vacío
    return namePattern.test(name)
  }

  // Nueva función para validar contraseña (8-40 caracteres)
  const validatePassword = (password) => {
    if (!password) return true // No mostrar error si está vacío
    return password.length >= 8 && password.length <= 40
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
    
    // Limpiar errores del servidor cuando el usuario empieza a escribir
    if (serverError) {
      setServerError("");
    }
    
    // Manejo especial para el email
    if (name === "email") {
      // Eliminar espacios y asegurarse de que siempre termine con @mail.udp.cl
      let newEmail = value.replace(/\s+/g, '')
      
      if (!newEmail.endsWith('@mail.udp.cl')) {
        const username = newEmail.split('@')[0] || ''
        newEmail = `${username}@mail.udp.cl`
      }
      
      const isValidEmail = validateEmail(newEmail)
      setEmailError(isValidEmail ? "" : "El correo debe tener el formato usuario@mail.udp.cl sin espacios")
      
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
    
    // Manejo especial para nombre
    if (name === "nombre") {
      const isValidName = validateName(value)
      setNombreError(isValidName || value === "" ? "" : "El nombre debe tener entre 2 y 20 caracteres (puede incluir tildes y ñ)")
    }
    
    // Manejo especial para apellido
    if (name === "apellido") {
      const isValidName = validateName(value)
      setApellidoError(isValidName || value === "" ? "" : "El apellido debe tener entre 2 y 20 caracteres (puede incluir tildes y ñ)")
    }
    
    // Manejo especial para password
    if (name === "password") {
      const isValidPassword = validatePassword(value)
      setPasswordError(isValidPassword || value === "" ? "" : "La contraseña debe tener entre 8 y 40 caracteres")
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
    
    // Limpiar cualquier error del servidor anterior
    setServerError("");

    // Verificaciones de validación
    if (!validateEmail(formData.email)) {
      setEmailError("El correo debe tener el formato usuario@mail.udp.cl sin espacios")
      return
    }

    if (!validateName(formData.nombre)) {
      setNombreError("El nombre debe tener entre 2 y 20 caracteres (puede incluir tildes y ñ)")
      return
    }

    if (!validateName(formData.apellido)) {
      setApellidoError("El apellido debe tener entre 2 y 20 caracteres (puede incluir tildes y ñ)")
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

      console.log('URL de la API:', `${REACT_APP_BACKEND_URL}/api/auth/register`)
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/auth/register`, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        contrasena: formData.password,
        username: formData.username,
        anio_ingreso: formData.anioIngreso
      });
      
      console.log('Registro exitoso:', response.data);
      
      // Redirigir al usuario a la página de verificación de email
      navigate('/email-verification', { 
        state: { 
          email: formData.email 
        } 
      });
      
    } catch (error) {
      console.error('Error en el registro:', error);
      
      // Mostrar mensaje de error del servidor
      if (error.response && error.response.data) {
        // Mostrar directamente el mensaje de error desde la respuesta
        if (error.response.data.message) {
          setServerError(error.response.data.message);
        } else if (error.response.data.errors && error.response.data.errors.length > 0) {
          setServerError(error.response.data.errors[0].msg);
        } else {
          // Si hay datos pero no en el formato esperado, convertirlos a string
          setServerError(JSON.stringify(error.response.data));
        }
      } else {
        setServerError("Ocurrió un error en el registro. Inténtalo de nuevo más tarde.");
      }
      
    } finally {
      setIsLoading(false)
    }
  }

  // Generar opciones para el año de ingreso (solo entre 1989 y 2025)
  const years = Array.from(
    { length: 2025 - 1989 + 1 }, 
    (_, i) => 2025 - i
  )

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
        
        {/* Mostrar mensaje de error del servidor si existe */}
        {serverError && (
          <div className="server-error-message">
            {serverError}
          </div>
        )}

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
              className={`form-input ${nombreError ? "input-error" : ""}`}
            />
            {nombreError && <p className="error-message">{nombreError}</p>}
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
              className={`form-input ${apellidoError ? "input-error" : ""}`}
            />
            {apellidoError && <p className="error-message">{apellidoError}</p>}
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
                className={`form-input ${passwordError ? "input-error" : ""}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
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
          <Link to="/login" className="login-link">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
} 