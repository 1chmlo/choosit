import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { logout, isAuthenticated, user } = useAuth();  // extraer user
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setMenuOpen(false);
      navigate("/visualizar-semestres");
    }
  };

  const isAdmin = user?.is_admin;  // true si es admin

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
          {isAuthenticated ? (
            <>
              <Link to="/visualizar-semestres" className="btn-outline">
                Ver Asignaturas
              </Link>
              <Link to="/perfil" className="btn-outline">
                Mi Perfil
              </Link>

              {/* Opciones Admin */}
              {isAdmin && (
                <div className="admin-dropdown">
                  <button
                    className="btn-outline"
                    onClick={toggleAdminMenu}
                  >
                    Opciones Admin
                  </button>
                  {adminMenuOpen && (
                    <div className="admin-dropdown-content">
                      <Link
                        to="/comentarios-reportados"
                        className="btn-outline"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        Comentarios Reportados
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <button className="btn-primary" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
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
          <span className="menu-toggle-icon">
            {menuOpen ? "✖" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="nav-links-mobile">
          {isAuthenticated ? (
            <>
              <Link
                to="/visualizar-semestres"
                className="btn-outline"
                onClick={toggleMenu}
              >
                Ver Asignaturas
              </Link>
              <Link
                to="/perfil"
                className="btn-outline"
                onClick={toggleMenu}
              >
                Mi Perfil
              </Link>

              {/* Link directo en mobile */}
              {isAdmin && (
                <Link
                  to="/comentarios-reportados"
                  className="btn-outline"
                  onClick={toggleMenu}
                >
                  Comentarios Reportados
                </Link>
              )}

              <button
                className="btn-primary"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-outline"
                onClick={toggleMenu}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                onClick={toggleMenu}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
