import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const GoogleCalendarButton = () => {
  const { googleCredentials, initiateGoogleCalendarConnection } = useContext(AuthContext);

  const handleConnect = async () => {
    try {
      await initiateGoogleCalendarConnection();
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error);
    }
  };

  const buttonStyles = {
    base: {
      padding: '10px 20px',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    connected: {
      backgroundColor: '#34A853', // Google green color
    },
    disconnected: {
      backgroundColor: '#4285f4', // Google blue color
    }
  };

  return (
    <button 
      onClick={!googleCredentials ? handleConnect : undefined}
      style={{
        ...buttonStyles.base,
        ...(googleCredentials ? buttonStyles.connected : buttonStyles.disconnected)
      }}
    >
      <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>
      </svg>
      {googleCredentials ? 'Connected to Calendar' : 'Connect Google Calendar'}
    </button>
  );
};

export default GoogleCalendarButton;