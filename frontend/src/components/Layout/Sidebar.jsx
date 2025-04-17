import React, { useState } from 'react';

// Relationship types
const types = ['Work', 'Family', 'Friends', 'Others'];

const Sidebar = ({ onSelectType }) => {
  const [selected, setSelected] = useState(null);

  const styles = {
    sidebar: {
      width: '200px',
      backgroundColor: '#1e1e1e',
      borderRight: '1px solid #333',
      padding: '24px'
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
    </aside>
  );
};

export default Sidebar;