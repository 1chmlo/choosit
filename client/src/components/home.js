import { Link } from "react-router-dom";
import "./home.css"

export default function HomeContent() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Bienvenido a Choosit!</h1>
        <p className="hero-subtitle">El lugar perfecto para comenzar consultar sobre las asignaturas que vas a tomar.</p>
        <div className="hero-buttons">
          <Link to="/VisualizasAsignaturas" className="hero-button primary">
            Visualizar Asignaturas
          </Link>
          <a href="#features" className="hero-button secondary">
            Contactar   
          </a>
        </div>
      </div>

      <div className="features-section" id="features">
        <h2 className="section-title">Se parte de nuestra comunidad.</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Rápido y Eficiente</h3>
            <p className="feature-description">
              Obtén información de asignaturas de forma rápida y eficiente.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Seguro</h3>
            <p className="feature-description">Tu información siempre estará protegida con nosotros.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3 className="feature-title">Intuitivo</h3>
            <p className="feature-description">Interfaz fácil de usar diseñada para todos los estudiantes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}