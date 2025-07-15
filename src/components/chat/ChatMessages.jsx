import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import "./ChatMessages.css";

// ChatMessages component: just displays plain text messages
const ChatMessages = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-messages-list">
      {messages.length === 0 && (
        <div className="no-messages">No messages yet.</div>
      )}
      {messages.map((msg, idx) => {
        const isOwn = msg.sentBy === currentUserId;
        return (
          <div
            key={msg.id || idx}
            className={`chat-message-row ${isOwn ? "own" : "other"}`}
          >
            <div className="chat-message-avatar">
              {msg.avatarURL ? (
                <img src={msg.avatarURL} alt={msg.senderName || "User"} />
              ) : (
                <div className="default-avatar">
                  {msg.senderName?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="chat-message-bubble">
              <div className="chat-message-text">{msg.text}</div>
              <div className="chat-message-meta">
                <span className="chat-message-sender">
                  {isOwn ? "You" : msg.senderName || "User"}
                </span>
                <span className="chat-message-time">
                  {msg.timestamp
                    ? new Date(
                        msg.timestamp.seconds
                          ? msg.timestamp.seconds * 1000
                          : msg.timestamp
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

// ChatRoom component: fetches messages and passes to ChatMessages
const ChatRoom = ({ chatId, user }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId || !user?.uid) return;
    const q = query(
      collection(firestore, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId, user]);

  if (!chatId || !user?.uid) return <div>Loading chat...</div>;
  return <ChatMessages messages={messages} currentUserId={user.uid} />;
};

export default ChatRoom;