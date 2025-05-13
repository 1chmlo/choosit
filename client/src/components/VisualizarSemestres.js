"use client"

import { useState } from "react"
import "./VisualizarSemestres.css"

export default function Semesters() {
  // Estado para controlar qué semestres están expandidos
  const [expandedSemesters, setExpandedSemesters] = useState({})

  // Función para alternar la expansión de un semestre
  const toggleSemester = (semesterId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }))
  }

  // Generar 10 semestres
  const semesters = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="semesters-container">
      <h1 className="semesters-title">Plan de Estudios</h1>
      <p className="semesters-subtitle">Explora el contenido por semestre</p>

      <div className="semesters-list">
        {semesters.map((semester) => (
          <div key={semester} className="semester-item">
            <button
              className={`semester-header ${expandedSemesters[semester] ? "expanded" : ""}`}
              onClick={() => toggleSemester(semester)}
            >
              <span className="semester-title">Semestre {semester}</span>
              <span className="semester-icon">{expandedSemesters[semester] ? "−" : "+"}</span>
            </button>
            {expandedSemesters[semester] && (
              <div className="semester-content">
                {/* Contenido vacío por ahora, como solicitado */}
                <div className="empty-content">
                  <p>Contenido del Semestre {semester}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
