import React, { useState } from 'react';

const InteractionItem = ({ interaction, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleEditClick = () => {
    console.log('Editing interaction:', interaction.log_id);
    onEdit(interaction);
    setShowDropdown(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Delete this interaction?')) {
      console.log('Deleting interaction:', interaction.log_id);
      onDelete(interaction.log_id);
    }
    setShowDropdown(false);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      padding: '16px',
      margin: '12px 0',
      position: 'relative',
      border: '1px solid #333',
      color: '#e0e0e0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#888',
        fontSize: '12px',
        marginBottom: '8px'
      }}>
        <span>{formatDate(interaction.date)}</span>
        <span>{interaction.type || 'Note'}</span>
      </div>

      <p style={{ fontStyle: 'italic', margin: '8px 0' }}>
        🤖 {interaction.content}
      </p>
      <p style={{ margin: '8px 0' }}>
        <strong>You said:</strong> {interaction.raw_text}
      </p>
      {interaction.image_urls?.map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          style={{ maxWidth: '100px', margin: '8px 8px 0 0' }}
        />
      ))}

      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: '20px',
            cursor: 'pointer'
          }}
          onClick={() => setShowDropdown((prev) => !prev)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        >
          ⋮
        </button>
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#252525',
            border: '1px solid #333',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}>
            <button
              style={{ display: 'block', width: '100%', padding: '8px', color: '#e0e0e0', background: 'transparent', border: 'none', textAlign: 'left' }}
              onClick={handleEditClick}
            >
              ✏️ Edit
            </button>
            <button
              style={{ display: 'block', width: '100%', padding: '8px', color: '#e0e0e0', background: 'transparent', border: 'none', textAlign: 'left' }}
              onClick={handleDeleteClick}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionItem;
