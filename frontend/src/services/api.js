import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// Attach token to each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

// Relations CRUD
export const fetchRelations = async () => {
  const { data } = await api.get('/relations');
  return data;
};

export const createRelation = async (relation) => {
  const { data } = await api.post('/relations', relation);
  return data;
};

export const updateRelation = async (id, relation) => {
  const { data } = await api.put(`/relations/${id}`, relation);
  return data;
};

export const deleteRelation = async (id) => {
  const { data } = await api.delete(`/relations/${id}`);
  return data;
};

// Interactions CRUD
export const fetchInteractions = async (relationId) => {
  const { data } = await api.get(`/relations/${relationId}/interactions`);
  return data;
};

export const createInteraction = async (relationId, interaction) => {
  const { data } = await api.post(`/relations/${relationId}/interactions`, interaction);
  return data;
};

export const updateInteraction = async (id, interaction) => {
  const { data } = await api.put(`/interactions/${id}`, interaction);
  return data;
};

export const deleteInteraction = async (id) => {
  const { data } = await api.delete(`/interactions/${id}`);
  return data;
};

export const fetchHelloMessage = async () => {
  const { data } = await api.get('/hello');
  return data;
};

export default api;
