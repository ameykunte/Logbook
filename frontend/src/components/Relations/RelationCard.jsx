import React from 'react';
import { useNavigate } from 'react-router-dom';

const RelationCard = ({ relation, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const {
    id,
    name,
    relationshipType,
    city,
    linkedin,
    instagram,
    email,
    snapchat,
    phoneNumber,
    lastContacted
  } = relation;

  const styles = {
    card: {
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#1e1e1e',
      transition: 'box-shadow 0.3s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    name: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#f5f5f5',
      margin: 0
    },
    type: {
      display: 'inline-block',
      padding: '2px 8px',
      fontSize: '12px',
      borderRadius: '12px',
      backgroundColor: '#0a3671',
      color: '#a8c7fa'
    },
    location: {
      color: '#888',
      marginTop: '8px'
    },
    contactInfo: {
      margin: '12px 0',
      flex: 1
    },
    infoItem: {
      fontSize: '14px',
      color: '#bbb',
      margin: '6px 0'
    },
    link: {
      color: '#4f9dfb',
      textDecoration: 'none'
    },
    lastContacted: {
      fontSize: '12px',
      color: '#777',
      marginTop: '12px'
    },
    footer: {
      borderTop: '1px solid #333',
      marginTop: '12px',
      paddingTop: '12px',
      display: 'flex',
      gap: '8px'
    },
    viewButton: {
      flex: 1,
      padding: '8px 0',
      backgroundColor: '#0D47A1',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    editButton: {
      padding: '8px 12px',
      backgroundColor: '#333',
      color: '#ddd',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    deleteButton: {
      padding: '8px 12px',
      backgroundColor: '#333',
      color: '#ddd',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.name}>{name}</h3>
        <span style={styles.type}>{relationshipType}</span>
      </div>
      
      {city && <p style={styles.location}>📍 {city}</p>}
      
      <div style={styles.contactInfo}>
        {email && (
          <p style={styles.infoItem}>
            <span style={{fontWeight: 500}}>Email:</span>{' '}
            <a href={`mailto:${email}`} style={styles.link}>{email}</a>
          </p>
        )}
        
        {phoneNumber && (
          <p style={styles.infoItem}>
            <span style={{fontWeight: 500}}>Phone:</span>{' '}
            <a href={`tel:${phoneNumber}`} style={styles.link}>{phoneNumber}</a>
          </p>
        )}
        
        {linkedin && (
          <p style={styles.infoItem}>
            <span style={{fontWeight: 500}}>LinkedIn:</span>{' '}
            <a href={linkedin} target="_blank" rel="noreferrer" style={styles.link}>
              View Profile
            </a>
          </p>
        )}
      </div>
      
      <p style={styles.lastContacted}>
        Last Contact:{' '}
        {lastContacted ? new Date(lastContacted).toLocaleDateString() : 'Never'}
      </p>
      
      <div style={styles.footer}>
        <button 
          onClick={() => navigate(`/relations/${id}`)} 
          style={styles.viewButton}
        >
          View Details
        </button>
        <button 
          onClick={onEdit} 
          style={styles.editButton}
        >
          Edit
        </button>
        <button 
          onClick={onDelete} 
          style={{...styles.deleteButton, ':hover': {backgroundColor: '#8b0000'}}}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RelationCard;