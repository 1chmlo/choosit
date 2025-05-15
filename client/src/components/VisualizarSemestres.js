"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./VisualizarSemestres.css"
import { REACT_APP_BACKEND_URL } from "../config"

export default function Semesters() {
  const [expandedSemesters, setExpandedSemesters] = useState({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [asignaturas, setAsignaturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Lista predefinida de todos los semestres (1 al 10)
  const allSemesters = Array.from({ length: 10 }, (_, i) => i + 1)

  useEffect(() => {
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

    fetchAsignaturas()
  }, [])

  const toggleSemester = (semesterId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }))
  }

  // Función para normalizar texto (ignora tildes y mayúsculas)
  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  // Función para verificar si una asignatura coincide con el término de búsqueda
  const matchesSearch = (asignatura) => {
    const term = normalizeText(searchTerm)
    return (
      normalizeText(asignatura.nombre).includes(term) ||
      normalizeText(asignatura.codigo).includes(term)
    )
  }

  // Organizar asignaturas por semestre
  const asignaturasPorSemestre = {}

  // Inicializar todos los semestres como arrays vacíos
  allSemesters.forEach((sem) => {
    asignaturasPorSemestre[sem] = []
  })

  // Llenar con asignaturas disponibles
  asignaturas.forEach((asignatura) => {
    asignaturasPorSemestre[asignatura.semestre].push(asignatura)
  })

  // Filtrar semestres según el término de búsqueda
  const filteredSemesters = allSemesters.filter((sem) => {
    if (searchTerm.trim() === "") return true

    return asignaturasPorSemestre[sem]?.some(matchesSearch)
  })

  // Expandir automáticamente los semestres que contienen resultados de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") return

    const autoExpanded = {}
    filteredSemesters.forEach((sem) => {
      autoExpanded[sem] = true
    })
    setExpandedSemesters(autoExpanded)
  }, [searchTerm, filteredSemesters])

  const handleCursoClick = (asignatura) => {
    // Aquí puedes implementar lo que ocurre al hacer clic en un curso
    console.log("Curso seleccionado:", asignatura)
    // Por ejemplo, podrías abrir un modal con detalles del curso
    // o navegar a una página de detalles
  }

  return (
    <div className="semesters-container">
      <h1 className="semesters-title">Plan de Estudios</h1>
      <p className="semesters-subtitle">Explora el contenido por semestre</p>

      <div className={`search-wrapper-inline ${searchOpen ? "expanded" : ""}`}>
        <button className="search-button" onClick={() => setSearchOpen(!searchOpen)}>
          🔍
        </button>
        {searchOpen && (
          <input
            type="text"
            className="search-input search-input-animated"
            placeholder="Buscar asignaturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

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
                          <div
                            key={asignatura.id}
                            className="course-card"
                            onClick={() => handleCursoClick(asignatura)}
                          >
                            <h3 className="course-name">{asignatura.nombre}</h3>
                            <span className="course-code">{asignatura.codigo}</span>
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
    </div>
  )
}
