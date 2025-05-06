
import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationContext';

const ChatWindow = ({ conversation, currentUser, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [typingStatus, setTypingStatus] = useState(false);
  const messagesEndRef = useRef(null);
  const { addNotification } = useNotifications();
  
  // Scroll to bottom of messages when conversation changes or new messages added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getOtherParticipant = () => {
    return conversation.participants.find(p => p.id !== currentUser.id);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Get the other participant for the notification
    const otherUser = getOtherParticipant();
    
    // In a real app, this would send a notification to the other user
    // For demo purposes, we'll add it to the current user's notifications
    addNotification({
      title: `Message sent to ${otherUser.name}`,
      message: `You: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
      type: 'message'
    });
  };
  
  // Simulate typing indicator
  useEffect(() => {
    let typingTimer;
    if (message) {
      // In a real app, this would be sent to the server
      // For demo, we'll just update local state for UI display
      setTypingStatus(true);
      
      // Clear typing indicator after 3 seconds of no typing
      typingTimer = setTimeout(() => {
        setTypingStatus(false);
      }, 3000);
    } else {
      setTypingStatus(false);
    }
    
    return () => clearTimeout(typingTimer);
  }, [message]);
  
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }
  
  const otherUser = getOtherParticipant();
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <Avatar className="h-10 w-10 relative">
          <AvatarImage src={otherUser.profilePic} />
          <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
            {getInitials(otherUser.name)}
          </AvatarFallback>
          {otherUser.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          )}
        </Avatar>
        <div className="ml-3">
          <p className="font-medium">{otherUser.name}</p>
          <p className="text-xs text-gray-500">
            {otherUser.isOnline ? 'Online' : 'Offline'}
          </p>
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
                    <div className="flex items-center text-xs mt-1 space-x-1">
                      <span className={cn(
                        isCurrentUser ? "text-blue-100" : "text-gray-500"
                      )}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {/* Message status for current user's messages */}
                      {isCurrentUser && msg.status && (
                        <span className={cn(
                          "text-xs",
                          msg.status === 'delivered' ? "text-blue-100" : "text-blue-200"
                        )}>
                          {msg.status === 'delivered' ? '✓' : msg.status === 'read' ? '✓✓' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing indicator */}
          {typingStatus && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherUser.profilePic} />
                  <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                    {getInitials(otherUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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
    </div>
  );
};

export default ChatWindow;
