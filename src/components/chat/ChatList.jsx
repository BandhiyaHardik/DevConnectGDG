import React, { useEffect, useState } from "react";
import { getUserChats } from "../../services/chatService";
import { Link, useNavigate } from "react-router-dom";
import './ChatList.css';

const ChatList = ({ user }) => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = getUserChats(user.uid, (data) => {
      setChats(data || []);
    });
    return () => unsubscribe && unsubscribe();
  }, [user]);

  // Debug: log chats to see what you get
  useEffect(() => {
    console.log("Chats fetched:", chats);
  }, [chats]);

  return (
    <div className="chat-list">
      <h2>Chats</h2>
      {chats.length === 0 ? (
        <div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <h3>No conversations yet</h3>
          <p>Match with other developers to start chatting</p>
          <button 
            className="chat-empty-button"
            onClick={() => navigate('/swipe')}
          >
            Find Developers
          </button>
        </div>
      ) : (
        chats.map((chat) => (
          <Link to={`/chat/${chat.id}`} key={chat.id} className="chat-list-item">
            <div className="conversation-avatar">
              <div className="default-avatar">
                {chat.title?.charAt(0)?.toUpperCase() ||
                 chat.participants?.[0]?.charAt(0)?.toUpperCase() ||
                 "?"}
              </div>
            </div>
            <div className="conversation-details">
              <div className="conversation-header">
                <h3>{chat.title || "Chat"}</h3>
                {chat.updatedAt && (
                  <span className="timestamp">
                    {chat.updatedAt.toDate
                      ? chat.updatedAt.toDate().toLocaleString()
                      : ""}
                  </span>
                )}
              </div>
              <p className="last-message">
                {chat.lastMessage
                  ? chat.lastMessage
                  : "No messages yet"}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ChatList;