"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./navbar.css"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-placeholder">Logo</div>
        </div>

        {/* Botón de menú móvil */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span className={`menu-icon ${menuOpen ? "open" : ""}`}></span>
        </button>

        {/* Enlaces de navegación */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/login" className="login-button">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="register-button">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  )
}