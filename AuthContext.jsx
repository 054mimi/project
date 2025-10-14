import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('regenUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsGuest(false);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate login - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('regenUsers') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      setIsGuest(false);
      localStorage.setItem('regenUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (userData) => {
    // Simulate signup - in production, this would call an API
    const users = JSON.parse(localStorage.getItem('regenUsers') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('regenUsers', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    setIsGuest(false);
    localStorage.setItem('regenUser', JSON.stringify(userWithoutPassword));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('regenUser');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const switchRegion = (countyId) => {
    if (user) {
      const updatedUser = { ...user, currentRegion: countyId };
      setUser(updatedUser);
      localStorage.setItem('regenUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isGuest,
    loading,
    login,
    signup,
    logout,
    continueAsGuest,
    switchRegion
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

