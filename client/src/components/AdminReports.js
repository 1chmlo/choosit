"use client"

import { useState, useEffect } from "react"
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { REACT_APP_BACKEND_URL } from "../config"
import "./AdminReports.css"

export default function AdminReports() {
  // Elimino 'user' e 'isAuthenticated' que no se usan
  const { isAdmin, loading: authLoading } = useAuth();
  const [reportedComments, setReportedComments] = useState([])
  const [selectedComment, setSelectedComment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Resto del código permanece igual...
  // Cargar datos reales desde la API
  useEffect(() => {
    // Si no es admin, no cargar datos
    if (!isAdmin()) {
      return;
    }
    
    const fetchReportedComments = async () => {
      try {
        setLoading(true);
        
        // Obtener los reportes desde la API usando REACT_APP_BACKEND_URL
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/comentarios/reportes`, {
          withCredentials: true
        });
        
        if (!response.data || response.data.length === 0) {
          setReportedComments([]);
          setLoading(false);
          return;
        }
        
        // Agrupar reportes por comentario
        const reportGroups = {};
        
        // Procesar los reportes y agruparlos por id_comentario
        for (const report of response.data) {
          if (!reportGroups[report.id_comentario]) {
            reportGroups[report.id_comentario] = {
              id: report.id_comentario,
              reports: [],
              // Usar el contenido real del comentario cuando está disponible
              text: report.contenido_comentario || `Motivo del reporte: "${report.motivo}"`,
              commentContent: report.contenido_comentario || "Contenido no disponible",
              user: { 
                id: report.autor_comentario,
                name: report.autor_comentario ? report.autor_comentario.substring(0, 8) + "..." : report.id_usuario.substring(0, 8) + "...", 
                email: "No disponible" 
              },
              created_at: report.fecha_comentario || report.fecha || new Date().toISOString()
            };
          }
          
          // Agregar este reporte al grupo correspondiente con el ID completo
          reportGroups[report.id_comentario].reports.push({
            id: report.id,
            user_id: report.id_usuario, // Guardar el ID completo
            user: { name: report.id_usuario.substring(0, 8) + "..." },
            reason: report.motivo,
            created_at: report.fecha
          });
        }
        
        // Convertir el objeto de grupos a un array
        const commentsList = Object.values(reportGroups);
        
        // Ordenar por número de reportes (descendente)
        const sortedData = commentsList.sort((a, b) => b.reports.length - a.reports.length);
        
        setReportedComments(sortedData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los comentarios reportados:", err);
        setError("No se pudieron cargar los comentarios reportados. Por favor, intenta de nuevo más tarde.");
        setReportedComments([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportedComments();
  }, [isAdmin]);

  const openModal = (comment) => {
    setSelectedComment(comment)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedComment(null)
  }

  const handleRejectReports = async (commentId) => {
    try {
      // Usar REACT_APP_BACKEND_URL en la URL
      console.log("Enviando solicitud a:", `${REACT_APP_BACKEND_URL}/api/admin/comentarios/${commentId}/reject-reports`);
      
      // Usar fetch nativo en lugar de axios para evitar problemas de configuración
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/admin/comentarios/${commentId}/reject-reports`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Equivalente a withCredentials: true
        body: JSON.stringify({}) // Cuerpo vacío
      });
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Respuesta:", data);
      
      if (data && data.message) {
        // Remover el comentario de la lista
        setReportedComments((prev) => prev.filter((comment) => comment.id !== commentId));
        closeModal();
        alert(data.message || "Reportes rechazados exitosamente");
      } else {
        throw new Error("Error al rechazar los reportes");
      }
    } catch (error) {
      console.error("Error completo:", error);
      alert(error.message || "Error al rechazar los reportes. Por favor, intenta de nuevo.");
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    try {
      // Usar REACT_APP_BACKEND_URL en la URL
      console.log("Enviando solicitud a:", `${REACT_APP_BACKEND_URL}/api/admin/comentarios/${commentId}`);
      
      // Usar fetch nativo en lugar de axios
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/admin/comentarios/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Equivalente a withCredentials: true
      });
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Respuesta:", data);
      
      if (data && data.message) {
        // Remover el comentario de la lista
        setReportedComments((prev) => prev.filter((comment) => comment.id !== commentId));
        closeModal();
        alert(data.message || "Comentario eliminado exitosamente");
      } else {
        throw new Error("Error al eliminar el comentario");
      }
    } catch (error) {
      console.error("Error completo:", error);
      alert(error.message || "Error al eliminar el comentario. Por favor, intenta de nuevo.");
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Si aún está cargando la autenticación, muestra un loader
  if (authLoading) {
    return (
      <div className="reportes admin-reports-container">
        <div className="reportes loading">Verificando permisos...</div>
      </div>
    )
  }

  // Si no es admin, redirige a la página principal
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="reportes admin-reports-container">
        <div className="reportes loading">Cargando comentarios reportados...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="reportes admin-reports-container">
        <div className="reportes error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="reportes admin-reports-container">
      <h1 className="reportes admin-title">Gestión de Reportes</h1>
      <p className="reportes admin-subtitle">Comentarios reportados ordenados por número de reportes</p>

      <div className="reportes reports-list">
        {reportedComments.length === 0 ? (
          <div className="reportes no-reports">
            <p>No hay comentarios reportados pendientes de revisión.</p>
          </div>
        ) : (
          reportedComments.map((comment) => (
            <div key={comment.id} className="reportes report-item" onClick={() => openModal(comment)}>
              <div className="reportes report-header">
                <div className="reportes report-info">
                  <span className="reportes comment-label">COMENTARIO:</span>
                  <span className="reportes comment-preview">
                    {/* Mostrar el contenido real del comentario */}
                    {comment.commentContent ? 
                      (comment.commentContent.length > 100 ? 
                        `${comment.commentContent.substring(0, 100)}...` : 
                        comment.commentContent) : 
                      "Contenido no disponible"}
                  </span>
                  <span className="reportes comment-author">Por: {comment.user.name}</span>
                </div>
                <div className="reportes report-stats">
                  <span className="reportes report-count">{comment.reports.length} reportes</span>
                  <span className="reportes report-date">{formatDate(comment.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedComment && (
        <div className="reportes modal-overlay" onClick={closeModal}>
          <div className="reportes modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reportes modal-header">
              <h2>Detalles del Comentario Reportado</h2>
              <button className="reportes close-button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="reportes modal-body">
              <div className="reportes comment-details">
                <div className="reportes detail-section">
                  <h3>Comentario</h3>
                  <div className="reportes comment-text">
                    <p><strong>ID:</strong> {selectedComment.id}</p>
                    <p><strong>Contenido:</strong> {selectedComment.commentContent}</p>
                  </div>
                </div>

                <div className="reportes detail-section">
                  <h3>Información del Comentario</h3>
                  <div className="reportes user-info">
                    <p>
                      <strong>Usuario:</strong> {selectedComment.user.name}
                    </p>
                    <p>
                      <strong>Fecha del comentario:</strong> {formatDate(selectedComment.created_at)}
                    </p>
                  </div>
                </div>

                <div className="reportes detail-section">
                  <h3>Reportes ({selectedComment.reports.length})</h3>
                  <div className="reportes reports-list-modal">
                    {selectedComment.reports.map((report) => (
                      <div key={report.id} className="reportes report-detail">
                        <div className="reportes report-user">
                          <strong>Reportado por:</strong> {report.user_id.substring(0, 8)}...
                        </div>
                        <div className="reportes report-reason">
                          <strong>Motivo:</strong> {report.reason}
                        </div>
                        <div className="reportes report-date-detail">
                          <strong>Fecha:</strong> {formatDate(report.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="reportes modal-footer">
              <button className="reportes cancel-button" onClick={closeModal}>
                Cancelar
              </button>
              <button className="reportes reject-button" onClick={() => handleRejectReports(selectedComment.id)}>
                Rechazar Reportes
              </button>
              <button className="reportes delete-button" onClick={() => handleDeleteComment(selectedComment.id)}>
                Eliminar Comentario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}