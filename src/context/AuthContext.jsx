import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('td_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('td_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('td_auth_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token to API client & verify session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('td_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('td_user', JSON.stringify(res.data.user));
            if (res.data.user.role === 'ADMIN') {
              setAdminUser(res.data.user);
              localStorage.setItem('td_admin', JSON.stringify(res.data.user));
            }
          }
        } catch (err) {
          console.warn('Session expired or server unavailable');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Customer Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('td_auth_token', jwtToken);
      localStorage.setItem('td_user', JSON.stringify(userData));
      if (userData.role === 'ADMIN') {
        setAdminUser(userData);
        localStorage.setItem('td_admin', JSON.stringify(userData));
      }
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Customer Registration
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('td_auth_token', jwtToken);
      localStorage.setItem('td_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/admin-login', { email, password });
    if (res.data.success) {
      const { token: jwtToken, user: adminData } = res.data;
      setToken(jwtToken);
      setAdminUser(adminData);
      setUser(adminData);
      localStorage.setItem('td_auth_token', jwtToken);
      localStorage.setItem('td_admin', JSON.stringify(adminData));
      localStorage.setItem('td_user', JSON.stringify(adminData));
      return adminData;
    }
    throw new Error(res.data.message || 'Admin login failed');
  };

  // Logout
  const logout = () => {
    setUser(null);
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('td_auth_token');
    localStorage.removeItem('td_user');
    localStorage.removeItem('td_admin');
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
      localStorage.setItem('td_user', JSON.stringify({ ...user, ...res.data.user }));
      return res.data.user;
    }
    throw new Error(res.data.message || 'Update failed');
  };

  // Forgot Password: Send OTP
  const requestPasswordOTP = async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  };

  // Reset Password with token
  const resetPassword = async (payload) => {
    const res = await api.post('/auth/reset-password', payload);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: adminUser?.role === 'ADMIN' || user?.role === 'ADMIN',
        login,
        register,
        adminLogin,
        logout,
        updateProfile,
        requestPasswordOTP,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

