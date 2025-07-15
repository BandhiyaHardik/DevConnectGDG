import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useFirebase } from "../contexts/FirebaseContext";
import "./Messages.css";

const DUMMY_USERS = [
  {
    uid: "dummy-1",
    displayName: "Alex Kim",
    photoURL: "https://ui-avatars.com/api/?name=Alex+Kim&background=4299e1&color=fff",
    lastMessage: "Hey, how's it going?",
    lastMessageTime: "09:15",
    unread: 2,
  },
  {
    uid: "dummy-2",
    displayName: "Priya Sharma",
    photoURL: "https://ui-avatars.com/api/?name=Priya+Sharma&background=3182ce&color=fff",
    lastMessage: "Let's catch up soon!",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
];

const Messages = () => {
  const [users, setUsers] = useState(DUMMY_USERS);
  const { user } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch real users from Firebase (who you have conversations with)
    if (!user) return;
    const fetchConversations = async () => {
      try {
        const q = query(
          collection(firestore, "conversations"),
          where("participants", "array-contains", user.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedUsers = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Get the other participant
          const otherUid = data.participants.find((uid) => uid !== user.uid);
          if (otherUid) {
            fetchedUsers.push({
              uid: otherUid,
              displayName: "Real User", // You can fetch their name/photo if needed
              photoURL: "https://ui-avatars.com/api/?name=Real+User&background=4299e1&color=fff",
              lastMessage: "This is a real chat!",
              lastMessageTime: "10:30",
              unread: 0,
              conversationId: doc.id,
            });
          }
        });
        // Merge with dummy users for demo
        setUsers((prev) => [...fetchedUsers, ...DUMMY_USERS]);
      } catch (err) {
        // fallback to dummy users
      }
    };
    fetchConversations();
  }, [user]);

  const handleOpenChat = (userObj) => {
    if (userObj.conversationId) {
      navigate(`/chat/${userObj.conversationId}`);
    } else {
      navigate(`/messages/${userObj.uid}`);
    }
  };

  return (
    <div className="messages-page">
      <h2>Chats</h2>
      <div className="messages-list">
        {users.map((u) => (
          <div
            key={u.uid}
            className={`message-user-row${u.unread ? " unread" : ""}`}
            onClick={() => handleOpenChat(u)}
          >
            <img src={u.photoURL} alt={u.displayName} className="message-user-avatar" />
            <div className="message-user-info">
              <div className="message-user-name">{u.displayName}</div>
              <div className="message-user-last">{u.lastMessage}</div>
            </div>
            <div className="message-user-meta">
              <span className="message-user-time">{u.lastMessageTime}</span>
              {u.unread > 0 && <span className="message-user-unread">{u.unread}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;