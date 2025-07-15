import React, { useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { firestore } from "../firebase/config";
import "./ChatList.css"; // Reuse your chat styles

// Mock chats (add as many as you want)
const mockChats = [
  {
    id: "mock-1",
    displayName: "Alex Kim",
    photoURL: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Let's collaborate on a project!",
    lastTime: "09:15",
  },
  {
    id: "mock-2",
    displayName: "Priya Patel",
    photoURL: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "Thanks for your help!",
    lastTime: "Yesterday",
  },
];

const ChatList = () => {
  const { currentUser } = useContext(FirebaseContext);
  const [chats, setChats] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [search, setSearch] = useState(() => localStorage.getItem("chat_search") || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(
      collection(firestore, "conversations"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatDocs = [];
      const cache = { ...userCache };
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUid = data.participants.find(uid => uid !== currentUser.uid);
        let otherUser = cache[otherUid];
        if (!otherUser && otherUid) {
          const userDoc = await getDoc(doc(firestore, "users", otherUid));
          if (userDoc.exists()) {
            otherUser = userDoc.data();
            cache[otherUid] = otherUser;
          } else {
            otherUser = { displayName: "Unknown", photoURL: "" };
          }
        }
        // Get last message (optional)
        let lastMessage = "";
        let lastTime = "";
        // You can fetch last message here if you want, or leave blank for now
        chatDocs.push({
          id: docSnap.id,
          otherUid,
          displayName: otherUser?.displayName,
          photoURL: otherUser?.photoURL,
          lastMessage,
          lastTime,
        });
      }
      setUserCache(cache);
      setChats(chatDocs);
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [currentUser?.uid]);

  // Combine real and mock chats
  const allChats = [
    ...chats,
    ...mockChats.map((mock) => ({
      ...mock,
      isMock: true,
    })),
  ];

  // Save search to localStorage on change
  useEffect(() => {
    localStorage.setItem("chat_search", search);
  }, [search]);

  // Filter chats by search (case-insensitive, displayName)
  const filteredChats = allChats.filter(chat =>
    chat.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chatlist-desktop-container chatlist-desktop-big">
      <div className="chatlist-header">
        <span>Recent chats</span>
        <button className="chatlist-new-btn" title="New Chat">
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="chatlist-searchbar">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="chatlist-list">
        {filteredChats.length === 0 && (
          <div className="chatlist-empty">No chats found.</div>
        )}
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={`chatlist-row${chat.unread ? " unread" : ""}`}
            onClick={() => navigate(`/chat/${chat.id}?otherUserId=${chat.otherUid}`)}
          >
            <div className="chatlist-avatar">
              {chat.photoURL ? (
                <img src={chat.photoURL} alt={chat.displayName} />
              ) : (
                <div className="chatlist-avatar-fallback">
                  {(chat.displayName || "U")[0].toUpperCase()}
                </div>
              )}
              {chat.isOnline && <span className="chatlist-online-dot"></span>}
            </div>
            <div className="chatlist-main">
              <div className="chatlist-row-header">
                <span className="chatlist-name">{chat.displayName}</span>
                <span className="chatlist-time">{chat.lastTime}</span>
              </div>
              <div className="chatlist-row-message">
                {chat.lastMessage || <span className="chatlist-placeholder">it is working now</span>}
                {chat.unread > 0 && (
                  <span className="chatlist-unread-badge">{chat.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;