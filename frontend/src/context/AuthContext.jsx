import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('farmart_token');
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (error) {
          console.error('Failed to authenticate token:', error);
          localStorage.removeItem('farmart_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('farmart_token', data.token);
      setUser(data.user);
      const displayName = data.user.username || data.user.name || 'User';
      toast.success(`Welcome back, ${displayName}!`);
      return data.user;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await authService.register({ username, email, password });
      localStorage.setItem('farmart_token', data.token);
      setUser(data.user);
      toast.success(`Welcome to Farmart, ${data.user.username}!`);
      return true;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('farmart_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
