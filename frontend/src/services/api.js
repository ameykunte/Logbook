import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// Attach token to each request
api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('access_token');
  const googleCredentials = localStorage.getItem('googleCredentials');
  
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  
  if (googleCredentials && config.url.includes('/calendar')) {
    config.headers['Google-Credentials'] = googleCredentials;
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
// Add calendar related API calls
export const createCalendarEvent = async (eventDetails) => {
  try {
    const { data } = await api.post('/api/calendar/events', eventDetails);
    return data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Calendar Event Extraction
export const extractEventsFromInteraction = async (interactionText, relationId, interactionDate) => {
  try {
    console.log('Extracting events with context:', { 
      interactionText, 
      relationId,
      interactionDate 
    });
    
    const response = await api.post('/api/calendar/extract-events', {
      interaction_text: interactionText,
      relationship_id: relationId,
      interaction_date: interactionDate
    });
    
    return response.data.events;
  } catch (error) {
    console.error('Error extracting events:', error);
    throw error;
  }
};

export const addExtractedEventToCalendar = async (event) => {
  try {
    const { data } = await api.post('/api/calendar/add-extracted-event', event);
    return data;
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    throw error;
  }
};

// Fetch all interactions from today for all relationships
export const fetchAllInteractionsForToday = async () => {
  try {

    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Fetch all relationships first
    const relationships = await fetchRelations();
    
    // For each relationship, fetch today's interactions
    const allInteractionsPromises = relationships.map(async (relationship) => {
      console.log('Fetching interactions for relationship:', relationship.name);
      const { data } = await api.get(`/relations/${relationship.relationship_id}/interactions`);      
      console.log('Fetched interactions:', data);
      
      const interactions = data;
      
      // Filter to get only today's interactions
      return interactions.filter(interaction => {
        const interactionDate = new Date(interaction.date);
        return interactionDate >= today;
      })
      .map(interaction => ({
        ...interaction,
        relationName: relationship.name,
        relationCategory: relationship.category_type
      }));
    });
    
    // Combine all interactions from all relationships
    const allInteractionsArrays = await Promise.all(allInteractionsPromises);
    return allInteractionsArrays.flat();
    
  } catch (error) {
    console.error('Error fetching today\'s interactions:', error);
    throw error;
  }
};

// Send all today's interactions to Gemini for summarization
export const summarizeDailyInteractions = async (interactions) => {
  try {
    // Send the structured interactions data in JSON format
    console.log('Sending interactions for summarization:', interactions);
    const { data } = await api.post('/summarize/daily', { interactions });
    return data.summary;
  } catch (error) {
    console.error('Error summarizing daily interactions:', error);
    throw error;
  }
};

export default api;