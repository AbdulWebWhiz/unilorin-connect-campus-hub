
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search, Send } from 'lucide-react';

const Chat = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  
  // Load conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
    
    // Filter conversations to only include those that the current user is a part of
    const userConversations = storedConversations.filter(conv => 
      conv.participants.some(p => p.id === currentUser.id)
    );
    
    setConversations(userConversations);
    
    // If no active conversation but conversations exist, set the first one as active
    if (userConversations.length > 0 && !activeConversation) {
      setActiveConversation(userConversations[0].id);
    }
    
    // For demo purposes, create sample conversations if none exist
    if (userConversations.length === 0) {
      const sampleUsers = [
        { id: 'user1', name: 'John Doe', profilePic: null },
        { id: 'user2', name: 'Jane Smith', profilePic: null },
        { id: 'user3', name: 'Ahmed Mohammed', profilePic: null }
      ];
      
      const sampleConversations = sampleUsers.map(user => ({
        id: `conv-${user.id}`,
        participants: [currentUser, user],
        messages: [
          {
            id: `msg-${user.id}-1`,
            senderId: user.id,
            text: `Hi ${currentUser.name}, welcome to UniConnect!`,
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        lastMessageTimestamp: new Date(Date.now() - 3600000).toISOString()
      }));
      
      setConversations(sampleConversations);
      localStorage.setItem('chatConversations', JSON.stringify(sampleConversations));
      setActiveConversation(sampleConversations[0].id);
    }
  }, [currentUser, activeConversation]);
  
  // Scroll to bottom of messages when conversation changes or new messages added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, conversations]);
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p.id !== currentUser.id);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: message,
      timestamp: new Date().toISOString()
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
    
    setMessage('');
    
    // Get the other participant for the notification
    const conversation = conversations.find(c => c.id === activeConversation);
    if (conversation) {
      const otherUser = getOtherParticipant(conversation);
      
      // In a real app, this would send a notification to the other user
      // For demo purposes, we'll add it to the current user's notifications
      addNotification({
        title: `Message sent to ${otherUser.name}`,
        message: `You: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
        type: 'message'
      });
    }
  };
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherParticipant(conv);
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Sort conversations by last message timestamp (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
  });
  
  // Find the active conversation object
  const conversation = conversations.find(c => c.id === activeConversation);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(80vh-8rem)]">
            {sortedConversations.length > 0 ? (
              <div className="p-2">
                {sortedConversations.map(conv => {
                  const otherUser = getOtherParticipant(conv);
                  const lastMessage = conv.messages[conv.messages.length - 1];
                  
                  return (
                    <div
                      key={conv.id}
                      className={cn(
                        "flex items-center p-3 rounded-lg cursor-pointer",
                        conv.id === activeConversation 
                          ? "bg-uniblue-50 text-uniblue-700" 
                          : "hover:bg-gray-50"
                      )}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherUser.profilePic} />
                        <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                          {getInitials(otherUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="ml-3 overflow-hidden flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{otherUser.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(lastMessage.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                          {lastMessage.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No conversations found</p>
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Chat Window */}
        <Card className="md:col-span-2 flex flex-col h-[80vh]">
          {conversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getOtherParticipant(conversation).profilePic} />
                  <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                    {getInitials(getOtherParticipant(conversation).name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{getOtherParticipant(conversation).name}</p>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversation.messages.map((msg) => {
                    const isCurrentUser = msg.senderId === currentUser.id;
                    const sender = conversation.participants.find(p => p.id === msg.senderId);
                    
                    return (
                      <div key={msg.id} className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
                        <div className="flex items-end space-x-2">
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={sender.profilePic} />
                              <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                                {getInitials(sender.name)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={cn(
                            "px-4 py-2 rounded-lg max-w-md break-words",
                            isCurrentUser 
                              ? "bg-uniblue-500 text-white rounded-br-none" 
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          )}>
                            <p>{msg.text}</p>
                            <p className={cn(
                              "text-xs mt-1",
                              isCurrentUser ? "text-blue-100" : "text-gray-500"
                            )}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <form 
                  className="flex space-x-2" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    className="bg-uniblue-500 hover:bg-uniblue-600"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
