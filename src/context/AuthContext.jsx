
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const user = localStorage.getItem('unilorinUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signup = (name, email, password, matric, faculty, department) => {
    // In a real app, you would make an API call to your backend
    // For now, we'll just simulate this with localStorage
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
        const existingUser = existingUsers.find(user => user.email === email);
        
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }

        // Create new user
        const matricYear = matric ? matric.substring(0, 2) : '';
        const year = matricYear ? `20${matricYear}` : '';

        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          matric,
          faculty,
          department,
          year,
          profilePic: null,
          isOnline: true,
          createdAt: new Date().toISOString()
        };

        // Store user in localStorage
        existingUsers.push({...newUser, password});
        localStorage.setItem('unilorinUsers', JSON.stringify(existingUsers));
        
        // Set current user (without password)
        setCurrentUser(newUser);
        localStorage.setItem('unilorinUser', JSON.stringify(newUser));
        
        toast({
          title: "Account created",
          description: "Welcome to Campus Connect!",
        });
        
        resolve(newUser);
      }, 1000);
    });
  };

  // Login function
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Set user as online
          const updatedUser = { ...user, isOnline: true };
          
          // Update in users array
          const updatedUsers = users.map(u => 
            u.id === updatedUser.id ? updatedUser : u
          );
          localStorage.setItem('unilorinUsers', JSON.stringify(updatedUsers));
          
          // Don't store password in currentUser
          const { password, ...userWithoutPassword } = updatedUser;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('unilorinUser', JSON.stringify(userWithoutPassword));
          
          toast({
            title: "Login successful",
            description: "Welcome back to Campus Connect!",
          });
          
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    return new Promise((resolve) => {
      // Set user as offline
      if (currentUser) {
        const users = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
        const updatedUsers = users.map(u => 
          u.id === currentUser.id ? { ...u, isOnline: false } : u
        );
        localStorage.setItem('unilorinUsers', JSON.stringify(updatedUsers));
      }
      
      setCurrentUser(null);
      localStorage.removeItem('unilorinUser');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      resolve();
    });
  };

  // Update profile
  const updateProfile = (profileData) => {
    return new Promise((resolve, reject) => {
      try {
        // Update in users array
        const users = JSON.parse(localStorage.getItem('unilorinUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
          // Preserve password
          const password = users[userIndex].password;
          users[userIndex] = { ...users[userIndex], ...profileData, password };
          localStorage.setItem('unilorinUsers', JSON.stringify(users));
          
          // Update current user
          const updatedUser = { ...currentUser, ...profileData };
          setCurrentUser(updatedUser);
          localStorage.setItem('unilorinUser', JSON.stringify(updatedUser));
          
          // Update user in conversations
          const conversations = JSON.parse(localStorage.getItem('chatConversations') || '[]');
          const updatedConversations = conversations.map(conv => {
            const updatedParticipants = conv.participants.map(p => 
              p.id === currentUser.id ? updatedUser : p
            );
            return { ...conv, participants: updatedParticipants };
          });
          localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
          
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          });
          
          resolve(updatedUser);
        } else {
          reject(new Error('User not found'));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
