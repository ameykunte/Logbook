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

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '1rem',
      width: '250px'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0' }}>{name}</h3>
      <p style={{ margin: '0.25rem 0' }}>Type: {relationshipType}</p>
      {city && <p style={{ margin: '0.25rem 0' }}>City: {city}</p>}
      <div style={{ margin: '0.5rem 0' }}>
        {linkedin && (
          <p style={{ margin: '0.25rem 0' }}>
            <strong>LinkedIn:</strong>{' '}
            <a href={linkedin} target="_blank" rel="noreferrer">
              {linkedin}
            </a>
          </p>
        )}
        {instagram && (
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Instagram:</strong>{' '}
            <a href={instagram} target="_blank" rel="noreferrer">
              {instagram}
            </a>
          </p>
        )}
        {email && (
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
        {snapchat && (
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Snapchat:</strong> {snapchat}
          </p>
        )}
        {phoneNumber && (
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Phone:</strong> <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
          </p>
        )}
      </div>
      <p style={{ margin: '0.25rem 0' }}>
        Last Contacted:{' '}
        {lastContacted ? lastContacted.split('T')[0] : 'N/A'}
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={() => navigate(`/home/relations/${id}`)} style={{ marginRight: '0.5rem' }}>
          View
        </button>
        <button onClick={onEdit} style={{ marginRight: '0.5rem' }}>
          Edit
        </button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default RelationCard;
