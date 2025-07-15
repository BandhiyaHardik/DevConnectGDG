// Mock data service for chat functionality

// Current user (for mock purposes)
const currentUserId = 'current-user-123';

// Mock conversations data
const mockConversations = [
  {
    uid: 'user-456',
    displayName: 'Sam Rivera',
    photoURL: 'https://ui-avatars.com/api/?name=Sam+Rivera&background=FF5733&color=fff',
    role: 'UX/UI Designer',
    location: 'Austin, TX',
    lastMessage: "I've created some wireframes already. Would you be free for a quick call sometime this week?",
    lastMessageTime: new Date(Date.now() - 3200000).toISOString(), // ~53 minutes ago
    unreadCount: 1,
    matchDate: '2023-07-01'
  },
  {
    uid: 'user-789',
    displayName: 'Jordan Lee',
    photoURL: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=27AE60&color=fff',
    role: 'Backend Developer',
    location: 'Chicago, IL',
    lastMessage: "Hi Jordan, happy to help! What's your project about?",
    lastMessageTime: new Date(Date.now() - 85000000).toISOString(), // ~1 day ago
    unreadCount: 0,
    matchDate: '2023-06-28'
  },
  {
    uid: 'user-101',
    displayName: 'Taylor Wilson',
    photoURL: 'https://ui-avatars.com/api/?name=Taylor+Wilson&background=8E44AD&color=fff',
    role: 'Full Stack Developer',
    location: 'New York, NY',
    lastMessage: "Hello! I saw your React projects and I'm impressed. Would you be interested in collaborating?",
    lastMessageTime: new Date(Date.now() - 172800000).toISOString(), // ~2 days ago
    unreadCount: 0,
    matchDate: '2023-06-25'
  },
  {
    uid: 'user-102',
    displayName: 'Jamie Smith',
    photoURL: 'https://ui-avatars.com/api/?name=Jamie+Smith&background=3498DB&color=fff',
    role: 'Mobile Developer',
    location: 'Seattle, WA',
    lastMessage: "Thanks for connecting! I'd love to learn more about your mobile development experience.",
    lastMessageTime: new Date(Date.now() - 345600000).toISOString(), // ~4 days ago
    unreadCount: 0,
    matchDate: '2023-06-20'
  }
];

// Mock messages data
const mockMessages = {
  'user-456': [
    {
      id: 'm1',
      sender: 'user-456',
      receiver: currentUserId,
      text: "Hi there! I saw your profile and I love your React projects. I'm a UX designer looking to collaborate on a new app idea.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: 'm2',
      sender: currentUserId,
      receiver: 'user-456',
      text: "Hey Sam! Thanks for reaching out. I'd love to hear more about your app idea. What kind of application are you thinking of building?",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true
    },
    {
      id: 'm3',
      sender: 'user-456',
      receiver: currentUserId,
      text: "I'm thinking of a developer-focused tool that helps visualize API endpoints and data flow. Sort of like Postman but with better visualization tools.",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true
    },
    {
      id: 'm4',
      sender: currentUserId,
      receiver: 'user-456',
      text: "That sounds really interesting! I've been working with GraphQL lately and better visualization tools would be super helpful.",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      read: true
    },
    {
      id: 'm5',
      sender: 'user-456',
      receiver: currentUserId,
      text: "I've created some wireframes already. Would you be free for a quick call sometime this week to discuss the technical feasibility?",
      timestamp: new Date(Date.now() - 3200000).toISOString(),
      read: false
    }
  ],
  'user-789': [
    {
      id: 'm6',
      sender: 'user-789',
      receiver: currentUserId,
      text: "Hello! I noticed you're skilled in Node.js. I'm working on a backend project and could use some advice.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    },
    {
      id: 'm7',
      sender: currentUserId,
      receiver: 'user-789',
      text: "Hi Jordan, happy to help! What's your project about?",
      timestamp: new Date(Date.now() - 85000000).toISOString(),
      read: true
    }
  ],
  'user-101': [
    {
      id: 'm8',
      sender: 'user-101',
      receiver: currentUserId,
      text: "Hello! I saw your React projects and I'm impressed. Would you be interested in collaborating on an open-source project?",
      timestamp: new Date(Date.now() - 172900000).toISOString(),
      read: true
    },
    {
      id: 'm9',
      sender: currentUserId,
      receiver: 'user-101',
      text: "Hey Taylor, that sounds great! I'm always looking for open source projects to contribute to. What kind of project do you have in mind?",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true
    }
  ],
  'user-102': [
    {
      id: 'm10',
      sender: currentUserId,
      receiver: 'user-102',
      text: "Hi Jamie, thanks for connecting! I see you're a mobile developer - are you working with React Native?",
      timestamp: new Date(Date.now() - 345700000).toISOString(),
      read: true
    },
    {
      id: 'm11',
      sender: 'user-102',
      receiver: currentUserId,
      text: "Thanks for connecting! Yes, I've been working with React Native for about 3 years now. I'd love to learn more about your mobile development experience.",
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      read: true
    }
  ]
};

// Simulate getting all conversations for the current user
export const getMockConversations = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockConversations;
};

// Simulate getting messages for a specific conversation
export const getMockMessages = async (conversationId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMessages[conversationId] || [];
};

// Simulate sending a new message
export const sendMockMessage = async (conversationId, messageText) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newMessage = {
    id: `m${Date.now()}`,
    sender: currentUserId,
    receiver: conversationId,
    text: messageText,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  if (!mockMessages[conversationId]) {
    mockMessages[conversationId] = [];
  }
  
  mockMessages[conversationId].push(newMessage);
  
  // Update conversation last message
  const convoIndex = mockConversations.findIndex(c => c.uid === conversationId);
  if (convoIndex !== -1) {
    mockConversations[convoIndex].lastMessage = messageText;
    mockConversations[convoIndex].lastMessageTime = newMessage.timestamp;
  }
  
  return newMessage;
};

// Simulate marking messages as read
export const updateMessageReadStatus = async (conversationId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (mockMessages[conversationId]) {
    mockMessages[conversationId] = mockMessages[conversationId].map(msg => {
      if (msg.sender === conversationId && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    // Update unread count in conversation
    const convoIndex = mockConversations.findIndex(c => c.uid === conversationId);
    if (convoIndex !== -1) {
      mockConversations[convoIndex].unreadCount = 0;
    }
  }
  
  return true;
};