import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios" // Necesitarás instalar axios: npm install axios
import "./LoginForm.css"
import { REACT_APP_BACKEND_URL } from "../config"



export default function LoginForm() {
  const navigate = useNavigate()
  const [showcontrasena, setShowcontrasena] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      console.log('Datos del formulario:', formData)
      console.log('URL de la API:', `${REACT_APP_BACKEND_URL}:/api/auth/login`)
      const response = await axios.post(`${REACT_APP_BACKEND_URL}:/api/auth/login`, {
        email: formData.email,
        contrasena: formData.contrasena
      }, {
        withCredentials: true // Esto es importante para enviar cookies
      });
      console.log(response)
      
      console.log('Inicio de sesión exitoso:', response.data);
      // Aquí podrías guardar el token y redirigir al usuario
      // localStorage.setItem('token', response.data.token);
      navigate('/');
      
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Espacio para el logo */}
        <Link to="/">
            <img
              src="https://i.imgur.com/EXI0FXm.png" 
              alt="Logo de Choosit" 
              className="logo-image" 
            />
          </Link>

        <h1 className="login-title">Iniciar Sesión</h1>

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
                type={showcontrasena ? "text" : "contrasena"}
                placeholder="••••••••"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button type="button" onClick={() => setShowcontrasena(!showcontrasena)} className="toggle-contrasena">
                {showcontrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="forgot-contrasena">
            <Link to="/reset-contrasena" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
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
  )
}