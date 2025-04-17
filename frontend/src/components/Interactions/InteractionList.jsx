import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchInteractions,
  createInteraction,
  updateInteraction,
  deleteInteraction
} from '../../services/api';
import Loader from '../Common/Loader';
import ErrorAlert from '../Common/ErrorAlert';
import InteractionItem from './InteractionItem';
import InteractionForm from './InteractionForm';

const InteractionList = () => {
  const { id: relationId } = useParams();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editInteraction, setEditInteraction] = useState(null);

  const loadInteractions = async () => {
    setLoading(true);
    try {
      const data = await fetchInteractions(relationId);
      setInteractions(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInteractions();
  }, [relationId]);

  const handleDelete = async (id) => {
    await deleteInteraction(id);
    loadInteractions();
  };

  const handleCreate = () => {
    setEditInteraction(null);
    setShowForm(true);
  };

  const handleEdit = (interaction) => {
    setEditInteraction(interaction);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editInteraction) {
      await updateInteraction(editInteraction.id, formData);
    } else {
      await createInteraction(relationId, formData);
    }
    setShowForm(false);
    loadInteractions();
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <>
          <button onClick={handleCreate} style={{ marginBottom: '1rem' }}>
            Add Interaction
          </button>
          {showForm && (
            <InteractionForm
              interaction={editInteraction}
              onSuccess={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}
          {interactions.length === 0 ? (
            <p>No interactions yet.</p>
          ) : (
            interactions.map((inter) => (
              <InteractionItem
                key={inter.id}
                interaction={inter}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default InteractionList;
