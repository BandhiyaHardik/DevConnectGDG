import React, { useEffect, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import MessageList from './MessageList';

const ChatBox = ({ userId }) => {
    const { messages, sendMessage } = useChat(userId);
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    useEffect(() => {
        // Scroll to the bottom of the message list when new messages arrive
        const messageList = document.getElementById('message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-box">
            <div id="message-list" className="message-list">
                <MessageList messages={messages} />
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;