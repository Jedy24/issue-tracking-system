import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah ada token saat aplikasi pertama kali dimuat
    const token = localStorage.getItem('accessToken');
    if (token) {
      // TODO: Idealnya, verifikasi token ini dengan endpoint /me atau /profile di backend
      // Untuk sekarang, kita asumsikan token valid dan coba ambil data user
      // Jika Anda punya endpoint /me, panggil di sini.
      // Untuk contoh ini, kita set user dummy jika ada token.
      setUser({ name: 'User' }); // Ganti dengan data user asli dari API
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(userData);
      
      return true; // Sukses
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return false; // Gagal
    }
  };

  const register = async (name, email, password) => {
    try {
      await apiClient.post('/auth/register', { name, email, password });
      return true; // Sukses
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      return false; // Gagal
    }
  };

  const logout = () => {
    // TODO: Panggil endpoint /logout di backend untuk membatalkan refresh token
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
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