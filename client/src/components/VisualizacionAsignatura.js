import React, { useEffect, useState } from 'react';
import "./VisualizacionAsignatura.css";
import { REACT_APP_BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import axios from 'axios';
import edit from "./edit.png"; 
import warning from "./warning.png"; 
import thumbsUp from "./thumbsUp.png";
import flag from "./flag.png";


const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [motivo, setMotivo] = useState("");
  
  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h3>Reportar comentario</h3>
        <textarea 
          value={motivo} 
          onChange={(e) => setMotivo(e.target.value)} 
          placeholder="Motivo del reporte..."
        />
        <div className="modal-buttons">
          <button className="modal-submit" onClick={() => onSubmit(motivo)}>Enviar</button>
          <button className="modal-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const VisualizacionAsignatura = () => {
  const { user, isAuthenticated } = useAuth();
  const [asignatura, setAsignatura] = useState(null);
  const [error, setError] = useState('');
  const [comentarioNuevo, setComentarioNuevo] = useState('');
  const [editandoComentario, setEditandoComentario] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [preguntas, setPreguntas] = useState([]);
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    idComentario: null,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get('id');

    if (!codigo) {
      setError('No se ha especificado una asignatura');
      return;
    }

    axios.get(`${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`, {
      withCredentials: true
    })
    .then((response) => {
      const data = response.data;
      if (data.ok) {
        setAsignatura(data.asignatura);
        setPreguntas(data.preguntas || []); 
      } else {
        throw new Error('Error al obtener datos de la asignatura');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setError('Error al cargar los datos de la asignatura');
    });
  }, []);

  const mostrarMetodo = (id, valor) => (
    <span id={id}>
      {id.charAt(0).toUpperCase() + id.slice(1)}: <span className="valor">{valor ? 'Sí' : 'No'}</span>
    </span>
  );

 const mostrarRating = (pregunta, ratingData) => {
  if (!ratingData || !pregunta) return null;
  
  // Parse the string value to number and ensure it's within 1-5 range
  const valor = parseFloat(ratingData.respuesta_calculada);
  const porcentaje = (valor / 5) * 100; // Convert to percentage for progress bar
  
  // Create static stars display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <span key={i} className="star full-star">★</span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <span key={i} className="star half-star">★</span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={i} className="star empty-star">☆</span>
        );
      }
    }
    return stars;
  };
  
  return (
    <div className="rating-item" key={pregunta.id}>
      <div className="rating-header">
        <span className="rating-label">{pregunta.pregunta}</span>
        <div className="rating-stars-value">
          <div className="stars-container static-stars">
            {renderStars(valor)}
          </div>
          <span className="rating-value">{valor.toFixed(1)}</span>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${porcentaje}%` }}></div>
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
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/encuestas`, payload, {
        withCredentials: true
      });

      const data = response.data;
      alert(data.message || "Encuesta enviada");
    } catch (error) {
      console.error("Error al enviar encuesta:", error);
      alert("Error al enviar la encuesta");
    }
  };

  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    if (!comentarioNuevo.trim()) return;

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/comentarios`, {
        id_asignatura: asignatura.id,
        texto: comentarioNuevo
      }, {
        withCredentials: true
      });

      const data = response.data;
      if (data.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            withCredentials: true
          }
        );
        const asignaturaData = asignaturaResponse.data;
        
        setAsignatura(asignaturaData.asignatura);
        setComentarioNuevo('');
        setMensajeExito('Comentario publicado exitosamente');
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        throw new Error(data.message || 'Error al crear comentario');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleReportarComentario = (idComentario) => {
    setReportModal({
      isOpen: true,
      idComentario,
    });
  };

  const handleSubmitReport = async (motivo) => {
    if (!motivo) return;

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/comentarios/reporte`, {
        id_comentario: reportModal.idComentario,
        motivo: motivo,
      }, {
        withCredentials: true
      });

      const data = response.data;
      if (data.ok) {
        alert('Comentario reportado exitosamente');
        setReportModal({ isOpen: false, idComentario: null });
      } else {
        throw new Error(data.error || 'Error al reportar comentario');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEditarComentario = async () => {
    if (!textoEditado.trim()) return;

    try {
      const response = await axios.patch(`${REACT_APP_BACKEND_URL}/api/comentarios/${editandoComentario.id}`, {
        texto: textoEditado
      }, {
        withCredentials: true
      });

      const data = response.data;
      if (data.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            withCredentials: true
          }
        );
        const asignaturaData = asignaturaResponse.data;
        
        setAsignatura(asignaturaData.asignatura);
        setEditandoComentario(null);
        setTextoEditado('');
        setMensajeExito('Comentario actualizado exitosamente');
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        throw new Error(data.message || 'Error al editar comentario');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleLikeComentario = async (idComentario) => {
    try {
      const response = await axios.patch(`${REACT_APP_BACKEND_URL}/api/comentarios/${idComentario}/like`, {}, {
        withCredentials: true
      });

      const data = response.data;
      if (data.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            withCredentials: true
          }
        );
        const asignaturaData = asignaturaResponse.data;
        
        setAsignatura(asignaturaData.asignatura);
      } else {
        throw new Error(data.message || 'Error al dar like al comentario');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  if (error) {
    return (
      <div className="fondo-blanco">
        <div className="container">
          <div className="error-message">
            <img
              src={warning}
              alt="Advertencia"
              className="icono"
            />
            <h2>{error}</h2>
            <p>Por favor, verifica el ID de la asignatura e intenta nuevamente.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asignatura) return null;

  // Create ratings map from respuestasPonderadas
  const ratingsMap = Object.fromEntries(
    (asignatura.respuestasPonderadas || []).map((r) => [r.id_pregunta, r])
  );

  // Get preguntas that have ratings data
  const preguntasConRatings = preguntas.filter(pregunta => ratingsMap[pregunta.id]);

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
              {mostrarMetodo('laboratorio', asignatura.laboratorio)}
              {mostrarMetodo('controles', asignatura.controles)}
              {mostrarMetodo('proyecto', asignatura.proyecto)}
              {mostrarMetodo('electivo', asignatura.electivo)}
            </div>
          </section>

          <section className="resumen-evaluacion">
            <div className="evaluacion-box">
              <h2 className="evaluacion-titulo">Resumen de Evaluaciones</h2>
              {preguntasConRatings.length > 0 ? (
                preguntasConRatings.map(pregunta => 
                  mostrarRating(pregunta, ratingsMap[pregunta.id])
                )
              ) : (
                <p>No hay evaluaciones disponibles aún.</p>
              )}
            </div>
            



              {/* QUITAR DISPLAY NONE CUANDO EXISTA LA FUNCIONALIDAD */}
            <div className="encuestas-info" style={{ display: 'none' }}>
              Basado en <span id="n-encuestas">{asignatura.n_encuestas || 0}</span> encuestas
            </div>









            {preguntas.length > 0 && isAuthenticated && (
              <div className="encuesta-formulario">
                <h3>Responde la encuesta</h3>
                {preguntas.map((pregunta) => (
                  <div key={pregunta.id} className="pregunta-item">
                    <p>{pregunta.pregunta}</p>
                    <StarRating
                      rating={respuestas[pregunta.id] || 0}
                      onRate={(rating) => handleRating(pregunta.id, rating)}
                      readOnly={false}
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
            
            {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
            
            {isAuthenticated && (
              <form onSubmit={handleSubmitComentario} className="comentario-form">
                <textarea
                  value={comentarioNuevo}
                  onChange={(e) => setComentarioNuevo(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  rows="3"
                  required
                />
                <button type="submit">Publicar comentario</button>
              </form>
            )}

            <div className="comentarios-container" id="comentarios-container">
              {asignatura.comentarios?.length ? (
                asignatura.comentarios.map((comentario, index) => {
                  const fecha = new Date(comentario.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  });
                  
                  const esAutor = user && comentario.id_usuario === user.id;
                  const yaDioLike = user && comentario.likes_usuarios?.includes(user.id);

                  return (
                    <div className="comentario-box" key={index}>
                      <div className="comentario-header">
                        <div className="user-avatar">
                          <div className="iniciales-usuario">
                            {comentario.nombre.charAt(0).toUpperCase()}
                            {comentario.apellido.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="user-info">
                          <span className="user-name">{comentario.nombre} {comentario.apellido}</span>
                          <span className="comment-date">{fecha}</span>
                        </div>
                          <span className="user-reputation">
                            Reputación: <span className="reputacion-valor">{comentario.reputacion}</span>
                          </span>
                        </div>
                      
                      {editandoComentario?.id === comentario.id && esAutor ? (
                        <div className="editar-comentario">
                          <textarea
                            value={textoEditado}
                            onChange={(e) => setTextoEditado(e.target.value)}
                            rows="3"
                          />
                          <div className="editar-comentario-botones">
                            <button onClick={handleEditarComentario}>Guardar</button>
                            <button onClick={() => setEditandoComentario(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="comentario-texto">{comentario.texto}</div>
                      )}
                      
                      <div className="comentario-acciones">
                        {user && (
                          <>
                            <button 
                              onClick={() => handleLikeComentario(comentario.id)}
                              className={yaDioLike ? 'liked' : ''}
                            >
                              <img
                                  src={thumbsUp}
                                  alt="Like"
                                  className="icono"
                                /> ({comentario.likes_usuarios?.length || 0})
                            </button>
                            
                            {esAutor && (
                              <button onClick={() => {
                                setEditandoComentario(comentario);
                                setTextoEditado(comentario.texto);
                              }}>
                                <img
                                  src={edit}
                                  alt="Editar"
                                  className="icono"
                                /> Editar
                              </button>
                            )}
                            
                            {!esAutor && user && (
                              <button onClick={() => handleReportarComentario(comentario.id)}>
                                <img
                                  src={flag}
                                  alt="Reportar"
                                  className="icono"
                                /> Reportar
                              </button>
                            )}
                          </>
                        )}
                      </div>
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

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, idComentario: null })}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};

export default VisualizacionAsignatura;