import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// Attach token to each request
api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('access_token');
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  console.log("Request headers:", config.headers); // Debug statement
  return config;
});

// Auth
export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  localStorage.setItem('access_token', data.access_token); // Save access_token
  return data;
};

// Relations CRUD
export const fetchRelations = async () => {
  try {
    const { data } = await api.get('/relations'); // Fetch all relations
    return data;
  } catch (error) {
    console.error('Error fetching relations:', error);
    throw error;
  }
};

export const createRelation = async (relation) => {
  try {
    console.log('Creating relation:', relation); // Debugging line
    const { data } = await api.post('/relations/add', relation); // Add a new relation
    return data;
  } catch (error) {
    console.error('Error creating relation:', error);
    throw error;
  }
};

export const updateRelation = async (id, relation) => {
  try {
    const { data } = await api.put(`/relations/${id}`, relation); // Update an existing relation
    return data;
  } catch (error) {
    console.error('Error updating relation:', error);
    throw error;
  }
};

export const deleteRelation = async (id) => {
  try {
    const { data } = await api.delete(`/relations/${id}`); // Delete a relation
    return data;
  } catch (error) {
    console.error('Error deleting relation:', error);
    throw error;
  }
};

// Interactions CRUD
export const fetchInteractions = async (relationId) => {
  try {
    const { data } = await api.get(`/relations/${relationId}/interactions`);
    return data;
  } catch (error) {
    console.error('Error fetching interactions:', error);
    throw error;
  }
};

export const createInteraction = async (relationId, interaction) => {
  try {
    const { data } = await api.post(`/relations/${relationId}/interactions`, interaction);
    return data;
  } catch (error) {
    console.error('Error creating interaction:', error);
    throw error;
  }
};

export const updateInteraction = async (id, interaction) => {
  try {
    console.log('Updating interaction:', interaction); // Debugging line
    const { data } = await api.patch(`/interactions/${id}`, interaction);
    return data;
  } catch (error) {
    console.error('Error updating interaction:', error);
    throw error;
  }
};

export const deleteInteraction = async (id) => {
  try {
    const { data } = await api.delete(`/interactions/${id}`);
    return data;
  } catch (error) {
    console.error('Error deleting interaction:', error);
    throw error;
  }
};
export const summarizeText = async (text) => {
  try {
    const formData = new FormData();
    formData.append('text', text);
    
    const response = await api.post('/summarize/text', formData);
    return response.data.summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};

export const summarizeFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/summarize/file', formData);
    return response.data.summary;
  } catch (error) {
    console.error('Error summarizing file:', error);
    throw error;
  }

};

export const fetchSearchResults = async (searchQuery, searchType) => {
  try {
    const response  = await api.post('/api/search', {
      query: searchQuery,
      search_type: searchType,
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