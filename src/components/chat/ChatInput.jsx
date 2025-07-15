// Example: ChatInput.jsx
import React, { useState } from "react";
import CryptoJS from "crypto-js";

const SECRET_KEY = "YOUR_SECRET_KEY"; // Replace with a secure key, ideally from env

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  // Encrypt message using AES
  const encryptMessage = (msg) => {
    return CryptoJS.AES.encrypt(msg, SECRET_KEY).toString();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        const encrypted = encryptMessage(message.trim());
        onSend(encrypted); // Send encrypted message
        setMessage("");
      }
    }
  };

  return (
    <textarea
      value={message}
      onChange={e => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your message..."
      rows={1}
      className="chat-input"
    />
  );
};

export default ChatInput;