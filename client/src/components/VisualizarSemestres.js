"use client"

import { useState, useEffect } from "react"
import "./VisualizarSemestres.css"

export default function Semesters() {
  const [expandedSemesters, setExpandedSemesters] = useState({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleSemester = (semesterId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }))
  }

  const semesters = Array.from({ length: 10 }, (_, i) => i + 1)

  const fakeData = {
    1: ["Matemática", "Comunicación"],
    2: ["Comunicación Digital", "Programación"],
    3: ["Redes", "Bases de Datos"],
    4: ["Física", "Cálculo"],
    5: ["Estadística", "Inglés Técnico"],
    6: ["Inteligencia Artificial", "Algoritmos"],
  }

  const filteredSemesters = semesters.filter((sem) =>
    searchTerm.trim() === ""
      ? true
      : fakeData[sem]?.some((ramo) =>
          ramo.toLowerCase().includes(searchTerm.toLowerCase())
        )
  )

  useEffect(() => {
    if (searchTerm.trim() === "") return
    const autoExpanded = {}
    filteredSemesters.forEach((sem) => {
      autoExpanded[sem] = true
    })
    setExpandedSemesters(autoExpanded)
  }, [searchTerm])

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
            className="search-input"
            placeholder="Buscar ramos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      <div className="semesters-list">
        {filteredSemesters.map((semester) => (
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
                <div className="empty-content">
                  <ul>
                    {fakeData[semester]?.map((ramo, idx) => (
                      <li key={idx}>{ramo}</li>
                    )) || (
                      <li>No hay asignaturas registradas para este semestre.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
