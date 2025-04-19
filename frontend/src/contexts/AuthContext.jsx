import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [access_token, setAccessToken] = useState(() => localStorage.getItem('access_token'));
  const [googleCredentials, setGoogleCredentials] = useState(() => {
    const creds = localStorage.getItem('googleCredentials');
    return creds ? JSON.parse(creds) : null;
  });
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

  useEffect(() => {
    if (googleCredentials) {
      localStorage.setItem('googleCredentials', JSON.stringify(googleCredentials));
    } else {
      localStorage.removeItem('googleCredentials');
    }
  }, [googleCredentials]);

  const handleGoogleAuth = (google_auth_url) => {
    console.log('[Debug] Starting Google Auth flow with URL:', google_auth_url);
    
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // Create message handler before opening popup
    const messageHandler = async (event) => {
      console.log('[Debug] Received message event:', event);
      
      // Accept messages from any origin during development
      if (event.data && event.data.type === 'GOOGLE_AUTH') {
        console.log('[Debug] Processing Google Auth message:', event.data);
        try {
          const { credentials } = event.data;
          if (credentials) {
            console.log('[Debug] Setting Google credentials');
            setGoogleCredentials(credentials);
            localStorage.setItem('googleCredentials', JSON.stringify(credentials));
            console.log('[Debug] Google Calendar connected successfully');
          } else {
            console.error('[Debug] No credentials in message');
          }
        } catch (error) {
          console.error('[Debug] Error processing message:', error);
        } finally {
          window.removeEventListener('message', messageHandler);
        }
      }
    };

    // Add event listener before opening popup
    console.log('[Debug] Adding message event listener');
    window.addEventListener('message', messageHandler);

    // Open popup
    const popup = window.open(
      google_auth_url,
      'Google Calendar Authorization',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Check if popup was blocked
    if (!popup) {
      console.error('[Debug] Popup was blocked by browser');
      window.removeEventListener('message', messageHandler);
      return;
    }

    // Monitor popup closure
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        console.log('[Debug] Popup was closed manually');
        clearInterval(checkPopup);
        window.removeEventListener('message', messageHandler);
      }
    }, 1000);
  };

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
          userName: signupData.name
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

  const handleGoogleCallback = async (code, state) => {
    try {
      console.log('[Debug] Handling Google callback with code:', code, 'and state:', state);
      const response = await axios.post('/api/calendar/oauth-callback', {
        code,
        state
      });
      console.log('[Debug] OAuth callback response:', response.data);
      
      if (response.data.credentials) {
        setGoogleCredentials(response.data.credentials);
      }
      
      return response.data.message === "Google Calendar connected successfully";
    } catch (error) {
      console.error('[Debug] Failed to complete Google OAuth:', error);
      throw error;
    }
  };

  const initiateGoogleCalendarConnection = async () => {
    try {
      console.log('[Debug] Initiating Google Calendar connection');
      const { data } = await axios.get('/api/calendar/auth-url');
      console.log('[Debug] Received auth URL:', data);
      if (data.auth_url) {
        handleGoogleAuth(data.auth_url);
      }
    } catch (error) {
      console.error('[Debug] Failed to get Google auth URL:', error);
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUserData(null);
    setGoogleCredentials(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('googleCredentials');
  };

  return (
    <AuthContext.Provider value={{ 
      access_token, 
      userData, 
      googleCredentials,
      login, 
      logout, 
      signup,
      handleGoogleCallback,
      initiateGoogleCalendarConnection
    }}>
      {children}
    </AuthContext.Provider>
  );
};
