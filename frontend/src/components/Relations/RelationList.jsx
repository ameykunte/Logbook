import React, { useState, useEffect } from 'react';
import RelationCard from './RelationCard';
import RelationForm from './RelationForm';
import InteractionView from '../Interactions/InteractionView';
import Loader from '../Common/Loader';
import ErrorAlert from '../Common/ErrorAlert';
import { fetchRelations, deleteRelation } from '../../services/api';

const RelationList = ({ filterType }) => {
  const [relations, setRelations] = useState([]); // Fetched relations
  const [filteredRelations, setFilteredRelations] = useState([]); // Filtered relations
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
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

  // Fetch relationships from the database
  useEffect(() => {
    const loadRelations = async () => {
      setLoading(true);
      try {
        const data = await fetchRelations();
        if (data && data.length > 0) {
          setRelations(data);
          setFilteredRelations(data); // Initialize filtered relations
        } else {
          setRelations([]);
          setFilteredRelations([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching relations:', err);
        setError('Failed to load relationships. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRelations();
  }, []);

  // Filter relations based on the selected type
  useEffect(() => {
    if (filterType) {
      setFilteredRelations(
        relations.filter((relation) =>
          filterType === 'Others'
            ? !['Friends', 'Family', 'Work'].includes(relation.category_type)
            : relation.category_type === filterType
        )
      );
    } else {
      setFilteredRelations(relations); // Show all relations if no filter is selected
    }
  }, [filterType, relations]);

  const handleCreate = () => {
    setEditRelation(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Reload relations after a successful form submission
    setLoading(true);
    fetchRelations()
      .then((data) => {
        setRelations(data);
        setFilteredRelations(data);
      })
      .catch((err) => {
        console.error('Error reloading relations:', err);
        setError('Failed to reload relationships.');
      })
      .finally(() => setLoading(false));
  };

  const handleRelationClick = (relation) => {
    setSelectedRelation(relation);
    setShowInteractionView(true);
  };

  const closeInteractionView = () => {
    setShowInteractionView(false);
    setSelectedRelation(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRelation(id); // Call the API to delete the relation
      setRelations((prevRelations) =>
        prevRelations.filter((relation) => relation.relationship_id !== id)
      ); // Update the state to remove the deleted relation
    } catch (error) {
      console.error('Error deleting relation:', error);
      alert('Failed to delete the relation. Please try again.');
    }
  };

  // Render loading or error states
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }


  return (
    <div style={styles.container}>
      <div style={styles.listView}>
        <div style={styles.grid}>
          {/* Add New Contact Box */}
          <div style={styles.addBox} onClick={handleCreate}>
            <div style={styles.addSymbol}>+</div>
            <div style={styles.addText}>Add New Contact</div>
          </div>

          {/* Filtered Relation Cards */}
          {filteredRelations.map((relation) => (
            <RelationCard
              key={relation.relationship_id}
              relation={relation}
              onEdit={() => setEditRelation(relation)}
              onDelete={() => handleDelete(relation.relationship_id)} // Pass the handleDelete function
              onClick={() => handleRelationClick(relation)}
            />
          ))}
        </div>
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