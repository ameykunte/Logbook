import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = ({ onSearch }) => {
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      // borderBottom: '1px solid #333', // Keep the border for separation
      backgroundColor: 'transparent', // Remove grey background
    },
    brand: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#4f9dfb',
      textDecoration: 'none',
    },
    profileIcon: {
      position: 'relative',
      cursor: 'pointer',
      color: '#f5f5f5',
      fontSize: '20px',
      padding: '8px',
      borderRadius: '50%',
      backgroundColor: '#333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: '#1e1e1e',
      border: '1px solid #333',
      borderRadius: '4px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      width: '150px',
    },
    dropdownItem: {
      padding: '10px',
      color: '#f5f5f5',
      cursor: 'pointer',
      textAlign: 'left',
      borderBottom: '1px solid #333',
      transition: 'background-color 0.2s',
    },
    dropdownItemHover: {
      backgroundColor: '#333',
    },
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.brand}>
        Logbook
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <div style={styles.profileIcon} onClick={toggleDropdown}>
            ☰
          </div>
          {dropdownOpen && (
            <div style={styles.dropdown}>
              <div
                style={styles.dropdownItem}
                onClick={() => {
                  closeDropdown();
                  window.location.href = '/profile';
                }}
              >
                Profile Page
              </div>
              <div
                style={styles.dropdownItem}
                onClick={() => {
                  closeDropdown();
                  window.location.href = '/settings';
                }}
              >
                Settings
              </div>
              <div style={styles.dropdownItem} onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;