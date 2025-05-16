import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // importa auth context, useAuth para acceder a isLoggedin y logout
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login"); // redirige a login...
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo-area" onClick={() => setMenuOpen(false)}>
          <img
            src="https://i.imgur.com/EXI0FXm.png"
            alt="Logo de Choosit"
            className="logo-image"
          />
          <span className="logo-text">Choosit</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          {isLoggedIn ? (
            <button className="btn-primary" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span className="menu-toggle-icon">{menuOpen ? "✖" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="nav-links-mobile">
          {isLoggedIn ? (
            <button
              className="btn-primary"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Cerrar Sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-outline" onClick={toggleMenu}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn-primary" onClick={toggleMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
