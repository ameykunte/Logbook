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
      backgroundColor: '#1e1e1e',
      borderBottom: '1px solid #333'
    },
    brand: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#4f9dfb',
      textDecoration: 'none'
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#2e2e2e',
      borderRadius: '4px',
      border: '1px solid #333',
      padding: '4px 8px',
      width: '200px',
      marginRight: '16px',
      position: 'relative'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      backgroundColor: 'transparent',
      color: '#f5f5f5',
      outline: 'none',
      padding: '4px',
      paddingRight: '24px' // Add padding to avoid overlap with the icon
    },
    searchIcon: {
      position: 'absolute',
      right: '8px',
      color: '#f5f5f5',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
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
      justifyContent: 'center'
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
      width: '150px'
    },
    dropdownItem: {
      padding: '10px',
      color: '#f5f5f5',
      cursor: 'pointer',
      textAlign: 'left',
      borderBottom: '1px solid #333',
      transition: 'background-color 0.2s'
    },
    dropdownItemHover: {
      backgroundColor: '#333'
    }
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
      <Link to="/dashboard" style={styles.brand}>Logbook</Link>
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <span
          style={styles.searchIcon}
          onClick={() => onSearch && onSearch(searchQuery)}
        >
          {/* 2D SVG Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            fill="#f5f5f5"
            viewBox="0 0 24 24"
          >
            <path d="M10 2a8 8 0 105.293 14.707l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
          </svg>
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div
          style={styles.profileIcon}
          onClick={toggleDropdown}
        >
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
            <div
              style={styles.dropdownItem}
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;