import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const TECHNOLOGIES = [
  "JavaScript", "React", "Angular", "Vue.js", "Node.js",
  "Python", "Django", "Flask", "Java", "Spring"
];

export default function FilterModal({ initialFilters, onApply, onClose, onReset }) {
  const [selectedTechs, setSelectedTechs] = useState(initialFilters.technologies || []);

  const toggleTech = tech => {
    setSelectedTechs(selectedTechs =>
      selectedTechs.includes(tech)
        ? selectedTechs.filter(t => t !== tech)
        : [...selectedTechs, tech]
    );
  };

  const handleApply = () => {
    onApply({ technologies: selectedTechs });
  };

  return (
    <div className="filter-overlay">
      <div className="filter-modal">
        <button className="filter-close" onClick={onClose}>
          <FiX size={24} />
        </button>
        <h3>Filters</h3>
        <div className="filter-section">
          <label>Technologies</label>
          <div className="chip-container">
            {TECHNOLOGIES.map(tech => (
              <div
                key={tech}
                className={`chip${selectedTechs.includes(tech) ? " selected" : ""}`}
                onClick={() => toggleTech(tech)}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
        {/* Add more filter sections here if needed */}
        <div className="filter-actions">
          <button className="btn btn-secondary" onClick={onReset}>Reset</button>
          <button className="btn btn-primary" onClick={handleApply}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}