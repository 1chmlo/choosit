"use client"

import { useState } from "react"
import "./VisualizarSemestres.css"

export default function Semesters() {
  const [expandedSemesters, setExpandedSemesters] = useState({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const toggleSemester = (semesterId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }))
  }

  const semesters = Array.from({ length: 10 }, (_, i) => i + 1)

  const subjectData = {
    1: ["Matemática I", "Introducción a la Ingeniería"],
    2: ["Comunicación Oral", "Física I"],
    3: ["Comunicación Escrita", "Programación I"],
    4: ["Cálculo II", "Física II"],
    5: ["Electrónica", "Bases de Datos"],
    6: ["Comunicaciones Digitales", "Algoritmos"],
    7: ["Redes", "Sistemas Operativos"],
    8: ["Proyecto Integrador", "IA"],
    9: ["Taller Profesional", "Ética"],
    10: ["Práctica Profesional", "Seminario Final"],
  }

  const filteredSemesters = semesters.filter((semester) =>
    subjectData[semester].some((subject) =>
      subject.toLowerCase().includes(searchText.toLowerCase())
    )
  )

  return (
    <div className="semesters-container">
      {/* Barra de búsqueda */}
      <div className="search-container">
        <button className="search-toggle" onClick={() => setSearchOpen(!searchOpen)}>
          🔍
        </button>
        {searchOpen && (
          <input
            type="text"
            placeholder="Buscar ramo..."
            className="search-bar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}
      </div>

      <h1 className="semesters-title">Plan de Estudios</h1>
      <p className="semesters-subtitle">Explora el contenido por semestre</p>

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
                {subjectData[semester]
                  .filter((subject) =>
                    subject.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((subject, index) => (
                    <p key={index}>{subject}</p>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
