
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import UserProfileCard from '@/components/chat/UserProfileCard';

const Chat = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  
  // Add online status to users (simulation)
  useEffect(() => {
    // Update all users with random online status for demonstration
    const users = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
    const updatedUsers = users.map(user => ({
      ...user,
      isOnline: Math.random() > 0.5 // Random online status
    }));
    localStorage.setItem('unilorinUsers', JSON.stringify(updatedUsers));
  }, []);
  
  // Load conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
    
    // Filter conversations to only include those that the current user is a part of
    const userConversations = storedConversations.filter(conv => 
      conv.participants.some(p => p.id === currentUser.id)
    );
    
    // Update participants with latest user data (including online status)
    const updatedConversations = userConversations.map(conv => {
      const updatedParticipants = conv.participants.map(participant => {
        if (participant.id === currentUser.id) return currentUser;
        
        // Get latest data for other participants
        const users = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
        const latestData = users.find(u => u.id === participant.id);
        return latestData || participant;
      });
      
      return {
        ...conv,
        participants: updatedParticipants
      };
    });
    
    setConversations(updatedConversations);
    
    // If no active conversation but conversations exist, set the first one as active
    if (updatedConversations.length > 0 && !activeConversation) {
      setActiveConversation(updatedConversations[0].id);
    }
    
    // For demo purposes, create sample conversations if none exist
    if (updatedConversations.length === 0) {
      const users = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
      
      // Filter out current user and get 3 random users
      const otherUsers = users.filter(user => user.id !== currentUser.id);
      const sampleUsers = otherUsers.slice(0, 3);
      
      if (sampleUsers.length > 0) {
        const sampleConversations = sampleUsers.map(user => ({
          id: `conv-${user.id}`,
          participants: [
            currentUser, 
            { ...user, isOnline: Math.random() > 0.5 } // Add random online status
          ],
          messages: [
            {
              id: `msg-${user.id}-1`,
              senderId: user.id,
              text: `Hi ${currentUser.name}, welcome to UniConnect!`,
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: 'read'
            }
          ],
          lastMessageTimestamp: new Date(Date.now() - 3600000).toISOString()
        }));
        
        setConversations(sampleConversations);
        localStorage.setItem('chatConversations', JSON.stringify(sampleConversations));
        setActiveConversation(sampleConversations[0].id);
      }
    }
  }, [currentUser, activeConversation]);
  
  // Handle sending a new message
  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: messageText,
      timestamp: new Date().toISOString(),
      status: 'delivered' // In a real app, this would be updated by the server
    };
    
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessageTimestamp: newMessage.timestamp
          };
        }
        return conv;
      });
      
      localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
      return updatedConversations;
    });
    
    // In a real app, here we would send the message to a WebSocket or Firebase
    
    // Simulate reply after random delay (1-3 seconds) for demo purposes
    if (Math.random() > 0.3) { // 70% chance of reply
      const conversation = conversations.find(c => c.id === activeConversation);
      if (conversation) {
        const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
        
        setTimeout(() => {
          const replyMessage = {
            id: `msg-reply-${Date.now()}`,
            senderId: otherUser.id,
            text: getRandomReply(),
            timestamp: new Date().toISOString()
          };
          
          setConversations(prevConversations => {
            const updatedConversations = prevConversations.map(conv => {
              if (conv.id === activeConversation) {
                return {
                  ...conv,
                  messages: [...conv.messages, replyMessage],
                  lastMessageTimestamp: replyMessage.timestamp
                };
              }
              return conv;
            });
            
            localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
            return updatedConversations;
          });
        }, 1000 + Math.random() * 2000);
      }
    }
  };
  
  // Helper function to generate random replies for demo
  const getRandomReply = () => {
    const replies = [
      "That's great!",
      "Thanks for the info!",
      "I'll keep that in mind.",
      "Let me check and get back to you.",
      "When is the next lecture?",
      "Did you submit the assignment?",
      "Are you going to the event?",
      "I'll see you at the library later.",
      "Have you seen the announcement?",
      "The deadline is tomorrow!"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };
  
  // Find the active conversation object
  const conversation = conversations.find(c => c.id === activeConversation);
  
  // Get the other participant for profile viewing
  const getOtherParticipant = () => {
    if (!conversation) return null;
    return conversation.participants.find(p => p.id !== currentUser.id);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Conversations List */}
        <Card className="md:col-span-4 lg:col-span-3 overflow-hidden h-[80vh]">
          <ChatList 
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentUser={currentUser}
          />
        </Card>
        
        {/* Chat Window */}
        <Card className="md:col-span-8 lg:col-span-6 flex flex-col h-[80vh]">
          <ChatWindow 
            conversation={conversation}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        </Card>
        
        {/* User Profile Side Panel (visible on larger screens) */}
        <div className="hidden lg:block lg:col-span-3 h-[80vh]">
          <UserProfileCard user={getOtherParticipant()} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
