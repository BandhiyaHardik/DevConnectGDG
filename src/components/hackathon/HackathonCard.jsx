import React from "react";
import "./HackathonCard.css";

const HackathonCard = ({ hackathon }) => (
  <div className="hackathon-card">
    <img className="hackathon-img" src={hackathon.image} alt={hackathon.name} />
    <div className="hackathon-info">
      <h2 className="hackathon-name">{hackathon.name}</h2>
      <p className="hackathon-desc">{hackathon.description}</p>
      <div className="hackathon-meta">
        <span className="hackathon-date">{new Date(hackathon.date).toLocaleDateString()}</span>
        <span className="hackathon-location">{hackathon.location}</span>
      </div>
      <button className="hackathon-apply-btn">Apply Now</button>
    </div>
  </div>
);

export default HackathonCard;