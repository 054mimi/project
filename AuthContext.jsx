import React, { createContext, useContext, useState, useEffect } from 'react';
const API_BASE = 'http://localhost:5000/api';

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
    // Check for stored token and user data
    const token = localStorage.getItem('regenToken');
    const storedUser = localStorage.getItem('regenUser');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsGuest(false);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsGuest(false);
        localStorage.setItem('regenToken', data.token);
        localStorage.setItem('regenUser', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsGuest(false);
        localStorage.setItem('regenToken', data.token);
        localStorage.setItem('regenUser', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('regenUser');
    localStorage.removeItem('regenToken');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const switchRegion = async (countyId) => {
    if (user) {
      const token = localStorage.getItem('regenToken');
      try {
        await fetch(`${API_BASE}/auth/region`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ countyId })
        });
        const updatedUser = { ...user, currentRegion: countyId };
        setUser(updatedUser);
        localStorage.setItem('regenUser', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Failed to update region');
      }
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

