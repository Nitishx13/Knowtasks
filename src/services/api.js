// API service for making requests to the backend

const API_BASE_URL = '/api';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  // Clerk handles authentication headers automatically for API routes
  return {
    'Content-Type': 'application/json',
  };
};

// Summarization API calls
export const summarizeService = {
  // Upload and summarize PDF
  uploadAndSummarize: async (fileUrl, fileName) => {
    const response = await fetch(`${API_BASE_URL}/summarize/upload`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ fileUrl, fileName }),
    });
    return response.json();
  },

  // Get all summaries for the current user
  getSummaries: async () => {
    const response = await fetch(`${API_BASE_URL}/summarize/list`, {
      headers: await getAuthHeaders(),
    });
    return response.json();
  },

  // Get a specific summary by ID
  getSummaryById: async (summaryId) => {
    const response = await fetch(`${API_BASE_URL}/summarize/${summaryId}`, {
      headers: await getAuthHeaders(),
    });
    return response.json();
  },
};

// User profile service
export const profileService = {
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  // Update notification preferences
  updateNotifications: async (notificationPreferences) => {
    const response = await fetch(`${API_BASE_URL}/profile/notifications`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(notificationPreferences),
    });
    return response.json();
  },
};

// Notes API calls
export const notesService = {
  getNotes: async () => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  createNote: async (noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData),
    });
    return response.json();
  },

  updateNote: async (id, noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData),
    });
    return response.json();
  },

  deleteNote: async (id) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};