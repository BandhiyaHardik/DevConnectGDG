import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ onApplyFilters, onClose }) => {
  const [filters, setFilters] = useState({
    lookingFor: [],
    skills: [],
    experienceLevel: [],
    location: {
      maxDistance: 50,
      city: '',
      country: ''
    },
    ageRange: [18, 65],
    workStyle: [],
    availability: []
  });

  const lookingForOptions = [
    { id: 'work', label: 'Work Opportunities' },
    { id: 'freelancing', label: 'Freelance Projects' },
    { id: 'friends', label: 'Tech Friends' },
    { id: 'hackathon', label: 'Hackathon Partners' },
    { id: 'skill-development', label: 'Skill Development' }
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++',
    'TypeScript', 'Vue.js', 'Angular', 'Django', 'AWS', 'Docker'
  ];

  const experienceLevels = ['Beginner', 'Intermediate', 'Senior', 'Expert'];
  const workStyles = ['Remote', 'Hybrid', 'On-site'];
  const availabilityOptions = ['Part-time', 'Full-time', 'Weekends', 'Flexible'];

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const resetFilters = () => {
    setFilters({
      lookingFor: [],
      skills: [],
      experienceLevel: [],
      location: { maxDistance: 50, city: '', country: '' },
      ageRange: [18, 65],
      workStyle: [],
      availability: []
    });
  };

  return (
    <div className="filters-overlay">
      <div className="filters-modal">
        <div className="filters-header">
          <h3>Filter Developers</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="filters-content">
          {/* Looking For */}
          <div className="filter-section">
            <h4>Looking For</h4>
            <div className="filter-options">
              {lookingForOptions.map(option => (
                <button
                  key={option.id}
                  className={`filter-chip ${filters.lookingFor.includes(option.id) ? 'active' : ''}`}
                  onClick={() => toggleFilter('lookingFor', option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="filter-section">
            <h4>Skills</h4>
            <div className="filter-options">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  className={`filter-chip ${filters.skills.includes(skill) ? 'active' : ''}`}
                  onClick={() => toggleFilter('skills', skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="filter-section">
            <h4>Experience Level</h4>
            <div className="filter-options">
              {experienceLevels.map(level => (
                <button
                  key={level}
                  className={`filter-chip ${filters.experienceLevel.includes(level) ? 'active' : ''}`}
                  onClick={() => toggleFilter('experienceLevel', level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="filter-section">
            <h4>Location</h4>
            <div className="location-filters">
              <input
                type="text"
                placeholder="City"
                value={filters.location.city}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value }
                }))}
              />
              <input
                type="text"
                placeholder="Country"
                value={filters.location.country}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  location: { ...prev.location, country: e.target.value }
                }))}
              />
              <div className="distance-slider">
                <label>Max Distance: {filters.location.maxDistance} km</label>
                <input
                  type="range"
                  min="5"
                  max="500"
                  value={filters.location.maxDistance}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    location: { ...prev.location, maxDistance: parseInt(e.target.value) }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Age Range */}
          <div className="filter-section">
            <h4>Age Range</h4>
            <div className="age-range">
              <input
                type="number"
                min="18"
                max="65"
                value={filters.ageRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                }))}
              />
              <span>to</span>
              <input
                type="number"
                min="18"
                max="65"
                value={filters.ageRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                }))}
              />
            </div>
          </div>

          {/* Work Style */}
          <div className="filter-section">
            <h4>Work Style</h4>
            <div className="filter-options">
              {workStyles.map(style => (
                <button
                  key={style}
                  className={`filter-chip ${filters.workStyle.includes(style) ? 'active' : ''}`}
                  onClick={() => toggleFilter('workStyle', style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="filter-section">
            <h4>Availability</h4>
            <div className="filter-options">
              {availabilityOptions.map(option => (
                <button
                  key={option}
                  className={`filter-chip ${filters.availability.includes(option) ? 'active' : ''}`}
                  onClick={() => toggleFilter('availability', option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filters-actions">
          <button onClick={resetFilters} className="reset-btn">
            Reset All
          </button>
          <button 
            onClick={() => onApplyFilters(filters)} 
            className="apply-btn"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;