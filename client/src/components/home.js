import { Link } from "react-router-dom";
import "./home.css"

export default function HomeContent() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Bienvenido a Choosit!</h1>
        <p className="hero-subtitle">El lugar perfecto para comenzar consultar sobre las asignaturas que vas a tomar.</p>
        <div className="hero-buttons">
          <Link to="/visualizar-semestres" className="hero-button primary">
            Visualizar Asignaturas
          </Link>
          <a href="#about" className="hero-button secondary">
            ¿Qué es Choosit?   
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

      <div className="about-section" id="about">
        <h2 className="section-title">¿Qué es Choosit?</h2>
        <div className="about-content">
          <p>
            Choosit es una plataforma diseñada específicamente para estudiantes de la carrera de Ingeniería en Informática y 
            Telecomunicaciones de la Universidad Diego Portales (UDP). La plataforma permite a los estudiantes:
          </p>
          <ul className="about-list">
            <li>Realizar evaluaciones de los ramos cursados</li>
            <li>Visualizar resúmenes estadísticos informativos sobre cada asignatura</li>
            <li>Consultar métricas clave como nivel de dificultad, carga académica y calidad de la enseñanza</li>
            <li>Acceder a opiniones y experiencias de otros estudiantes para tomar decisiones informadas sobre su planificación académica</li>
          </ul>
          <p>
            El objetivo principal de Choosit es proporcionar información valiosa basada en experiencias reales que ayude a los 
            estudiantes a tomar mejores decisiones en su trayectoria universitaria.
          </p>
        </div>
      </div>
    </div>
  )
}