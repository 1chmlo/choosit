"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./LoginForm.css"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    console.log("Datos enviados:", formData)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Espacio para el logo */}
        <div className="logo-container">
          <div className="logo-placeholder">Logo</div>
        </div>

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

          <div className="forgot-password">
            <Link to="/reset-password" className="forgot-link">
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