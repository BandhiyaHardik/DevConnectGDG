import React, { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import MatchChat from '../chat/MatchChat';
import { Link } from 'react-router-dom';
import './Swipe.css';

const Swipe = () => {
  const [developers, setDevelopers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Frontend Developer',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      skills: ['React', 'JavaScript', 'CSS'],
      bio: 'Passionate frontend developer with 3 years of experience.'
    },
    {
      id: 2,
      name: 'David Chen',
      title: 'Full Stack Developer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      skills: ['Node.js', 'MongoDB', 'React'],
      bio: 'Building scalable web applications.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'UI/UX Designer',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      skills: ['Figma', 'Adobe XD', 'Sketch'],
      bio: 'Creating beautiful user experiences.'
    }
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedDev, setMatchedDev] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Store all matches with their message history - add some pre-populated matches
  const [matches, setMatches] = useState(() => {
    // Load matches from localStorage if available
    const savedMatches = localStorage.getItem('devConnectMatches');
    
    if (savedMatches) {
      return JSON.parse(savedMatches);
    } else {
      // Add a default match for testing
      return [
        {
          id: 4,
          name: 'Alex Morgan',
          title: 'Backend Developer',
          avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
          skills: ['Python', 'Django', 'PostgreSQL'],
          bio: 'Backend developer specializing in scalable APIs',
          matchDate: new Date().toISOString(),
          messages: [
            {
              id: 1,
              text: 'Hi there! I liked your profile and I see we matched!',
              sender: 'them',
              timestamp: new Date(Date.now() - 86400000) // 24 hours ago
            },
            {
              id: 2,
              text: 'Thanks for connecting! What kind of projects are you working on?',
              sender: 'me',
              timestamp: new Date(Date.now() - 82800000) // 23 hours ago
            },
            {
              id: 3,
              text: 'I\'m building a social platform for developers. Would love to chat about potential collaboration!',
              sender: 'them',
              timestamp: new Date(Date.now() - 79200000) // 22 hours ago
            }
          ]
        },
        {
          id: 5,
          name: 'James Wilson',
          title: 'Mobile Developer',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          skills: ['React Native', 'Swift', 'Kotlin'],
          bio: 'Creating awesome mobile experiences',
          matchDate: new Date().toISOString(),
          messages: []
        }
      ];
    }
  });

  // Save matches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devConnectMatches', JSON.stringify(matches));
  }, [matches]);

  // DEBUG FEATURE: Function to view all matches (add a button for this somewhere in your UI)
  const viewAllMatches = () => {
    console.log('Current matches:', matches);
    // You could also show these in a modal or a dedicated page
  };
  
  const handleSwipe = (direction, developer) => {
    // If swiped right, ALWAYS create a match (for testing purposes)
    if (direction === 'right') {
      // GUARANTEED match (100% chance) for testing
      const isMatch = true;
      
      if (isMatch) {
        const newMatch = {
          ...developer,
          matchDate: new Date().toISOString(),
          messages: []
        };
        
        // Add to matches if not already matched
        if (!matches.some(match => match.id === developer.id)) {
          setMatches([...matches, newMatch]);
          setMatchedDev(newMatch);
          setShowMatchModal(true);
        }
      }
    }
    
    // Move to next developer regardless of swipe direction
    if (currentIndex < developers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more developers to show
      console.log("No more developers to show");
      
      // DEBUG - Reset the index to 0 to allow continuous swiping for testing
      setCurrentIndex(0);
    }
  };
  
  // Function to open chat with an existing match
  const openExistingMatchChat = (match) => {
    setMatchedDev(match);
    setShowChat(true);
  };
  
  const closeMatchModal = () => {
    setShowMatchModal(false);
  };
  
  const startChat = () => {
    setShowMatchModal(false);
    setShowChat(true);
  };
  
  const closeChat = () => {
    setShowChat(false);
    setMatchedDev(null);
  };
  
  const handleSendMessage = (matchId, message) => {
    // Update the matches array with the new message
    setMatches(prevMatches => 
      prevMatches.map(match => {
        if (match.id === matchId) {
          return {
            ...match,
            messages: [...match.messages, message],
            lastMessage: message.text,
            lastMessageTime: message.timestamp
          };
        }
        return match;
      })
    );
  };

  return (
    <div className="swipe-container">
      {/* Messages Navigation Button */}
      <div className="messages-nav-button">
        <Link to="/messages" className="view-messages-button">
          <i className="fas fa-comments"></i>
          <span>View All Messages</span>
          {matches.length > 0 && (
            <span className="message-count">{matches.length}</span>
          )}
        </Link>
      </div>
      
      {/* Swipe Cards */}
      <div className="swipe-card-container">
        <div className="card-stack">
          {developers.map((developer, index) => (
            <SwipeCard
              key={developer.id}
              developer={developer}
              isActive={index === currentIndex}
              stackPosition={index - currentIndex}
              onSwipe={handleSwipe}
            />
          ))}
        </div>
      </div>
      
      {/* Match modal */}
      {showMatchModal && matchedDev && (
        <MatchModal
          match={matchedDev}
          onClose={closeMatchModal}
          onStartChat={startChat}
        />
      )}
      
      {/* Chat window */}
      {showChat && matchedDev && (
        <MatchChat
          match={matchedDev}
          onClose={closeChat}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* DEBUG: Match List for Testing - Add this somewhere in your UI */}
      <div className="debug-match-list" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Your Matches (Testing Only)</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {matches.map(match => (
            <div 
              key={match.id}
              style={{ 
                cursor: 'pointer', 
                textAlign: 'center',
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '8px',
                width: '100px'
              }}
              onClick={() => openExistingMatchChat(match)}
            >
              <img 
                src={match.avatar || "https://via.placeholder.com/150"} 
                alt={match.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%' }}
              />
              <p style={{ margin: '5px 0 0', fontSize: '14px' }}>{match.name}</p>
              <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>{match.messages.length} messages</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Swipe;