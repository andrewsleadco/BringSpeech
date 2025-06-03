import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('bringspeech_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('bringspeech_user');
      }
    }
    setLoading(false);
  }, []);

  const login = () => {
    // Mock login for demo purposes
    const mockUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'student',
      enrolledCourses: [],
      createdCourses: []
    };
    
    setUser(mockUser);
    localStorage.setItem('bringspeech_user', JSON.stringify(mockUser));
    
    toast({
      title: "Welcome!",
      description: "You've successfully logged in",
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bringspeech_user');
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('bringspeech_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};