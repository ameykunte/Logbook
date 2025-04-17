import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      background: '#1976d2',
      color: 'white'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Logbook</h1>
      <button onClick={handleLogout} style={{
        background: 'white',
        color: '#1976d2',
        border: 'none',
        padding: '0.5rem 1rem',
        cursor: 'pointer'
      }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
