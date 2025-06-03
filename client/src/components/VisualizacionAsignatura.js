import React, { useEffect, useState } from 'react';
import "./VisualizacionAsignatura.css";
import { REACT_APP_BACKEND_URL } from '../config';
import StarRating from './StarRating'; // Asegúrate de tener este componente

const VisualizacionAsignatura = () => {
  const [asignatura, setAsignatura] = useState(null);
  const [error, setError] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get('id');

    if (!codigo) {
      setError('No se ha especificado una asignatura');
      return;
    }

    fetch(`${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`) 
      .then((res) => {
        if (!res.ok) throw new Error('Asignatura no encontrada');
        return res.json();
      })
      .then((data) => {
        if (data.ok) {
          setAsignatura(data.asignatura);
          setPreguntas(data.preguntas || []);
        } else throw new Error();
      })
      .catch(() => {
        setError('Error al cargar los datos de la asignatura');
      });
  }, []);

  const generarEstrellas = (rating) => {
    const fullWidth = rating * 20;
    return (
      <div className="stars-container">
        <div className="stars-foreground" style={{ width: `${fullWidth}%` }}>★★★★★</div>
        <div className="stars-background">★★★★★</div>
      </div>
    );
  };

  const mostrarMetodo = (id, valor) => (
    <span id={id}>
      {id.charAt(0).toUpperCase() + id.slice(1)}: <span className="valor">{valor ? 'Sí' : 'No'}</span>
    </span>
  );

  const mostrarRating = (id, label, ratingData) => {
    if (!ratingData) return null;
    const valor = ratingData.respuesta_calculada / 20;
    return (
      <div className="rating-item">
        <div className="rating-header">
          <span className="rating-label">{label}</span>
          <div className="rating-stars-value">
            <div className="stars-container" id={`${id}-stars`}>
              {generarEstrellas(valor)}
            </div>
            <span className="rating-value" id={`${id}-valor`}>{valor.toFixed(1)}</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" id={`${id}-bar`} style={{ width: `${ratingData.respuesta_calculada}%` }}></div>
        </div>
      </div>
    );
  };

  const handleRating = (idPregunta, rating) => {
    setRespuestas((prev) => ({ ...prev, [idPregunta]: rating }));
  };

  const enviarEncuesta = async () => {
    if (Object.keys(respuestas).length !== preguntas.length) {
      alert("Debes responder todas las preguntas antes de enviar.");
      return;
    }

    const payload = {
      id_asignatura: asignatura.id,
      respuestas: Object.entries(respuestas).map(([id_pregunta, respuesta]) => ({
        id_pregunta,
        respuesta,
      })),
    };

    try {
      const res = await fetch(`${REACT_APP_BACKEND_URL}/api/encuestas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Encuesta enviada");
    } catch (error) {
      console.error("Error al enviar encuesta:", error);
      alert("Error al enviar la encuesta");
    }
  };

  if (error) {
    return (
      <div className="fondo-blanco">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>{error}</h2>
            <p>Por favor, verifica el ID de la asignatura e intenta nuevamente.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asignatura) return null;

  const ratingsMap = Object.fromEntries(
    (asignatura.ratings || []).map((r) => [r.id_pregunta, r])
  );

  return (
    <div className="fondo-blanco">
      <div className="container">
        <header>
          <h1 id="asignatura-nombre">{asignatura.nombre}</h1>
        </header>

        <main>
          <section className="descripcion">
            <h2>Descripción</h2>
            <p id="asignatura-descripcion">{asignatura.descripcion}</p>
            <div className="metodos-evaluacion">
              {mostrarMetodo('lab', asignatura.lab)}
              {mostrarMetodo('controles', asignatura.controles)}
              {mostrarMetodo('proyecto', asignatura.proyecto)}
              {mostrarMetodo('cfg', asignatura.cfg)}
            </div>
          </section>

          <section className="resumen-evaluacion">
            <div className="evaluacion-box">
              <h2 className="evaluacion-titulo">Resumen de Evaluaciones</h2>
              {mostrarRating('dificultad', 'Dificultad:', ratingsMap['ID_PREGUNTA_DIFICULTAD'])}
              {mostrarRating('tiempo', 'Tiempo requerido:', ratingsMap['ID_PREGUNTA_TIEMPO'])}
              {mostrarRating('material', 'Calidad del material:', ratingsMap['ID_PREGUNTA_MATERIAL'])}
            </div>
            <div className="encuestas-info">
              Basado en <span id="n-encuestas">{asignatura.n_encuestas || 0}</span> encuestas
            </div>

            {/* NUEVA SECCIÓN: Encuesta del usuario */}
            {preguntas.length > 0 && (
              <div className="encuesta-formulario">
                <h3>Responde la encuesta</h3>
                {preguntas.map((pregunta) => (
                  <div key={pregunta.id} className="pregunta-item">
                    <p>{pregunta.pregunta}</p>
                    <StarRating
                      rating={respuestas[pregunta.id] || 0}
                      onRate={(rating) => handleRating(pregunta.id, rating)}
                    />
                  </div>
                ))}
                <button className="btn-enviar-encuesta" onClick={enviarEncuesta}>
                  Enviar Encuesta
                </button>
              </div>
            )}
          </section>

          <section className="comentarios">
            <h2>Comentarios</h2>
            <div className="comentarios-container" id="comentarios-container">
              {asignatura.comentarios?.length ? (
                asignatura.comentarios.map((comentario, index) => {
                  const fecha = new Date(comentario.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  });
                  return (
                    <div className="comentario-box" key={index}>
                      <div className="comentario-header">
                        <div className="user-avatar">
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-info">
                          <span className="user-name">{comentario.nombre} {comentario.apellido}</span>
                          <span className="comment-date">{fecha}</span>
                        </div>
                        <span className="user-reputation">
                          Puntuación:
                          <span className="user-stars">
                            {'★'.repeat(comentario.reputacion)}{'☆'.repeat(5 - comentario.reputacion)}
                          </span>
                        </span>
                      </div>
                      <div className="comentario-texto">{comentario.texto}</div>
                    </div>
                  );
                })
              ) : (
                <div className="no-comments">No hay comentarios disponibles</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default VisualizacionAsignatura;
