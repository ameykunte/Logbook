import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [access_token, setAccessToken] = useState(() => localStorage.getItem('access_token'));
  const [userData, setUserData] = useState(() => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    if (access_token) {
      localStorage.setItem('access_token', access_token);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [access_token]);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post('/auth/login', credentials);
      if (data.access_token) {
        setAccessToken(data.access_token);
        setUserData({
          userId: data.user_id,
          userName: data.user_name
        });
        localStorage.setItem('userData', JSON.stringify({
          userId: data.user_id,
          userName: data.user_name
        }));
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (signupData) => {
    try {
      const { data } = await axios.post('/auth/signup', signupData);
      if (data.access_token) {
        setAccessToken(data.access_token);
        setUserData({
          userId: data.user_id,
          userName: signupData.name // Using the name from signup form
        });
        localStorage.setItem('userData', JSON.stringify({
          userId: data.user_id,
          userName: signupData.name
        }));
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUserData(null);
    localStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ access_token, userData, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
