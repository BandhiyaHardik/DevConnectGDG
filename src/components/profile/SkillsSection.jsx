import React, { useState } from 'react';
import './SkillsSection.css';

const SkillsSection = ({ skills, isEditMode, onSkillsChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState('');
  
  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 
    'Angular', 'Vue.js', 'Java', 'C#', 'PHP', 'Go', 'Ruby',
    'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'SQL', 'GraphQL',
    'Git', 'CI/CD', 'DevOps', 'Machine Learning', 'Data Science',
    'UI/UX Design', 'Mobile Development', 'Flutter', 'Swift'
  ];
  
  const handleAddSkill = (skill) => {
    // Check if skill already exists
    if (skills.includes(skill)) {
      setSkillError('This skill is already in your profile');
      return;
    }
    
    // Add skill
    const updatedSkills = [...skills, skill];
    onSkillsChange(updatedSkills);
    setNewSkill('');
    setSkillError('');
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    onSkillsChange(updatedSkills);
  };
  
  const handleSkillSubmit = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    
    handleAddSkill(newSkill.trim());
  };
  
  const handleQuickAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      handleAddSkill(skill);
    }
  };
  
  const getFilteredSuggestions = () => {
    if (!newSkill.trim()) return [];
    
    return popularSkills
      .filter(skill => 
        skill.toLowerCase().includes(newSkill.toLowerCase()) && 
        !skills.includes(skill)
      )
      .slice(0, 5);
  };
  
  return (
    <div className="skills-section">
      <h2>Skills</h2>
      
      <div className="skills-content">
        {skills.length > 0 ? (
          <div className="skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
                {isEditMode && (
                  <button 
                    className="remove-skill" 
                    onClick={() => handleRemoveSkill(skill)}
                    title="Remove skill"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-skills">
            {isEditMode ? 
              'Add skills to help match with other developers' : 
              'No skills added yet'
            }
          </div>
        )}
        
        {isEditMode && (
          <>
            <form className="add-skill-form" onSubmit={handleSkillSubmit}>
              <div className="skill-input-container">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => {
                    setNewSkill(e.target.value);
                    setSkillError('');
                  }}
                  placeholder="Add a skill..."
                />
                <button type="submit" className="add-skill-btn">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              {skillError && <div className="skill-error">{skillError}</div>}
              
              <div className="skill-suggestions">
                {getFilteredSuggestions().map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="skill-suggestion"
                    onClick={() => handleQuickAddSkill(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </form>
            
            <div className="popular-skills">
              <h4>Popular Skills</h4>
              <div className="popular-skills-list">
                {popularSkills
                  .slice(0, 10)
                  .filter(skill => !skills.includes(skill))
                  .map((skill, index) => (
                    <div 
                      key={index} 
                      className="popular-skill"
                      onClick={() => handleQuickAddSkill(skill)}
                    >
                      + {skill}
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;