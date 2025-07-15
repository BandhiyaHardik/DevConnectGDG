import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import "./ChatMessages.css";

const ChatWindow = ({ chatId, user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!message.trim()) return;
    await addDoc(collection(firestore, "chats", chatId, "messages"), {
      text: message.trim(),
      sentBy: user.uid,
      senderName: user.displayName || "You",
      avatarURL: user.photoURL || "",
      timestamp: serverTimestamp(),
    });
    setMessage("");
  };

  // Handle Enter/Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages-list">
        {messages.length === 0 && <div className="no-messages">No messages yet.</div>}
        {messages.map((msg, idx) => {
          const isOwn = msg.sentBy === user.uid;
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
      <div className="chat-input-container">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="chat-input"
        />
        <button onClick={handleSend} className="send-btn">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;