import React from 'react';
import './TechBadge.css';

// Map of tech stack to colors and icons
const techConfig = {
  // Languages
  'JavaScript': { color: '#f7df1e', icon: 'fab fa-js' },
  'TypeScript': { color: '#3178c6', icon: 'fas fa-code' },
  'Python': { color: '#3776ab', icon: 'fab fa-python' },
  'Java': { color: '#007396', icon: 'fab fa-java' },
  'C#': { color: '#68217a', icon: 'fas fa-hashtag' },
  'PHP': { color: '#777bb4', icon: 'fab fa-php' },
  'Ruby': { color: '#cc342d', icon: 'fas fa-gem' },
  'Swift': { color: '#f05138', icon: 'fab fa-swift' },
  'Kotlin': { color: '#7f52ff', icon: 'fas fa-k' },
  'Go': { color: '#00add8', icon: 'fas fa-code' },
  'Rust': { color: '#000000', icon: 'fas fa-cog' },
  
  // Frontend
  'React': { color: '#61dafb', icon: 'fab fa-react' },
  'Vue': { color: '#42b883', icon: 'fab fa-vuejs' },
  'Angular': { color: '#dd0031', icon: 'fab fa-angular' },
  'Next.js': { color: '#000000', icon: 'fas fa-n' },
  'Svelte': { color: '#ff3e00', icon: 'fas fa-s' },
  'CSS': { color: '#264de4', icon: 'fab fa-css3-alt' },
  'SASS': { color: '#cc6699', icon: 'fab fa-sass' },
  'HTML': { color: '#e34c26', icon: 'fab fa-html5' },
  'Redux': { color: '#764abc', icon: 'fas fa-store' },
  'UI Design': { color: '#ff7262', icon: 'fas fa-palette' },
  'Responsive Design': { color: '#38b2ac', icon: 'fas fa-mobile-alt' },
  
  // Backend
  'Node.js': { color: '#68a063', icon: 'fab fa-node-js' },
  'Express': { color: '#000000', icon: 'fas fa-server' },
  'Django': { color: '#092e20', icon: 'fas fa-code' },
  'Flask': { color: '#000000', icon: 'fas fa-flask' },
  'Spring': { color: '#6db33f', icon: 'fas fa-leaf' },
  'Laravel': { color: '#ff2d20', icon: 'fab fa-laravel' },
  'ASP.NET': { color: '#512bd4', icon: 'fas fa-code' },
  'GraphQL': { color: '#e10098', icon: 'fas fa-project-diagram' },
  'REST API': { color: '#0096c7', icon: 'fas fa-exchange-alt' },
  
  // Database
  'MongoDB': { color: '#47a248', icon: 'fas fa-database' },
  'SQL': { color: '#336791', icon: 'fas fa-database' },
  'PostgreSQL': { color: '#336791', icon: 'fas fa-database' },
  'MySQL': { color: '#4479a1', icon: 'fas fa-database' },
  'Firebase': { color: '#ffca28', icon: 'fas fa-fire' },
  'Redis': { color: '#dc382d', icon: 'fas fa-database' },
  
  // DevOps & Tools
  'Docker': { color: '#2496ed', icon: 'fab fa-docker' },
  'Kubernetes': { color: '#326ce5', icon: 'fas fa-dharmachakra' },
  'AWS': { color: '#ff9900', icon: 'fab fa-aws' },
  'Git': { color: '#f05032', icon: 'fab fa-git-alt' },
  'CI/CD': { color: '#40b5a4', icon: 'fas fa-sync' },
  'Testing': { color: '#9c27b0', icon: 'fas fa-vial' },
  'Linux': { color: '#fcc624', icon: 'fab fa-linux' },
  
  // Mobile
  'React Native': { color: '#61dafb', icon: 'fab fa-react' },
  'Flutter': { color: '#02569b', icon: 'fas fa-mobile-alt' },
  'iOS': { color: '#000000', icon: 'fab fa-apple' },
  'Android': { color: '#3ddc84', icon: 'fab fa-android' },
  
  // Other
  'Machine Learning': { color: '#01a3a4', icon: 'fas fa-brain' },
  'Data Science': { color: '#9980fa', icon: 'fas fa-chart-bar' },
  'Blockchain': { color: '#627eea', icon: 'fas fa-link' },
  'WebRTC': { color: '#333333', icon: 'fas fa-video' },
  'WebSockets': { color: '#010101', icon: 'fas fa-plug' },
  'Game Dev': { color: '#e4405f', icon: 'fas fa-gamepad' }
};

// Default configuration for unknown tech
const defaultConfig = { color: '#718096', icon: 'fas fa-code' };

const TechBadge = ({ name }) => {
  // Get config or use default
  const config = techConfig[name] || defaultConfig;
  
  return (
    <div 
      className="tech-badge"
      style={{ 
        backgroundColor: `${config.color}15`, // 15% opacity of the color
        color: config.color,
        borderColor: `${config.color}30`  // 30% opacity for border
      }}
    >
      {config.icon && <i className={config.icon}></i>}
      <span>{name}</span>
    </div>
  );
};

export default TechBadge;