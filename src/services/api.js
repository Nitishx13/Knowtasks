// API service for making requests to the backend

const API_BASE_URL = '/api';

// Helper function to get auth headers
const getAuthHeaders = async (userId) => {
  // Clerk handles authentication headers automatically for API routes
  return {
    'Content-Type': 'application/json',
    'user-id': userId || '',
  };
};



// User profile service
export const profileService = {
  // Update user profile
  updateProfile: async (profileData, userId) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: await getAuthHeaders(userId),
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  // Update notification preferences
  updateNotifications: async (notificationPreferences, userId) => {
    const response = await fetch(`${API_BASE_URL}/profile/notifications`, {
      method: 'PUT',
      headers: await getAuthHeaders(userId),
      body: JSON.stringify(notificationPreferences),
    });
    return response.json();
  },
};

// Notes API calls
export const notesService = {
  getNotes: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: await getAuthHeaders(userId),
    });
    return response.json();
  },

  createNote: async (noteData, userId) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: await getAuthHeaders(userId),
      body: JSON.stringify(noteData),
    });
    return response.json();
  },

  updateNote: async (id, noteData, userId) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(userId),
      body: JSON.stringify(noteData),
    });
    return response.json();
  },

  deleteNote: async (id, userId) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(userId),
    });
    return response.json();
  },
};