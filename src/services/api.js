// API service for making requests to the backend

const API_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.error || response.statusText;
    return Promise.reject(error);
  }
  
  return data;
};

// Authentication services
export const authService = {
  // Login with email and password
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    return handleResponse(response);
  },
  
  // Register a new user
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    return handleResponse(response);
  },
  
  // Login with Google
  googleLogin: async (token) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    return handleResponse(response);
  },
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};

// Summarization services
export const summarizeService = {
  // Summarize text
  summarizeText: async (text) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/summarize/text`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    
    return handleResponse(response);
  },
  
  // Summarize video
  summarizeVideo: async (url) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/summarize/video`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url })
    });
    
    return handleResponse(response);
  },
  
  // Summarize file
  summarizeFile: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/summarize/file`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return handleResponse(response);
  }
};

// Notes services
export const notesService = {
  // Get all notes
  getNotes: async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/notes`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },
  
  // Get a specific note
  getNote: async (id) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  },
  
  // Create a new note
  createNote: async (title, content) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });
    
    return handleResponse(response);
  },
  
  // Update a note
  updateNote: async (id, title, content) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    });
    
    return handleResponse(response);
  },
  
  // Delete a note
  deleteNote: async (id) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  }
};