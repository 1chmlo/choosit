"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom" 
import "./VisualizarSemestres.css"
import { REACT_APP_BACKEND_URL } from "../config"
import lupaIcon from "./Recurso_1lupa.svg"

export default function Semesters() {
  const navigate = useNavigate()
  const [expandedSemesters, setExpandedSemesters] = useState({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [asignaturas, setAsignaturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAutoExpanding, setIsAutoExpanding] = useState(false)

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
                            onClick={(e) => handleCursoClick(e, asignatura)}
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