import React from 'react';

const RelationCard = ({ relation, onEdit, onDelete, onClick }) => {
  const getTypeBackgroundColor = (type) => {
    switch (type) {
      case 'Friends':
        return '#4CAF50'; // Green for Friends
      case 'Family':
        return '#2196F3'; // Blue for Family
      case 'Work':
        return '#FFC107'; // Yellow for Work
      case 'Others':
        return '#9C27B0'; // Purple for Others
      default:
        return '#757575'; // Grey for unknown types
    }
  };

  const styles = {
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid #333',
      position: 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    },
    name: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '10px',
    },
    type: {
      display: 'inline-block',
      backgroundColor: getTypeBackgroundColor(relation.category_type), // Dynamic background color
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
    },
    detail: {
      marginBottom: '6px',
      color: '#bbb',
      fontSize: '14px',
    },
    lastContactContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
    },
    lastContact: {
      fontSize: '12px',
      color: '#888',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    actionButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent triggering the onClick event for the card
    onEdit(relation); // Pass the relation object to the onEdit function
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering the onClick event for the card
    if (window.confirm(`Are you sure you want to delete ${relation.name}?`)) {
      onDelete(relation.relationship_id); // Call the onDelete function passed as a prop
    }
  };

  return (
    <div
      style={{ ...styles.card }}
      onClick={onClick}
    >
      {/* Header with Name and Type */}
      <div style={styles.header}>
        <h3 style={styles.name}>{relation.name}</h3>
        <span style={styles.type}>{relation.category_type}</span>
      </div>

      {/* Details */}
      <p style={styles.detail}>📍 {relation.location || 'No location'}</p>
      <p style={styles.detail}>📧 {relation.email_address || 'No email'}</p>
      <p style={styles.detail}>📱 {relation.phone_number || 'No phone'}</p>

      {/* Last Contacted and Actions */}
      <div style={styles.lastContactContainer}>
        <p style={styles.lastContact}>
          Last contacted:{' '}
          {relation.last_interaction_date
            ? formatDate(relation.last_interaction_date)
            : 'Never'}
        </p>
        <div style={styles.actions}>
          <button
            style={styles.actionButton}
            onClick={handleEdit}
            title="Edit"
          >
            <span role="img" aria-label="edit">
              ✏️
            </span>
          </button>
          <button
            style={styles.actionButton}
            onClick={handleDelete}
            title="Delete"
          >
            <span role="img" aria-label="delete">
              🗑️
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationCard;