import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      if (data.token) {
        setToken(data.token);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
