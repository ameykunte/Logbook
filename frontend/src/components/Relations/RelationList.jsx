import React, { useState, useEffect } from 'react';
import { fetchRelations, deleteRelation } from '../../services/api';
import RelationCard from './RelationCard';
import RelationForm from './RelationForm';
import Loader from '../Common/Loader';
import ErrorAlert from '../Common/ErrorAlert';

const RelationList = ({ filterType }) => {
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editRelation, setEditRelation] = useState(null);

  const styles = {
    container: {
      marginBottom: '20px'
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#0D47A1',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      marginBottom: '20px',
      cursor: 'pointer'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '32px',
      backgroundColor: '#1e1e1e',
      borderRadius: '8px'
    },
    emptyText: {
      color: '#888'
    }
  };

  const loadRelations = async () => {
    setLoading(true);
    try {
      const data = await fetchRelations();
      setRelations(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load relations:", err);
      setError("Network Error: Could not connect to the server. Please check your connection or try again later.");
      setRelations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteRelation(id);
        loadRelations();
      } catch (err) {
        setError("Failed to delete contact. Please try again.");
      }
    }
  };

  const handleCreate = () => {
    setEditRelation(null);
    setShowForm(true);
  };

  const handleEdit = (relation) => {
    setEditRelation(relation);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadRelations();
  };

  // Mock data for development if API fails
  const useMockData = process.env.NODE_ENV === 'development' && error && !relations.length;
  
  const mockRelations = [
    {
      id: 1,
      name: "John Smith",
      relationshipType: "Work",
      city: "San Francisco",
      email: "john@example.com",
      phoneNumber: "555-123-4567",
      lastContacted: new Date().toISOString()
    },
    {
      id: 2,
      name: "Jane Doe",
      relationshipType: "Friends",
      city: "New York",
      email: "jane@example.com",
      phoneNumber: "555-987-6543",
      lastContacted: new Date().toISOString()
    }
  ];

  // Apply filter if provided
  const displayedRelations = useMockData 
    ? (filterType ? mockRelations.filter(r => r.relationshipType === filterType) : mockRelations)
    : (filterType ? relations.filter(r => r.relationshipType === filterType) : relations);

  return (
    <div style={styles.container}>
      {loading ? (
        <Loader />
      ) : error ? (
        <>
          <ErrorAlert message={error} />
          {useMockData && (
            <div style={{marginTop: '20px'}}>
              <p style={{color: '#aaa', marginBottom: '10px'}}>Showing mock data for development purposes:</p>
            </div>
          )}
        </>
      ) : null}
      
      <button 
        onClick={handleCreate} 
        style={styles.addButton}
      >
        Add New Contact
      </button>
      
      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <RelationForm
              relation={editRelation}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      
      {displayedRelations.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No contacts available. Add your first contact to get started!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {displayedRelations.map((r) => (
            <RelationCard
              key={r.id}
              relation={r}
              onEdit={() => handleEdit(r)}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelationList;