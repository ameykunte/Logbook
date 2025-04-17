import React, { useState } from 'react';

// Hardcoded relationship types for MVP
const types = ['Work', 'Family', 'Friends', 'Others'];

const Sidebar = ({ onSelectType }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (type) => {
    setSelected(type);
    if (onSelectType) {
      onSelectType(type);
    }
  };

  return (
    <aside style={{
      width: '200px',
      borderRight: '1px solid #ddd',
      padding: '1rem'
    }}>
      <h2>Types</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {types.map(type => (
          <li key={type}
            onClick={() => handleClick(type)}
            style={{
              padding: '0.5rem',
              cursor: 'pointer',
              background: selected === type ? '#e3f2fd' : 'transparent'
            }}>
            {type}
          </li>
        ))}
      </ul>
    </aside>
);
};

export default Sidebar;
