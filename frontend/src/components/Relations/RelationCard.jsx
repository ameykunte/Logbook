import React from 'react';

const RelationCard = ({ relation, onEdit, onDelete, onClick }) => {
  const styles = {
    card: {
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid #333',
      position: 'relative'
    },
    cardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
    },
    name: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#fff'
    },
    type: {
      display: 'inline-block',
      backgroundColor: '#0D47A1',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      marginBottom: '12px'
    },
    detail: {
      marginBottom: '6px',
      color: '#bbb',
      fontSize: '14px'
    },
    lastContact: {
      fontSize: '12px',
      color: '#888',
      marginTop: '16px'
    },
    actions: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: '8px',
      opacity: 0,
      transition: 'opacity 0.2s ease'
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
      justifyContent: 'center'
    },
    container: {
      position: 'relative',
      '&:hover .actions': {
        opacity: 1
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const [hover, setHover] = React.useState(false);

  return (
    <div 
      style={{position: 'relative'}}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <div 
        style={{...styles.card, ...(hover ? styles.cardHover : {})}}
        onClick={onClick}
      >
        <h3 style={styles.name}>{relation.name}</h3>
        <span style={styles.type}>{relation.relationshipType}</span>
        <p style={styles.detail}>📍 {relation.city || 'No location'}</p>
        <p style={styles.detail}>📧 {relation.email || 'No email'}</p>
        <p style={styles.detail}>📱 {relation.phoneNumber || 'No phone'}</p>
        <p style={styles.lastContact}>
          Last contacted: {relation.lastContacted ? formatDate(relation.lastContacted) : 'Never'}
        </p>
      </div>
      
      <div style={{...styles.actions, opacity: hover ? 1 : 0}}>
        <button 
          style={styles.actionButton} 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Edit"
        >
          <span role="img" aria-label="edit">✏️</span>
        </button>
        <button 
          style={styles.actionButton} 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete"
        >
          <span role="img" aria-label="delete">🗑️</span>
        </button>
      </div>
    </div>
  );
};

export default RelationCard;