import React, { useState } from 'react';

// Relationship types
const types = ['Work', 'Family', 'Friends', 'Others'];

const Sidebar = ({ onSelectType, onSearch }) => {
  const [selected, setSelected] = useState(null);

  const styles = {
    sidebar: {
      width: '200px',
      backgroundColor: '#1e1e1e',
      borderRight: '1px solid #333',
      padding: '24px',
      height: '100vh', // Make sidebar take full height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between' // Space between content and button
    },
    heading: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#f5f5f5',
      marginBottom: '16px'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      padding: '10px',
      cursor: 'pointer',
      borderRadius: '4px',
      marginBottom: '4px',
      color: '#acacac',
      transition: 'background-color 0.2s'
    },
    listItemSelected: {
      backgroundColor: '#0D47A1',
      color: 'white'
    },
    Search: {
      marginTop: '0', // Remove margin top
      padding: '10px 16px',
      backgroundColor: '#1976D2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer'
    }
  };

  const handleClick = (type) => {
    // If the same type is clicked, clear the filter
    if (selected === type) {
      setSelected(null);
      onSelectType(null);
      return;
    }
    
    setSelected(type);
    if (onSelectType) {
      onSelectType(type);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) onSearch();
  };

  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.heading}>Categories</h2>
        <ul style={styles.list}>
          <li 
            onClick={() => handleClick(null)} 
            style={{
              ...styles.listItem,
              ...(selected === null ? styles.listItemSelected : {})
            }}
          >
            All Contacts
          </li>
          {types.map(type => (
            <li 
              key={type}
              onClick={() => handleClick(type)}
              style={{
                ...styles.listItem,
                ...(selected === type ? styles.listItemSelected : {})
              }}
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
      <button 
        style={styles.Search}
        onClick={handleSearchClick}
      >
        Search
      </button>
    </aside>
  );
};

export default Sidebar;