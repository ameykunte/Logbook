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

  const loadRelations = async () => {
    setLoading(true);
    try {
      const data = await fetchRelations();
      setRelations(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRelations();
  }, []);

  const handleDelete = async (id) => {
    await deleteRelation(id);
    loadRelations();
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

  // Apply filter if provided
  const displayedRelations = filterType
    ? relations.filter(r => r.relationshipType === filterType)
    : relations;

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <>
          <button onClick={handleCreate} style={{ marginBottom: '1rem' }}>
            Add Contact
          </button>
          {showForm && (
            <RelationForm
              relation={editRelation}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {displayedRelations.map((r) => (
              <RelationCard
                key={r.id}
                relation={r}
                onEdit={() => handleEdit(r)}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RelationList;
