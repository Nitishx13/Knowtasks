// API service for making requests to the backend

const API_BASE_URL = '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API calls
export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Summarization API calls
export const summarizeService = {
  // Upload and summarize PDF
  uploadAndSummarize: async (fileUrl, fileName) => {
    const response = await fetch(`${API_BASE_URL}/summarize/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl, fileName }),
    });
    return response.json();
  },

  // Get user's summaries
  getUserSummaries: async () => {
    const response = await fetch(`${API_BASE_URL}/summarize/list`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  // Legacy methods for backward compatibility
  summarizeText: async (text) => {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type: 'text' }),
    });
    return response.json();
  },

  summarizeVideo: async (url) => {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, type: 'video' }),
    });
    return response.json();
  },

  summarizeFile: async (file) => {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, type: 'file' }),
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