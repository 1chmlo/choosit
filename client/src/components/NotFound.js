import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-home">
            Ir al inicio
          </Link>
          <button onClick={() => window.history.back()} className="btn-back">
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
