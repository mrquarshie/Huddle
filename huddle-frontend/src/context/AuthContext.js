import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { mockRegister, mockLogin } from '../utils/mockAuth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const mockUser = localStorage.getItem('mock_user');
      
      // If we have a mock user, use it
      if (mockUser && token && token.startsWith('mock_token_')) {
        setUser(JSON.parse(mockUser));
        setLoading(false);
        return;
      }
      
      // Try to fetch from backend
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (error) {
      // If backend fails but we have mock user, use it
      const mockUser = localStorage.getItem('mock_user');
      if (mockUser) {
        setUser(JSON.parse(mockUser));
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password }, {
        timeout: 3000 // 3 second timeout
      });
      
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return user;
    } catch (error) {
      // If it's a connection error or timeout, use mock auth
      const isConnectionError = 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ECONNABORTED' ||
        error.message.includes('Network Error') || 
        error.message.includes('timeout') ||
        (!error.response && error.request);
      
      if (isConnectionError) {
        console.warn('⚠️ Backend not available, using mock authentication for development');
        console.warn('💡 To use real backend: Start your server on http://localhost:5000');
        
        try {
          const mockResponse = await mockLogin(email, password);
          localStorage.setItem('token', mockResponse.token);
          localStorage.setItem('mock_user', JSON.stringify(mockResponse.user));
          axios.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.token}`;
          setUser(mockResponse.user);
          
          console.log('✅ Mock login successful. User:', mockResponse.user);
          
          return mockResponse.user;
        } catch (mockError) {
          throw new Error('Login failed. Please ensure your backend server is running on http://localhost:5000');
        }
      }
      
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Sending registration request to /api/auth/register');
      console.log('User data:', userData);
      
      const res = await axios.post('/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 3000 // 3 second timeout
      });
      
      console.log('Registration response:', res.data);
      
      const { token, user } = res.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return user;
    } catch (error) {
      // If it's a connection error or timeout, use mock auth
      const isConnectionError = 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ECONNABORTED' ||
        error.message.includes('Network Error') || 
        error.message.includes('timeout') ||
        (!error.response && error.request);
      
      if (isConnectionError) {
        console.warn('⚠️ Backend not available, using mock authentication for development');
        console.warn('💡 To use real backend: Start your server on http://localhost:5000');
        
        try {
          const mockResponse = await mockRegister(userData);
          localStorage.setItem('token', mockResponse.token);
          localStorage.setItem('mock_user', JSON.stringify(mockResponse.user));
          axios.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.token}`;
          setUser(mockResponse.user);
          
          // Show a console message
          console.log('✅ Mock registration successful. User:', mockResponse.user);
          
          return mockResponse.user;
        } catch (mockError) {
          throw new Error('Registration failed. Please ensure your backend server is running on http://localhost:5000');
        }
      }
      
      console.error('Registration error in AuthContext:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};