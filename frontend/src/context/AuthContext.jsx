import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create the auth context
const AuthContext = createContext(null);

// Create the auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  axios.defaults.baseURL = API_URL;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Save to state
      setUser(user);
      setToken(token);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  };

  // Update the register function to handle detailed errors
  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      } else {
        throw { message: 'Registration failed' };
      }
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};