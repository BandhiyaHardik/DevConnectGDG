import React, { useState, useRef } from 'react';
import './ProjectsSection.css';

const ProjectsSection = ({ projects, isEditMode, onProjectsChange }) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    description: '',
    link: '',
    image: null
  });
  const fileInputRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };
  
  const handleAddProject = (e) => {
    e.preventDefault();
    
    // Create a new project object
    const newProject = {
      id: Date.now().toString(),
      name: projectFormData.name,
      description: projectFormData.description,
      link: projectFormData.link,
      image: projectFormData.image ? URL.createObjectURL(projectFormData.image) : '/assets/images/default-project.jpg'
    };
    
    // Add to projects array
    onProjectsChange([...projects, newProject]);
    
    // Reset form and close it
    setProjectFormData({
      name: '',
      description: '',
      link: '',
      image: null
    });
    setIsAddingProject(false);
  };
  
  const handleRemoveProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    onProjectsChange(updatedProjects);
  };
  
  const handleEditProject = (project) => {
    // For a real app, you would implement edit functionality
    // For now, we'll just allow removal and re-adding
    console.log("Edit project:", project);
  };
  
  return (
    <div className="projects-section">
      <h2>Projects</h2>
      
      <div className="projects-content">
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div 
                  className="project-image" 
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  {isEditMode && (
                    <div className="project-actions">
                      <button 
                        className="edit-project" 
                        onClick={() => handleEditProject(project)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="remove-project" 
                        onClick={() => handleRemoveProject(project.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <i className="fas fa-external-link-alt"></i> View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            {isEditMode ? 
              'Add projects to showcase your work' : 
              'No projects added yet'
            }
          </div>
        )}
        
        {isEditMode && !isAddingProject && (
          <button 
            className="add-project-btn"
            onClick={() => setIsAddingProject(true)}
          >
            <i className="fas fa-plus"></i> Add Project
          </button>
        )}
        
        {isEditMode && isAddingProject && (
          <div className="add-project-form">
            <h3>Add New Project</h3>
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  name="name"
                  value={projectFormData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Personal Portfolio"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="projectDescription">Description</label>
                <textarea
                  id="projectDescription"
                  name="description"
                  value={projectFormData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description of your project"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="projectLink">Project Link</label>
                <input
                  type="url"
                  id="projectLink"
                  name="link"
                  value={projectFormData.link}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/project"
                />
              </div>
              
              <div className="form-group">
                <label>Project Image</label>
                <div className="project-image-upload">
                  {projectFormData.image ? (
                    <div className="project-image-preview">
                      <img src={URL.createObjectURL(projectFormData.image)} alt="Project preview" />
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={() => setProjectFormData(prev => ({ ...prev, image: null }))}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="upload-placeholder"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Click to upload image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setIsAddingProject(false);
                    setProjectFormData({
                      name: '',
                      description: '',
                      link: '',
                      image: null
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add Project
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;