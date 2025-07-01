"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom" 
import "./VisualizarSemestres.css"
import { REACT_APP_BACKEND_URL } from "../config"
import { useAuth } from "../context/AuthContext"
import lupaIcon from "./Recurso_1lupa.svg"

export default function Semesters() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [expandedSemesters, setExpandedSemesters] = useState({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [asignaturas, setAsignaturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAutoExpanding, setIsAutoExpanding] = useState(false)

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAsignatura, setSelectedAsignatura] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    semestre: 1,
    descripcion: '',
    laboratorio: false,
    controles: false,
    proyecto: false,
    electivo: false
  })

  // Estados para manejo de errores
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Lista predefinida de todos los semestres (1 al 10)
  const allSemesters = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), [])

  // Función para normalizar texto (ignora tildes y mayúsculas)
  const normalizeText = useCallback((text) => {
    if (!text) return '';
    return text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }, []);

  // Función para verificar si una asignatura coincide con el término de búsqueda
  const matchesSearch = useCallback((asignatura) => {
    if (!asignatura) return false;
    const term = normalizeText(searchTerm);
    return (
      normalizeText(asignatura.nombre).includes(term) ||
      normalizeText(asignatura.codigo).includes(term)
    );
  }, [searchTerm, normalizeText]);

  // Cargar asignaturas
  const fetchAsignaturas = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/asignaturas`)
      setAsignaturas(response.data)
      setError(null)
    } catch (err) {
      console.error("Error al cargar asignaturas:", err)
      setError("No se pudieron cargar las asignaturas. Por favor, intenta de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAsignaturas()
  }, [])

  // Toggle manual para un semestre
  const toggleSemester = useCallback((semesterId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }))
  }, [])

  // Usar useMemo para evitar cálculos repetidos en cada renderizado
  const asignaturasPorSemestre = useMemo(() => {
    const semestreMap = {}
    
    // Inicializar todos los semestres como arrays vacíos
    allSemesters.forEach((sem) => {
      semestreMap[sem] = []
    })
    
    // Llenar con asignaturas disponibles
    asignaturas.forEach((asignatura) => {
      if (asignatura && asignatura.semestre) {
        semestreMap[asignatura.semestre].push(asignatura)
      }
    })
    
    return semestreMap
  }, [asignaturas, allSemesters])

  // Filtrar semestres según el término de búsqueda
  const filteredSemesters = useMemo(() => {
    return allSemesters.filter((sem) => {
      if (searchTerm.trim() === "") return true
      
      const asignaturasEnSemestre = asignaturasPorSemestre[sem] || [];
      return asignaturasEnSemestre.some((asignatura) => matchesSearch(asignatura))
    })
  }, [allSemesters, searchTerm, asignaturasPorSemestre, matchesSearch])

  // Manejar cambios en el término de búsqueda
  const handleSearchChange = useCallback((e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Si hay un término de búsqueda, marcar que vamos a auto-expandir
    if (newSearchTerm.trim() !== "") {
      setIsAutoExpanding(true);
    }
  }, []);

  // Expandir automáticamente los semestres que contienen resultados de búsqueda
  useEffect(() => {
    // Solo ejecutar la lógica si está marcado para auto-expandir
    if (!isAutoExpanding) return;
    
    // Resetear la marca para evitar ejecutar este efecto en ciclos futuros
    setIsAutoExpanding(false);
    
    if (searchTerm.trim() === "") {
      // Si se borró el término de búsqueda, no hacer nada más
      return;
    }

    // Expandir solo los semestres con resultados
    const autoExpanded = {};
    filteredSemesters.forEach((sem) => {
      autoExpanded[sem] = true;
    });
    
    // Actualizar estado preservando expansiones previas
    setExpandedSemesters(prev => ({
      ...prev,
      ...autoExpanded
    }));
  }, [isAutoExpanding, filteredSemesters, searchTerm]);

  // Manejar clic en asignatura
  const handleCursoClick = useCallback((event, asignatura) => {
    // Prevenir la propagación del evento para evitar conflictos
    event.preventDefault();
    event.stopPropagation();
    
    // Navegar a la página de visualización de asignatura con el código como parámetro
    console.log("Navegando a:", `/visualizar-asignatura?id=${asignatura.codigo}`);
    // Usar replace en lugar de navigate para evitar problemas con la pila de historial
    navigate(`/visualizar-asignatura?id=${asignatura.codigo}`, { replace: true });
  }, [navigate]);

  // Función para limpiar errores
  const clearErrors = () => {
    setFormErrors({})
    setSubmitError('')
  }

  // Función para procesar errores del backend
  const processBackendErrors = (errors) => {
    const errorMap = {}
    errors.forEach(error => {
      if (error.path) {
        errorMap[error.path] = error.msg
      }
    })
    return errorMap
  }

  // Funciones para manejar modales
  const openCreateModal = () => {
    setFormData({
      nombre: '',
      codigo: '',
      semestre: 1,
      descripcion: '',
      laboratorio: false,
      controles: false,
      proyecto: false,
      electivo: false
    })
    clearErrors()
    setShowCreateModal(true)
  }

  const openEditModal = (asignatura) => {
    setSelectedAsignatura(asignatura)
    setFormData({
      nombre: asignatura.nombre || '',
      codigo: asignatura.codigo || '',
      semestre: asignatura.semestre || 1,
      descripcion: asignatura.descripcion || '',
      laboratorio: asignatura.laboratorio || false,
      controles: asignatura.controles || false,
      proyecto: asignatura.proyecto || false,
      electivo: asignatura.electivo || false
    })
    clearErrors()
    setShowEditModal(true)
  }

  const openDeleteModal = (asignatura) => {
    setSelectedAsignatura(asignatura)
    clearErrors()
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedAsignatura(null)
    clearErrors()
  }

  // Crear asignatura
  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    setSubmitError('')
    setFormErrors({}) // Limpiar errores previos

    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/asignaturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          codigo: formData.codigo,
          nombre: formData.nombre,
          semestre: parseInt(formData.semestre),
          descripcion: formData.descripcion,
          laboratorio: formData.laboratorio,
          controles: formData.controles,
          proyecto: formData.proyecto,
          electivo: formData.electivo
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Si hay errores de validación
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors = processBackendErrors(data.errors)
          setFormErrors(backendErrors)
          setSubmitError('Por favor, corrige los errores en el formulario.')
        } else {
          // Error general
          setSubmitError(data.message || 'Error al crear la asignatura')
        }
        return
      }

      // Éxito
      await fetchAsignaturas()
      closeModals()
    } catch (error) {
      console.error('Error:', error)
      setSubmitError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Editar asignatura
  const handleEdit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    setSubmitError('')
    setFormErrors({}) // Limpiar errores previos

    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/asignaturas/${selectedAsignatura.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          codigo: formData.codigo,
          nombre: formData.nombre,
          semestre: parseInt(formData.semestre),
          descripcion: formData.descripcion,
          laboratorio: formData.laboratorio,
          controles: formData.controles,
          proyecto: formData.proyecto,
          electivo: formData.electivo
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Si hay errores de validación
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors = processBackendErrors(data.errors)
          setFormErrors(backendErrors)
          setSubmitError('Por favor, corrige los errores en el formulario.')
        } else {
          // Error general
          setSubmitError(data.error || data.message || 'Error al actualizar la asignatura')
        }
        return
      }

      // Éxito
      await fetchAsignaturas()
      closeModals()
    } catch (error) {
      console.error('Error:', error)
      setSubmitError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Eliminar asignatura
  const handleDelete = async () => {
    setSubmitLoading(true)
    clearErrors()

    try {
      await axios.patch(`${REACT_APP_BACKEND_URL}/api/asignaturas/soft_delete/${selectedAsignatura.id}`, {}, {
        withCredentials: true
      })
      closeModals()
      fetchAsignaturas() // Recargar lista
    } catch (err) {
      console.error('Error al eliminar asignatura:', err)
      
      if (err.response?.data?.error) {
        setSubmitError(err.response.data.error)
      } else {
        setSubmitError('Error al eliminar asignatura. Intenta de nuevo.')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpiar error específico del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="semesters-container">
      <h1 className="semesters-title">Plan de Estudios</h1>
      <p className="semesters-subtitle">Explora el contenido por semestre</p>

      <div className={`search-wrapper-inline ${searchOpen ? "expanded" : ""}`}>
        <button className="search-button" onClick={() => setSearchOpen(!searchOpen)}>
          <img src={lupaIcon} alt="Buscar" className="lupa-icon" />
        </button>
        {searchOpen && (
          <input
            type="text"
            className="search-input search-input-animated"
            placeholder="Buscar asignaturas..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}
      </div>

      {/* Botón para agregar asignatura (solo para admins) */}
      {isAdmin() && (
        <div className="admin-controls">
          <button className="btn-add-asignatura" onClick={openCreateModal}>
            Agregar Asignatura
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-message">Cargando asignaturas...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="semesters-list">
          {filteredSemesters.length === 0 ? (
            <div className="no-results">No se encontraron asignaturas</div>
          ) : (
            filteredSemesters.map((semester) => (
              <div key={semester} className="semester-item">
                <button
                  className={`semester-header ${expandedSemesters[semester] ? "expanded" : ""}`}
                  onClick={() => toggleSemester(semester)}
                >
                  <span className="semester-title">Semestre {semester}</span>
                  <span className="semester-icon">
                    {expandedSemesters[semester] ? "−" : "+"}
                  </span>
                </button>
                {expandedSemesters[semester] && (
                  <div className="semester-content">
                    {(searchTerm.trim() === ""
                      ? asignaturasPorSemestre[semester]
                      : asignaturasPorSemestre[semester].filter(matchesSearch)
                    ).length === 0 ? (
                      <div className="empty-semester">No hay asignaturas para este semestre</div>
                    ) : (
                      <div className="courses-grid">
                        {(searchTerm.trim() === ""
                          ? asignaturasPorSemestre[semester]
                          : asignaturasPorSemestre[semester].filter(matchesSearch)
                        ).map((asignatura) => (
                          <div key={asignatura.id} className="course-card">
                            <div 
                              className="course-content"
                              onClick={(e) => handleCursoClick(e, asignatura)}
                            >
                              <h3 className="course-name">{asignatura.nombre}</h3>
                              <span className="course-code">{asignatura.codigo}</span>
                            </div>
                            
                            {/* Botones de administración */}
                            {isAdmin() && (
                              <div className="admin-buttons">
                                <button 
                                  className="btn-edit"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openEditModal(asignatura)
                                  }}
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-delete"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openDeleteModal(asignatura)
                                  }}
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal para crear asignatura */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Crear Nueva Asignatura</h2>
            
            {submitError && (
              <div className="error-alert">{submitError}</div>
            )}

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className={formErrors.nombre ? 'error' : ''}
                />
                {formErrors.nombre && (
                  <span className="error-text">{formErrors.nombre}</span>
                )}
              </div>

              <div className="form-group">
                <label>Código:</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  required
                  placeholder="ej: cit-1234"
                  className={formErrors.codigo ? 'error' : ''}
                />
                {formErrors.codigo && (
                  <span className="error-text">{formErrors.codigo}</span>
                )}
              </div>

              <div className="form-group">
                <label>Semestre:</label>
                <select
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleInputChange}
                  className={formErrors.semestre ? 'error' : ''}
                >
                  {allSemesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
                {formErrors.semestre && (
                  <span className="error-text">{formErrors.semestre}</span>
                )}
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className={formErrors.descripcion ? 'error' : ''}
                />
                {formErrors.descripcion && (
                  <span className="error-text">{formErrors.descripcion}</span>
                )}
              </div>
              
              {/* Sección de tipos de asignatura */}
              <div className="form-group">
                <label>Tipos de asignatura:</label>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="laboratorio"
                      checked={formData.laboratorio}
                      onChange={handleInputChange}
                    />
                    <span>Laboratorio</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="controles"
                      checked={formData.controles}
                      onChange={handleInputChange}
                    />
                    <span>Controles</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="proyecto"
                      checked={formData.proyecto}
                      onChange={handleInputChange}
                    />
                    <span>Proyecto</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="electivo"
                      checked={formData.electivo}
                      onChange={handleInputChange}
                    />
                    <span>Electivo</span>
                  </label>
                </div>
              </div>

              <div className="modal-buttons">
                <button type="button" onClick={closeModals} disabled={submitLoading}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitLoading}>
                  {submitLoading ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar asignatura */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Asignatura</h2>
            
            {submitError && (
              <div className="error-alert">{submitError}</div>
            )}

            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className={formErrors.nombre ? 'error' : ''}
                />
                {formErrors.nombre && (
                  <span className="error-text">{formErrors.nombre}</span>
                )}
              </div>

              <div className="form-group">
                <label>Código:</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  required
                  className={formErrors.codigo ? 'error' : ''}
                />
                {formErrors.codigo && (
                  <span className="error-text">{formErrors.codigo}</span>
                )}
              </div>

              <div className="form-group">
                <label>Semestre:</label>
                <select
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleInputChange}
                  className={formErrors.semestre ? 'error' : ''}
                >
                  {allSemesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
                {formErrors.semestre && (
                  <span className="error-text">{formErrors.semestre}</span>
                )}
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className={formErrors.descripcion ? 'error' : ''}
                />
                {formErrors.descripcion && (
                  <span className="error-text">{formErrors.descripcion}</span>
                )}
              </div>
              
              {/* Sección de tipos de asignatura */}
              <div className="form-group">
                <label>Tipos de asignatura:</label>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="laboratorio"
                      checked={formData.laboratorio}
                      onChange={handleInputChange}
                    />
                    <span>Laboratorio</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="controles"
                      checked={formData.controles}
                      onChange={handleInputChange}
                    />
                    <span>Controles</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="proyecto"
                      checked={formData.proyecto}
                      onChange={handleInputChange}
                    />
                    <span>Proyecto</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="electivo"
                      checked={formData.electivo}
                      onChange={handleInputChange}
                    />
                    <span>Electivo</span>
                  </label>
                </div>
              </div>

              <div className="modal-buttons">
                <button type="button" onClick={closeModals} disabled={submitLoading}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitLoading}>
                  {submitLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar asignatura */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Eliminar Asignatura</h2>
            
            {submitError && (
              <div className="error-alert">{submitError}</div>
            )}

            <p>¿Estás seguro de que deseas eliminar la asignatura:</p>
            <p><strong>{selectedAsignatura?.nombre} ({selectedAsignatura?.codigo})</strong>?</p>
            <p>Esta acción no se puede deshacer.</p>
            
            <div className="modal-buttons">
              <button type="button" onClick={closeModals} disabled={submitLoading}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-danger" 
                onClick={handleDelete}
                disabled={submitLoading}
              >
                {submitLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}