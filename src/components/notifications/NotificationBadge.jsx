import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import './NotificationBadge.css';

const NotificationBadge = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    // Subscribe to notifications
    const q = query(
      collection(firestore, 'notifications'),
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = [];
      let newUnreadCount = 0;
      
      snapshot.forEach(doc => {
        const notification = { id: doc.id, ...doc.data() };
        newNotifications.push(notification);
        if (!notification.read) {
          newUnreadCount++;
        }
      });
      
      // Sort by timestamp (newest first)
      newNotifications.sort((a, b) => {
        return b.timestamp?.toMillis() - a.timestamp?.toMillis();
      });
      
      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);
    });
    
    return () => unsubscribe();
  }, [user]);
  
  const handleNotificationClick = async (notification) => {
    // Mark as read
    try {
      const notificationRef = doc(firestore, 'notifications', notification.id);
      await updateDoc(notificationRef, { read: true });
      
      // Navigate based on notification type
      if (notification.type === 'match' && notification.data?.conversationId) {
        navigate(`/chat/${notification.data.conversationId}`);
      } else if (notification.type === 'like') {
        navigate('/swipe/likes');
      }
      
      setShowDropdown(false);
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };
  
  const markAllRead = async () => {
    try {
      const batch = writeBatch(firestore);
      
      notifications.forEach(notification => {
        if (!notification.read) {
          const notificationRef = doc(firestore, 'notifications', notification.id);
          batch.update(notificationRef, { read: true });
        }
      });
      
      await batch.commit();
      setShowDropdown(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'Someone liked your profile!';
      case 'match':
        return `You have a new match! Start chatting now.`;
      default:
        return 'You have a new notification.';
    }
  };
  
  return (
    <div className="notification-container">
      <button 
        className="notification-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="mark-all-read">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {notification.type === 'like' ? '❤️' : '🤝'}
                  </div>
                  <div className="notification-content">
                    <p>{getNotificationContent(notification)}</p>
                    <span className="notification-time">
                      {notification.timestamp ? formatDistanceToNow(
                        new Date(notification.timestamp.toDate()),
                        { addSuffix: true }
                      ) : ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 5 && (
            <div className="notification-footer">
              <button onClick={() => navigate('/notifications')} className="view-all">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;