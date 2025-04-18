import React, { useState, useEffect } from 'react';
import { createRelation, updateRelation } from '../../services/api';

const RelationForm = ({ relation, onSuccess, onCancel }) => {
  const isEdit = Boolean(relation);
  const [formData, setFormData] = useState({
    name: '',
    category_type: '',
    location: '',
    email_address: '',
    phone_number: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: relation.name || '',
        category_type: relation.category_type || '',
        location: relation.location || '',
        email_address: relation.email_address || '',
        phone_number: relation.phone_number || '',
      });
    }
  }, [relation, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit) {
        await updateRelation(relation.relationship_id, formData);
      } else {
        await createRelation(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationshipTypes = ['Work', 'Family', 'Friends', 'Others'];

  const styles = {
    form: {
      padding: '24px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff',
    },
    closeButton: {
      color: '#aaa',
      cursor: 'pointer',
      fontSize: '18px',
      border: 'none',
      background: 'none',
    },
    error: {
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: 'rgba(153, 27, 27, 0.5)',
      border: '1px solid #991b1b',
      color: '#fca5a5',
      borderRadius: '8px',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#ccc',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '8px',
      backgroundColor: '#333',
      border: '1px solid #444',
      borderRadius: '6px',
      color: '#fff',
      outline: 'none',
      fontSize: '14px',
    },
    select: {
      width: '100%',
      padding: '8px',
      backgroundColor: '#333',
      border: '1px solid #444',
      borderRadius: '6px',
      color: '#fff',
      outline: 'none',
      fontSize: '14px',
    },
    buttonGroup: {
      marginTop: '24px',
      display: 'flex',
      gap: '12px',
    },
    primaryButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    primaryButtonHover: {
      backgroundColor: '#1d4ed8',
    },
    secondaryButton: {
      padding: '10px 16px',
      backgroundColor: '#444',
      color: '#ccc',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    secondaryButtonHover: {
      backgroundColor: '#555',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.header}>
        <h3 style={styles.title}>{isEdit ? 'Edit Contact' : 'New Contact'}</h3>
        <button
          type="button"
          onClick={onCancel}
          style={styles.closeButton}
        >
          ✕
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.inputGroup}>
        <label style={styles.label}>Name*</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Type*</label>
        <select
          name="category_type"
          value={formData.category_type}
          onChange={handleChange}
          required
          style={styles.select}
        >
          <option value="">Select a type</option>
          {relationshipTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>City</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email_address"
            value={formData.email_address}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.primaryButton,
            ...(isSubmitting ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
          }}
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            ...styles.secondaryButton,
            ...(isSubmitting ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RelationForm;