import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="landing-root">
      {/* Hero Section */}
      <div className="landing-container landing-hero">
        <div className="landing-hero-bg"></div>
        <div className="landing-hero-content">
          <div className="landing-badge">🚀Mobile app Coming Soon – Join the Waitlist</div>
          <h1>
            Swipe Right for Your <br />
            <span className="hero-title-gradient">Next Tech Connection</span>
          </h1>
          <p>
            The first social platform designed for developers. Find hackathon teammates, tech
            friends, freelance opportunities, and project collaborators with a simple swipe.
          </p>
          <div className="landing-hero-actions">
            <a href="#join" className="landing-btn primary large">Join Waitlist</a>
            <a href="#demo" className="landing-btn ghost large">Watch Demo</a>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="landing-container landing-demo">
        <div className="demo-box">
          <div className="demo-video-placeholder">
            {/* Replace this div with your <video> or <iframe> later */}
            <span className="demo-play-icon">▶</span>
          </div>
          <h3>See DevConnect in Action</h3>
          <p>Watch how easily you can find your next tech connection.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-container landing-section alt" id="features">
        <h2>Why Developers Love DevConnect</h2>
        <p>Stop scrolling through endless forums and Discord servers. Find your perfect tech match in seconds.</p>
        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">
              {/* Teamwork/Handshake Icon */}
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h3>Hackathon Partners</h3>
            <p>Find teammates with complementary skills for your next hackathon adventure.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              {/* Friends/Users Icon */}
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="7" r="4" />
                <circle cx="17" cy="17" r="4" />
                <path d="M17 13a4 4 0 0 0-8 0" />
              </svg>
            </div>
            <h3>Tech Friends</h3>
            <p>Connect with like-minded developers in your area or globally.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              {/* Briefcase/Work Icon */}
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
            </div>
            <h3>Freelance Gigs</h3>
            <p>Discover freelance opportunities that match your skills and interests.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              {/* Project/Collaboration Icon */}
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
              </svg>
            </div>
            <h3>Project Collaborators</h3>
            <p>Build your dream team for side projects and startup ideas.</p>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="landing-container landing-section" id="how">
        <h2>Simple as Swipe, Match, Code</h2>
        <p>Our intuitive interface makes networking effortless for developers.</p>
        <div className="landing-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Create Your Profile</h4>
            <p>Showcase your skills, projects, and what you're looking for in the tech community.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Swipe & Match</h4>
            <p>Browse through developer profiles and swipe right on those you'd like to connect with.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Start Collaborating</h4>
            <p>Chat, share ideas, and start building amazing projects together.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="landing-container landing-section cta" id="join">
        <h2>Ready to Find Your Next Tech Connection?</h2>
        <p>
          Join the waitlist and be the first to experience the future of developer networking.
        </p>
        <form className="landing-waitlist-form" onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" required className="waitlist-input" />
          <button className="landing-btn primary">Get Early Access</button>
        </form>
        <div className="waitlist-note text-tertiary">Be the first to know when DevConnect launches. No spam, ever.</div>
      </div>

      {/* Get App Section */}
      <div className="landing-container landing-section" id="download">
        <h2>Get DevConnect</h2>
        <p>Available soon on all platforms. Join our waitlist to be notified when we launch.</p>
        <div className="app-badges">
          <button className="app-store-btn bg-black">Download on the App Store</button>
          <button className="app-store-btn bg-black">Get it on Google Play</button>
        </div>
      </div>

     
    </div>
  );
}
