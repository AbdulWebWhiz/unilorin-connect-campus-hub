
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

const ChatList = ({ 
  conversations, 
  activeConversation,
  setActiveConversation, 
  searchQuery, 
  setSearchQuery, 
  currentUser 
}) => {
  const [suggestedContacts, setSuggestedContacts] = useState([]);

  useEffect(() => {
    // Load potential contacts from localStorage
    const allUsers = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
    
    // Filter out current user
    const otherUsers = allUsers.filter(user => user.id !== currentUser.id);
    
    // Generate suggested contacts based on faculty, year, or matric number prefix
    const suggested = otherUsers.filter(user => {
      // Check if already in a conversation
      const isInConversation = conversations.some(conv => 
        conv.participants.some(p => p.id === user.id)
      );
      
      if (isInConversation) return false;
      
      // Check for same faculty
      const sameFaculty = user.faculty === currentUser.faculty;
      
      // Check for same year of entry (based on matric number)
      const userMatricYear = user.matric ? user.matric.substring(0, 2) : '';
      const currentUserMatricYear = currentUser.matric ? currentUser.matric.substring(0, 2) : '';
      const sameYear = userMatricYear && currentUserMatricYear && userMatricYear === currentUserMatricYear;
      
      // Check for similar matric prefix (same department)
      const userMatricPrefix = user.matric ? user.matric.substring(0, 4) : '';
      const currentUserMatricPrefix = currentUser.matric ? currentUser.matric.substring(0, 4) : '';
      const sameDepartment = userMatricPrefix && currentUserMatricPrefix && userMatricPrefix === currentUserMatricPrefix;
      
      return sameFaculty || sameYear || sameDepartment;
    });
    
    setSuggestedContacts(suggested);
  }, [currentUser, conversations]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p.id !== currentUser.id);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherParticipant(conv);
    
    // Search by name
    const nameMatch = otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Search by matric number
    const matricMatch = otherUser.matric && otherUser.matric.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Search in message history
    const messageMatch = conv.messages.some(msg => 
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return nameMatch || matricMatch || messageMatch;
  });

  // Sort conversations by last message timestamp (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
  });

  // Start new conversation with a suggested contact
  const startConversation = (user) => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      participants: [currentUser, user],
      messages: [],
      lastMessageTimestamp: new Date().toISOString()
    };
    
    const updatedConversations = [...conversations, newConversation];
    localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
    
    setActiveConversation(newConversation.id);
    return newConversation;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, matric or message..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {suggestedContacts.length > 0 && !searchQuery && (
          <div className="p-3 border-b">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Suggested Contacts</h3>
            <div className="space-y-2">
              {suggestedContacts.slice(0, 3).map(user => (
                <HoverCard key={user.id}>
                  <HoverCardTrigger asChild>
                    <div
                      className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => startConversation(user)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePic} />
                        <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3 overflow-hidden flex-1">
                        <p className="font-medium truncate text-sm">{user.name}</p>
                        {user.matric && (
                          <p className="text-xs text-gray-500 truncate">{user.matric}</p>
                        )}
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profilePic} />
                          <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          {user.matric && <p className="text-sm">{user.matric}</p>}
                        </div>
                      </div>
                      {user.faculty && (
                        <Badge variant="outline" className="w-fit">
                          {user.faculty}
                        </Badge>
                      )}
                      {user.department && (
                        <p className="text-sm text-gray-600">{user.department}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
              {suggestedContacts.length > 3 && (
                <p className="text-xs text-center text-uniblue-500 cursor-pointer">
                  Show {suggestedContacts.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}
        
        {sortedConversations.length > 0 ? (
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 px-2 py-1">Conversations</h3>
            {sortedConversations.map(conv => {
              const otherUser = getOtherParticipant(conv);
              const lastMessage = conv.messages[conv.messages.length - 1];
              const isActive = conv.id === activeConversation;
              const hasUnread = false; // This will be implemented with the real-time functionality
              
              return (
                <HoverCard key={conv.id}>
                  <HoverCardTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center p-3 rounded-lg cursor-pointer",
                        isActive ? "bg-uniblue-50 text-uniblue-700" : "hover:bg-gray-50",
                        hasUnread && "font-semibold"
                      )}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage src={otherUser.profilePic} />
                        <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                          {getInitials(otherUser.name)}
                        </AvatarFallback>
                        {otherUser.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </Avatar>
                      
                      <div className="ml-3 overflow-hidden flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{otherUser.name}</p>
                          {lastMessage && (
                            <p className="text-xs text-gray-500">
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                        {lastMessage ? (
                          <p className={cn(
                            "text-sm truncate",
                            hasUnread ? "text-gray-900" : "text-gray-600"
                          )}>
                            {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                            {lastMessage.text}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Start a conversation</p>
                        )}
                      </div>
                      
                      {hasUnread && (
                        <span className="h-2 w-2 rounded-full bg-uniblue-500"></span>
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherUser.profilePic} />
                          <AvatarFallback className="bg-uniblue-200 text-uniblue-700">
                            {getInitials(otherUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{otherUser.name}</p>
                          {otherUser.matric && <p className="text-sm">{otherUser.matric}</p>}
                        </div>
                      </div>
                      {otherUser.faculty && (
                        <Badge variant="outline" className="w-fit">
                          {otherUser.faculty}
                        </Badge>
                      )}
                      {otherUser.department && (
                        <p className="text-sm text-gray-600">{otherUser.department}</p>
                      )}
                      {otherUser.year && (
                        <p className="text-sm text-gray-600">Year {otherUser.year}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {otherUser.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No conversations found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatList;
