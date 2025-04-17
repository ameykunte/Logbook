import React, { useState, useEffect } from 'react';

const InteractionForm = ({ interaction, onSuccess, onCancel }) => {
  const isEdit = Boolean(interaction);
  const [formData, setFormData] = useState({
    timestamp: new Date().toISOString().slice(0,16),
    content: ''
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        timestamp: interaction.timestamp.slice(0,16),
        content: interaction.content || ''
      });
    }
  }, [interaction, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
      <h4>{isEdit ? 'Edit Interaction' : 'New Interaction'}</h4>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Time</label>
        <input
          type="datetime-local"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={3}
          style={{ width: '100%' }}
        />
      </div>
      <button type="submit" style={{ marginRight: '0.5rem' }}>
        {isEdit ? 'Update' : 'Add'}
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default InteractionForm;
