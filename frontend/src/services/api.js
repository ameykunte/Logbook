
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// Attach token to each request
api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('access_token') || localStorage.getItem('token');
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  console.log("Request headers:", config.headers); // Debug statement
  return config;
});

// Auth
export const login = async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    console.log('Login response:', data);
    localStorage.setItem('access_token', data.access_token || data.token);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Relations CRUD
export const fetchRelations = async () => {
  try {
    const { data } = await api.get('/relations');
    console.log('Fetched relations:', data);
    return data;
  } catch (error) {
    console.error('Error fetching relations:', error);
    throw error;
  }
};

export const createRelation = async (relation) => {
  try {
    console.log('Creating relation:', relation);
    const { data } = await api.post('/relations/add', relation);
    console.log('Relation created:', data);
    return data;
  } catch (error) {
    console.error('Error creating relation:', error);
    throw error;
  }
};

export const updateRelation = async (id, relation) => {
  try {
    console.log('Updating relation:', id, relation);
    const { data } = await api.put(`/relations/${id}`, relation);
    console.log('Relation updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating relation:', error);
    throw error;
  }
};

export const deleteRelation = async (id) => {
  try {
    console.log('Deleting relation:', id);
    const { data } = await api.delete(`/relations/${id}`);
    console.log('Relation deleted:', data);
    return data;
  } catch (error) {
    console.error('Error deleting relation:', error);
    throw error;
  }
};

// Interactions CRUD
export const fetchInteractions = async (relationId) => {
  try {
    console.log('Fetching interactions for:', relationId);
    const { data } = await api.get(`/relations/${relationId}/interactions`);
    console.log('Fetched interactions:', data);
    return data;
  } catch (error) {
    console.error('Error fetching interactions:', error);
    throw error;
  }
};

export const createInteraction = async (relationId, { text, files = [] }) => {
  try {
    console.log('Creating interaction for relation:', relationId, { text, files });
    const formData = new FormData();
    formData.append('text', text);
    files.forEach((file) => formData.append('images', file));

    const { data } = await api.post(
      `/relations/${relationId}/interactions`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    console.log('Interaction created:', data);
    return data;
  } catch (error) {
    console.error('Error creating interaction:', error);
    throw error;
  }
};

export const updateInteraction = async (id, { text }) => {
  try {
    console.log('Updating interaction:', id, text);
    const { data } = await api.patch(`/interactions/${id}`, { content: text });
    console.log('Interaction updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating interaction:', error);
    throw error;
  }
};

export const deleteInteraction = async (id) => {
  try {
    console.log('Deleting interaction:', id);
    const { data } = await api.delete(`/interactions/${id}`);
    console.log('Interaction deleted:', data);
    return data;
  } catch (error) {
    console.error('Error deleting interaction:', error);
    throw error;
  }
};

export const fetchSearchResults = async (searchQuery) => {
  try {
    const response  = await api.post('/api/search', {
      query: searchQuery,
      match_count: 5
    });
    const data = await response.data;
    return data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export default api;
