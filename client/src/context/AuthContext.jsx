import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';
import Toast, { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await apiClient.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error("Sesi tidak valid, silakan login kembali.", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(userData);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      toast.error('Login failed. Please check your credentials.');
      return false; 
    }
  };

  const register = async (name, email, password) => {
    try {
      await apiClient.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please log in.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('Logout successful!');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk mempermudah penggunaan context
export const useAuth = () => {
  return React.useContext(AuthContext);
};