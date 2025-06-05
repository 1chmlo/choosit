import React, { useEffect, useState } from 'react';
import "./VisualizacionAsignatura.css";
import { REACT_APP_BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating'; 

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

    fetch(`${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(async (response) => {
      const data = await response.json();
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

  const mostrarRating = (id, label, ratingData) => {
    if (!ratingData) return null;
    const valor = ratingData.respuesta_calculada / 20;
    return (
      <div className="rating-item">
        <div className="rating-header">
          <span className="rating-label">{label}</span>
          <div className="rating-stars-value">
            <div className="stars-container" id={`${id}-stars`}>
              {StarRating(valor)}
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

  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    if (!comentarioNuevo.trim()) return;

    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_asignatura: asignatura.codigo,
          texto: comentarioNuevo
        }),
      });

      const data = await response.json();
      if (data.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await fetch(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const asignaturaData = await asignaturaResponse.json();
        
        setAsignatura(asignaturaData.asignatura);
        setComentarioNuevo('');
        setMensajeExito('Comentario publicado exitosamente');
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        throw new Error(data.message || 'Error al crear comentario');
      }
    } catch (error) {
      alert(error.message);
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
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/comentarios/reporte`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_comentario: reportModal.idComentario,
          motivo: motivo,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        alert('Comentario reportado exitosamente');
        setReportModal({ isOpen: false, idComentario: null });
      } else {
        throw new Error(data.error || 'Error al reportar comentario');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditarComentario = async () => {
    if (!textoEditado.trim()) return;

    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/comentarios/${editandoComentario.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          texto: textoEditado
        }),
      });

      const data = await response.json();
      if (data.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await fetch(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const asignaturaData = await asignaturaResponse.json();
        
        setAsignatura(asignaturaData.asignatura);
        setEditandoComentario(null);
        setTextoEditado('');
        setMensajeExito('Comentario actualizado exitosamente');
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        throw new Error(data.message || 'Error al editar comentario');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLikeComentario = async (idComentario) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/comentarios/${idComentario}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await fetch(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const asignaturaData = await asignaturaResponse.json();
        
        setAsignatura(asignaturaData.asignatura);
      } else {
        throw new Error(data.message || 'Error al dar like al comentario');
      }
    } catch (error) {
      alert(error.message);
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
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-info">
                          <span className="user-name">{comentario.nombre} {comentario.apellido}</span>
                          <span className="comment-date">{fecha}</span>
                        </div>
                          <span className="user-reputation">
                            Reputación: <span className="reputacion-valor">{comentario.reputacion}</span>
                          </span>
                        </div>
                      
                      {editandoComentario?.id === comentario.id ? (
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
                              <i className="fas fa-thumbs-up"></i> ({comentario.likes_usuarios?.length || 0})
                            </button>
                            
                            {esAutor && (
                              <button onClick={() => {
                                setEditandoComentario(comentario);
                                setTextoEditado(comentario.texto);
                              }}>
                                <i className="fas fa-edit"></i> Editar
                              </button>
                            )}
                            
                            {!esAutor && user && (
                              <button onClick={() => handleReportarComentario(comentario.id)}>
                                <i className="fas fa-flag"></i> Reportar
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