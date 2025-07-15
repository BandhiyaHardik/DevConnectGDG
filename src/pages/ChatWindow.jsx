import React, { useEffect, useState, useRef, useContext } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { useParams, useLocation } from "react-router-dom";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { firestore } from "../firebase/config";
import "./ChatWindow.css";

const ChatWindow = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const otherUserId = new URLSearchParams(location.search).get("otherUserId");
  const { currentUser } = useContext(FirebaseContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch all messages for this conversation
  useEffect(() => {
    if (!conversationId) return;
    const q = query(
      collection(firestore, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [conversationId]);

  // Fetch current user's profile
  useEffect(() => {
    if (currentUser?.uid) {
      const fetchCurrentProfile = async () => {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setCurrentUserProfile(docSnap.data());
      };
      fetchCurrentProfile();
    }
  }, [currentUser?.uid]);

  // Fetch other user's profile
  useEffect(() => {
    if (otherUserId) {
      const fetchOtherProfile = async () => {
        const docRef = doc(firestore, "users", otherUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setOtherUserProfile(docSnap.data());
      };
      fetchOtherProfile();
    }
  }, [otherUserId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const handleSend = async () => {
    if (!message.trim() || !currentUser?.uid) return;
    await addDoc(collection(firestore, "messages"), {
      conversationId,
      participants: [currentUser.uid, otherUserId],
      sentBy: currentUser.uid,
      text: message.trim(),
      timestamp: serverTimestamp()
    });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-window-page">
      <div className="chat-header">
        {otherUserProfile?.photoURL ? (
          <img
            src={otherUserProfile.photoURL}
            alt={otherUserProfile.displayName || "User"}
            className="chat-header-avatar"
          />
        ) : (
          <div className="chat-header-avatar default-avatar">
            {(otherUserProfile?.displayName || "U")[0].toUpperCase()}
          </div>
        )}
        <span className="chat-header-name">
          {otherUserProfile?.displayName || "User"}
        </span>
      </div>
      <div className="chat-window">
        <div className="chat-messages-list">
          {messages.map(msg => {
            const isOwn = msg.sentBy === currentUser?.uid;
            const senderProfile = isOwn ? currentUserProfile : otherUserProfile;
            return (
              <div key={msg.id} className={`chat-message-row ${isOwn ? "own" : "other"}`}>
                <div className="chat-message-avatar">
                  {senderProfile?.photoURL ? (
                    <img src={senderProfile.photoURL} alt={senderProfile.displayName || "User"} />
                  ) : (
                    <div className="default-avatar">
                      {(senderProfile?.displayName || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="chat-message-bubble">
                  <div className="chat-message-sender">
                    {isOwn ? "You" : senderProfile?.displayName || "User"}
                  </div>
                  <div className="chat-message-text">{msg.text}</div>
                  <div className="chat-message-time">
                    {msg.timestamp?.toDate
                      ? msg.timestamp.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : ""}
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
          <button onClick={handleSend} className="send-btn">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;