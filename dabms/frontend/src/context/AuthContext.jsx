import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('dabms_user')); } catch { return null; }
  });
  const [token,   setToken]   = useState(() => localStorage.getItem('dabms_token') || null);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('dabms_token', token);
      localStorage.setItem('dabms_user',  JSON.stringify(user));
    } else {
      localStorage.removeItem('dabms_token');
      localStorage.removeItem('dabms_user');
    }
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      setUser(data.user);
      setToken(data.token);
      toast.success('Account created! Welcome aboard.');
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    toast.info('You have been logged out');
  }, []);


  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      return data.user;
    } catch {
      logout();
    }
  }, [logout]);

  const updateProfile = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(data.user);
      toast.success('Profile updated!');
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin         = user?.role === 'admin';
  const isDoctor        = user?.role === 'doctor';
  const isPatient       = user?.role === 'patient';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout, refreshUser, updateProfile,
      isAuthenticated, isAdmin, isDoctor, isPatient,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
