//
import React, { useEffect, useState, useCallback } from 'react';
import "./VisualizacionAsignatura.css";
import { REACT_APP_BACKEND_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import axios from 'axios';
import edit from "./edit.png"; 
import warning from "./warning.png"; 
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
  const [tieneRespuestasPrevias, setTieneRespuestasPrevias] = useState(false);

  // Función para cargar respuestas previas del usuario
  const cargarRespuestasPrevias = useCallback(async (codigo) => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_URL}/api/users/myanswers/${codigo}`, 
        { withCredentials: true }
      );

      if (response.data.ok && response.data.respuestas.length > 0) {
        // Convertir las respuestas a un objeto con id_pregunta como clave
        const respuestasMap = {};
        response.data.respuestas.forEach(respuesta => {
          respuestasMap[respuesta.id_pregunta] = respuesta.respuesta;
        });
        
        setRespuestas(respuestasMap);
        setTieneRespuestasPrevias(true);
      }
    } catch (error) {
      console.error('Error al cargar respuestas previas:', error);
      // No mostrar error al usuario ya que es opcional
    }
  }, [isAuthenticated, user]);

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
        // Agregar logs para verificar los datos
        console.log('Datos de asignatura recibidos:', data.asignatura);
        console.log('Comentarios con likes:', data.asignatura.comentarios?.map(c => ({
          id: c.id,
          texto: c.texto.substring(0, 30) + '...',
          likes_usuarios: c.likes_usuarios
        })));
        console.log('ID del usuario actual:', user?.id);
        
        setAsignatura(data.asignatura);
        setPreguntas(data.preguntas || []); 

        // Cargar respuestas previas del usuario después de cargar la asignatura
        cargarRespuestasPrevias(codigo);
      } else {
        throw new Error('Error al obtener datos de la asignatura');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setError('Error al cargar los datos de la asignatura');
    });
  }, [user?.id, isAuthenticated, cargarRespuestasPrevias]); // Agregar cargarRespuestasPrevias como dependencia

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

      if (response.status === 201 || response.status === 200) {
        // Recargar datos para reflejar cambios
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            withCredentials: true
          }
        );
        
        if (asignaturaResponse.data.ok) {
          setAsignatura(asignaturaResponse.data.asignatura);
          // No resetear respuestas después de enviar para mantener el estado
          setTieneRespuestasPrevias(true);
          setMensajeExito(tieneRespuestasPrevias ? 'Encuesta actualizada exitosamente' : 'Encuesta enviada exitosamente');
          setTimeout(() => setMensajeExito(''), 3000);
        }
      } else {
        throw new Error(response.data.message || "Error al enviar encuesta");
      }
    } catch (error) {
      console.error("Error al enviar encuesta:", error);
      // Priorizar errores de validación del servidor
      let errorMessage = "Error desconocido al enviar la encuesta";
      
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error al enviar la encuesta: ${errorMessage}`);
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
      if (response.status === 201) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            withCredentials: true
          }
        );
        const asignaturaData = asignaturaResponse.data;
        
        if (asignaturaData.ok) {
          setAsignatura(asignaturaData.asignatura);
          setComentarioNuevo('');
          setMensajeExito('Comentario publicado exitosamente');
          setTimeout(() => setMensajeExito(''), 3000);
        }
      } else {
        throw new Error(data.message || 'Error al crear comentario');
      }
    } catch (error) {
      console.error("Error al publicar comentario:", error);
      // Priorizar errores de validación del servidor
      let errorMessage = "Error desconocido al publicar el comentario";
      
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error al publicar el comentario: ${errorMessage}`);
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

      if (response.status === 201) {
        alert('Comentario reportado exitosamente');
        setReportModal({ isOpen: false, idComentario: null });
      } else {
        throw new Error(response.data.error || 'Error al reportar comentario');
      }
    } catch (error) {
      console.error("Error al reportar comentario:", error);
      // Priorizar errores de validación del servidor
      let errorMessage = "Error desconocido al reportar el comentario";
      
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error al reportar el comentario: ${errorMessage}`);
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

      if (response.status === 200) {
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('id');
        
        const asignaturaResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            withCredentials: true
          }
        );
        
        if (asignaturaResponse.data.ok) {
          setAsignatura(asignaturaResponse.data.asignatura);
          setEditandoComentario(null);
          setTextoEditado('');
          setMensajeExito('Comentario actualizado exitosamente');
          setTimeout(() => setMensajeExito(''), 3000);
        }
      } else {
        throw new Error(response.data.message || 'Error al editar comentario');
      }
    } catch (error) {
      console.error("Error al editar comentario:", error);
      // Priorizar errores de validación del servidor
      let errorMessage = "Error desconocido al editar el comentario";
      
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error al editar el comentario: ${errorMessage}`);
    }
  };

  const handleLikeComentario = async (idComentario) => {
    try {
      // Actualizar el estado inmediatamente (optimistic update)
      setAsignatura(prevAsignatura => {
        const comentariosActualizados = prevAsignatura.comentarios.map(comentario => {
          if (comentario.id === idComentario) {
            const yaLikeado = comentario.likes_usuarios?.includes(user.id);
            return {
              ...comentario,
              likes_usuarios: yaLikeado 
                ? comentario.likes_usuarios.filter(id => id !== user.id)
                : [...(comentario.likes_usuarios || []), user.id]
            };
          }
          return comentario;
        });
        
        return {
          ...prevAsignatura,
          comentarios: comentariosActualizados
        };
      });

      // Hacer la petición al servidor pero NO recargar todos los datos
      const response = await axios.patch(`${REACT_APP_BACKEND_URL}/api/comentarios/${idComentario}/like`, {}, {
        withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Error al dar like al comentario');
      }
      
      // Solo recargar si hay error, no en caso exitoso
    } catch (error) {
      console.error("Error al dar like al comentario:", error);
      
      // Revertir el cambio optimista en caso de error
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get('id');
      
      try {
        const asignaturaResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}/api/asignaturas/${codigo}/all`,
          {
            withCredentials: true
          }
        );
        
        if (asignaturaResponse.data.ok) {
          setAsignatura(asignaturaResponse.data.asignatura);
        }
      } catch (revertError) {
        console.error("Error al revertir cambios:", revertError);
      }
      
      // Priorizar errores de validación del servidor
      let errorMessage = "Error desconocido al dar like al comentario";
      
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error al dar like al comentario: ${errorMessage}`);
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
            <div className="encuestas-info">
              Basado en <span id="n-encuestas">{asignatura.cantidad_respuestas || 0}</span> encuestas
            </div>

            {preguntas.length > 0 && isAuthenticated && (
              <div className="encuesta-formulario">
                <h3>{tieneRespuestasPrevias ? 'Actualiza tu evaluación' : 'Responde la encuesta'}</h3>
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
                  {tieneRespuestasPrevias ? 'Reenviar Encuesta' : 'Enviar Encuesta'}
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

                  // LOGS DE DEBUG - ELIMINAR CUANDO FUNCIONE
                  console.log('===== DEBUG COMENTARIO =====');
                  console.log('Comentario ID:', comentario.id);
                  console.log('User ID actual:', user?.id);
                  console.log('Comentario id_usuario:', comentario.id_usuario);
                  console.log('Es autor?:', esAutor);
                  console.log('Usuario autenticado?:', !!user);
                  console.log('Tipos de datos:', {
                    user_id_type: typeof user?.id,
                    comentario_id_usuario_type: typeof comentario.id_usuario
                  });
                  console.log('===========================');

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
                            {/* Botón de like con estrella */}
                            <button 
                              onClick={() => handleLikeComentario(comentario.id)}
                              className={`like-button ${yaDioLike ? 'liked' : ''}`}
                            >
                              <span className={`star-like ${yaDioLike ? 'active' : ''}`}>★</span>
                              {yaDioLike ? 'Ya no me gusta' : 'Me gusta'}
                            </button>                 
                            
                            {/* Botón de editar - solo para el autor */}
                            {esAutor && (
                              <button 
                                className="edit-button"
                                onClick={() => {
                                  console.log('Editando comentario:', comentario.id); // LOG DEBUG
                                  setEditandoComentario(comentario);
                                  setTextoEditado(comentario.texto);
                                }}
                              >
                                <img
                                  src={edit}
                                  alt="Editar"
                                  className="icono"
                                /> 
                                Editar
                              </button>
                            )}
                            
                            {/* Botón de reportar - solo para otros usuarios */}
                            {!esAutor && (
                              <button 
                                className="report-button"
                                onClick={() => {
                                  console.log('Reportando comentario:', comentario.id); // LOG DEBUG
                                  handleReportarComentario(comentario.id);
                                }}
                              >
                                <img
                                  src={flag}
                                  alt="Reportar"
                                  className="icono"
                                /> 
                                Reportar
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