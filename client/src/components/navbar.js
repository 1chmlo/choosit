import { useState } from "react"
import { Link } from "react-router-dom"
import "./navbar.css"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo-area">
          <img
            src="https://i.imgur.com/EXI0FXm.png"
            alt="Logo de Choosit"
            className="logo-image"
          />
          <span className="logo-text">Choosit</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          <Link to="/login" className="btn-outline">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn-primary">
            Registrarse
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span className="menu-toggle-icon">{menuOpen ? "✖" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="nav-links-mobile">
          <Link to="/login" className="btn-outline" onClick={toggleMenu}>
            Iniciar Sesión
          </Link>
          <Link to="/register" className="btn-primary" onClick={toggleMenu}>
            Registrarse
          </Link>
        </div>
      )}
    </nav>
  )
}
