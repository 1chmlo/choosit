import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showcontrasena, setShowcontrasena] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) {
      setServerError("");
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    try {
      const result = await login(formData.email, formData.contrasena);
      
      if (result.success) {
        navigate("/perfil");
      } else {
        setServerError(result.error);
      }
    } catch (error) {
      setServerError("Ocurrió un error en el inicio de sesión. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <Link to="/">
          <img
            src="https://i.imgur.com/EXI0FXm.png"
            alt="Logo de Choosit"
            className="logo-image"
          />
        </Link>

        <h1 className="login-title">Iniciar Sesión</h1>
        
        {/* Mostrar mensaje de error del servidor si existe */}
        {serverError && (
          <div className="server-error-message">
            {serverError}
          </div>
        )}

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
                type={showcontrasena ? "text" : "password"}
                placeholder="••••••••"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowcontrasena(!showcontrasena)}
                className="toggle-contrasena"
              >
                {showcontrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="forgot-contrasena">
            <Link to="/olvide-contrasena" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Cargando
              </>
            ) : (
              "Iniciar Sesión"
            )}
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
  );
}