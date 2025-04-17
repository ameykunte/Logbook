import React, { useState, useEffect } from 'react';
import RelationCard from './RelationCard';
import RelationForm from './RelationForm';
import InteractionView from '../Interactions/InteractionView';
import Loader from '../Common/Loader';
import ErrorAlert from '../Common/ErrorAlert';

const RelationList = ({ filterType }) => {
  const [relations, setRelations] = useState([
    {
      id: 1,
      name: 'John Doe',
      relationshipType: 'Friends',
      city: 'New York',
      email: 'johndoe@example.com',
      phoneNumber: '123-456-7890',
      lastContacted: '2023-04-01',
    },
    {
      id: 2,
      name: 'Jane Smith',
      relationshipType: 'Colleague',
      city: 'San Francisco',
      email: 'janesmith@example.com',
      phoneNumber: '987-654-3210',
      lastContacted: '2023-03-15',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      relationshipType: 'Family',
      city: 'Los Angeles',
      email: 'alicejohnson@example.com',
      phoneNumber: '555-123-4567',
      lastContacted: '2023-02-10',
    },
  ]); // Example relations
  const [filteredRelations, setFilteredRelations] = useState(relations); // Filtered relations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editRelation, setEditRelation] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [showInteractionView, setShowInteractionView] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    },
    listView: {
      flex: showInteractionView ? '0 0 320px' : 1,
      overflowY: 'auto',
      padding: '16px',
      transition: 'flex 0.3s ease',
      backgroundColor: '#121212',
    },
    interactionView: {
      flex: '1',
      overflowY: 'auto',
      backgroundColor: '#1a1a1a',
      borderLeft: '1px solid #333',
      transition: 'flex 0.3s ease',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    addBox: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      border: '1px dashed #333',
      color: '#888',
      textAlign: 'center',
      height: '180px',
    },
    addSymbol: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#0D47A1',
      marginBottom: '8px',
    },
    addText: {
      fontSize: '14px',
      color: '#aaa',
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
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
    },
  };

  const handleCreate = () => {
    setEditRelation(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Add logic to reload relations if needed
  };

  const handleRelationClick = (relation) => {
    setSelectedRelation(relation);
    setShowInteractionView(true);
  };

  const closeInteractionView = () => {
    setShowInteractionView(false);
    setSelectedRelation(null);
  };

  // Filter relations based on the selected type
  useEffect(() => {
    if (filterType) {
      setFilteredRelations(
        relations.filter((relation) =>
          filterType === 'Others'
            ? !['Friends', 'Family', 'Work'].includes(relation.relationshipType)
            : relation.relationshipType === filterType
        )
      );
    } else {
      setFilteredRelations(relations); // Show all relations if no filter is selected
    }
  }, [filterType, relations]);

  return (
    <div style={styles.container}>
      <div style={styles.listView}>
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : (
          <div style={styles.grid}>
            {/* Add New Contact Box */}
            <div style={styles.addBox} onClick={handleCreate}>
              <div style={styles.addSymbol}>+</div>
              <div style={styles.addText}>Add New Contact</div>
            </div>

            {/* Filtered Relation Cards */}
            {filteredRelations.map((relation) => (
              <RelationCard
                key={relation.id}
                relation={relation}
                onEdit={() => setEditRelation(relation)}
                onDelete={() => console.log('Delete relation', relation.id)}
                onClick={() => handleRelationClick(relation)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Interaction View */}
      {showInteractionView && selectedRelation && (
        <div style={styles.interactionView}>
          <InteractionView
            relation={selectedRelation}
            onClose={closeInteractionView}
          />
        </div>
      )}

      {/* Modal for Adding/Editing Relation */}
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
    </div>
  );
};

export default RelationList;