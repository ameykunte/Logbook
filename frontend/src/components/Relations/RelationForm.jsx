import React, { useState, useEffect } from 'react';
import { createRelation, updateRelation } from '../../services/api';

const RelationForm = ({ relation, onSuccess, onCancel }) => {
  const isEdit = Boolean(relation);
  const [formData, setFormData] = useState({
    name: '',
    relationshipType: '',
    city: '',
    linkedin: '',
    instagram: '',
    email: '',
    snapchat: '',
    phoneNumber: '',
    likes: '',
    dislikes: ''
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: relation.name || '',
        relationshipType: relation.relationshipType || '',
        city: relation.city || '',
        linkedin: relation.linkedin || '',
        instagram: relation.instagram || '',
        email: relation.email || '',
        snapchat: relation.snapchat || '',
        phoneNumber: relation.phoneNumber || '',
        likes: relation.likes || '',
        dislikes: relation.dislikes || ''
      });
    }
  }, [relation, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateRelation(relation.id, formData);
    } else {
      await createRelation(formData);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{isEdit ? 'Edit Contact' : 'New Contact'}</h3>
      <div>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Type</label>
        <input name="relationshipType" value={formData.relationshipType} onChange={handleChange} required />
      </div>
      <div>
        <label>City</label>
        <input name="city" value={formData.city} onChange={handleChange} />
      </div>
      <div>
        <label>LinkedIn</label>
        <input name="linkedin" value={formData.linkedin} onChange={handleChange} />
      </div>
      <div>
        <label>Instagram</label>
        <input name="instagram" value={formData.instagram} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Snapchat</label>
        <input name="snapchat" value={formData.snapchat} onChange={handleChange} />
      </div>
      <div>
        <label>Phone Number</label>
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
      </div>
      <div>
        <label>Likes</label>
        <input name="likes" value={formData.likes} onChange={handleChange} />
      </div>
      <div>
        <label>Dislikes</label>
        <input name="dislikes" value={formData.dislikes} onChange={handleChange} />
      </div>
      <button type="submit" style={{ marginRight: '0.5rem' }}>
        {isEdit ? 'Update' : 'Create'}
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default RelationForm;
