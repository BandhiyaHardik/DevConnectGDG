import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

const availableSkills = [
  'JavaScript', 'React', 'Python', 'Node.js', 'TypeScript', 
  'Angular', 'Vue.js', 'Java', 'C#', 'PHP', 'AWS', 'Docker',
  'MongoDB', 'SQL', 'GraphQL', 'DevOps', 'Mobile', 'UI/UX',
  'Machine Learning', 'Blockchain', 'Data Science', 'Cloud'
];

const EXPERIENCE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "expert"
];

const LOOKING_FOR_OPTIONS = [
  "Skill Development",
  "Work Opportunities",
  "Freelancing",
  "Tech Friends",
  "Hackathon Teams"
];

const FilterPanel = ({ filters: initialFilters, onApply, onClose }) => {
  const [filters, setFilters] = useState(initialFilters || {
    technologies: [],
    experience: [],
    lookingFor: []
  });

  // Initialize filters with the passed props
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const toggleTechnology = (tech) => {
    setFilters(prev => {
      const technologies = [...prev.technologies];
      if (technologies.includes(tech)) {
        return { ...prev, technologies: technologies.filter(t => t !== tech) };
      } else {
        return { ...prev, technologies: [...technologies, tech] };
      }
    });
  };

  const toggleExperience = (exp) => {
    setFilters(prev => {
      const experience = [...prev.experience];
      if (experience.includes(exp)) {
        return { ...prev, experience: experience.filter(e => e !== exp) };
      } else {
        return { ...prev, experience: [...experience, exp] };
      }
    });
  };

  const toggleLookingFor = (option) => {
    setFilters(prev => {
      const lookingFor = [...prev.lookingFor];
      if (lookingFor.includes(option)) {
        return { ...prev, lookingFor: lookingFor.filter(o => o !== option) };
      } else {
        return { ...prev, lookingFor: [...lookingFor, option] };
      }
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    setFilters({
      technologies: [],
      experience: [],
      lookingFor: []
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <button className="filter-reset" onClick={handleClear}>Reset</button>
        <button className="filter-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="filter-content">
        <div className="filter-section">
          <h3>Tech Stack</h3>
          <div className="skills-container">
            {availableSkills.map(skill => (
              <div
                key={skill}
                className={`skill-chip ${filters.technologies.includes(skill) ? 'selected' : ''}`}
                onClick={() => toggleTechnology(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Experience level filter */}
        <div className="filter-section">
          <h3>Experience Level</h3>
          <div className="filter-options">
            {EXPERIENCE_LEVELS.map(exp => (
              <label key={exp} className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={filters.experience.includes(exp)}
                  onChange={() => toggleExperience(exp)}
                />
                <span>{exp.charAt(0).toUpperCase() + exp.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Looking for filter */}
        <div className="filter-section">
          <h3>Looking For</h3>
          <div className="filter-options">
            {LOOKING_FOR_OPTIONS.map(option => (
              <label key={option} className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={filters.lookingFor.includes(option)}
                  onChange={() => toggleLookingFor(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional filters example - Location and Skills */}
        {/* <div className="filter-section">
          <label>Location</label>
          <input type="text" placeholder="Enter location" />
        </div> */}
         {/* <div className="filter-section">
          <label>Skills</label>
          <input type="text" placeholder="Enter skills" />
        </div> */}
      </div>

      <div className="filters-actions">
        <button className="apply-filters" onClick={handleApply}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;