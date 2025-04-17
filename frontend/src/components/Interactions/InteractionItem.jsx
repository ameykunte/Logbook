import React from 'react';

const InteractionItem = ({ interaction, onEdit, onDelete }) => {
  const { id, timestamp, content } = interaction;
  const formattedTime = new Date(timestamp).toLocaleString();

  return (
    <div style={{
      borderBottom: '1px solid #eee',
      padding: '0.5rem 0'
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{formattedTime}</p>
      <p style={{ margin: '0.25rem 0' }}>{content}</p>
      <button onClick={() => onEdit(interaction)} style={{ marginRight: '0.5rem' }}>
        Edit
      </button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default InteractionItem;
