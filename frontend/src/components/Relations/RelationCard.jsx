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
    cardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
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
      backgroundColor: getTypeBackgroundColor(relation.relationshipType), // Dynamic background color
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

  return (
    <div
      style={{ ...styles.card }}
      onClick={onClick}
    >
      {/* Header with Name and Type */}
      <div style={styles.header}>
        <h3 style={styles.name}>{relation.name}</h3>
        <span style={styles.type}>{relation.relationshipType}</span>
      </div>

      {/* Details */}
      <p style={styles.detail}>📍 {relation.city || 'No location'}</p>
      <p style={styles.detail}>📧 {relation.email || 'No email'}</p>
      <p style={styles.detail}>📱 {relation.phoneNumber || 'No phone'}</p>

      {/* Last Contacted and Actions */}
      <div style={styles.lastContactContainer}>
        <p style={styles.lastContact}>
          Last contacted:{' '}
          {relation.lastContacted ? formatDate(relation.lastContacted) : 'Never'}
        </p>
        <div style={styles.actions}>
          <button
            style={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit"
          >
            <span role="img" aria-label="edit">
              ✏️
            </span>
          </button>
          <button
            style={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
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