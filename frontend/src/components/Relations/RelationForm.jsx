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

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-100">{isEdit ? 'Edit Contact' : 'New Contact'}</h3>
        <button 
          type="button" 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name*</label>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Type*</label>
          <select
            name="category_type"
            value={formData.category_type}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a type</option>
            {relationshipTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
          <input 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              name="email_address" 
              value={formData.email_address} 
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
            <input 
              name="phone_number" 
              value={formData.phone_number} 
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-3">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RelationForm;