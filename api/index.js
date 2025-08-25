// Main API entry point for Vercel serverless functions

export default function handler(req, res) {
  const { method } = req;

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route to appropriate handler based on path
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (pathname.startsWith('/api/auth')) {
      return handleAuth(req, res);
    } else if (pathname.startsWith('/api/summarize')) {
      return handleSummarize(req, res);
    } else if (pathname.startsWith('/api/notes')) {
      return handleNotes(req, res);
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Authentication handler
function handleAuth(req, res) {
  const { method } = req;
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Login endpoint
  if (pathname === '/api/auth/login' && method === 'POST') {
    const { email, password } = req.body;
    
    // Mock authentication - in production, validate against a real database
    if (email === 'user@example.com' && password === 'password') {
      return res.status(200).json({
        success: true,
        user: {
          id: '123',
          email: 'user@example.com',
          name: 'Demo User'
        },
        token: 'mock-jwt-token'
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }
  
  // Register endpoint
  if (pathname === '/api/auth/register' && method === 'POST') {
    const { email, password, name } = req.body;
    
    // Mock registration - in production, save to a real database
    return res.status(201).json({
      success: true,
      user: {
        id: '123',
        email,
        name
      },
      token: 'mock-jwt-token'
    });
  }
  
  // Google auth endpoint
  if (pathname === '/api/auth/google' && method === 'POST') {
    // Mock Google auth - in production, validate Google token
    return res.status(200).json({
      success: true,
      user: {
        id: 'google-123',
        email: 'google-user@example.com',
        name: 'Google User'
      },
      token: 'mock-jwt-token'
    });
  }
  
  return res.status(404).json({ error: 'Auth endpoint not found' });
}

// Summarization handler
function handleSummarize(req, res) {
  const { method } = req;
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Text summarization endpoint
  if (pathname === '/api/summarize/text' && method === 'POST') {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Mock summarization - in production, use a real AI service
    const summary = {
      title: 'Text Summary',
      content: `This is a summary of the provided text. The original text was ${text.length} characters long.`,
      keyPoints: [
        'First key point from the summarized content',
        'Second important concept explained in detail',
        'Third significant finding or conclusion',
        'Fourth notable element from the content'
      ],
      wordCount: Math.floor(text.length / 5), // Rough estimate
      readTime: `${Math.max(1, Math.floor(text.length / 1000))} min`,
      date: new Date().toISOString()
    };
    
    return res.status(200).json({ success: true, summary });
  }
  
  // Video summarization endpoint
  if (pathname === '/api/summarize/video' && method === 'POST') {
    const { url } = req.body;
    
    if (!url || url.trim().length === 0) {
      return res.status(400).json({ error: 'Video URL is required' });
    }
    
    // Mock video summarization
    const summary = {
      title: 'Video Summary',
      content: `This is a summary of the video at ${url}.`,
      keyPoints: [
        'First key point from the video',
        'Second important concept from the video',
        'Third significant finding from the video',
        'Fourth notable element from the video'
      ],
      wordCount: 150,
      readTime: '2 min',
      date: new Date().toISOString()
    };
    
    return res.status(200).json({ success: true, summary });
  }
  
  // File summarization endpoint
  if (pathname === '/api/summarize/file' && method === 'POST') {
    // In a real implementation, handle file upload and processing
    // For this mock, we'll just return a sample response
    
    const summary = {
      title: 'Document Summary',
      content: 'This is a summary of the uploaded document.',
      keyPoints: [
        'First key point from the document',
        'Second important concept from the document',
        'Third significant finding from the document',
        'Fourth notable element from the document'
      ],
      wordCount: 200,
      readTime: '3 min',
      date: new Date().toISOString()
    };
    
    return res.status(200).json({ success: true, summary });
  }
  
  return res.status(404).json({ error: 'Summarize endpoint not found' });
}

// Notes handler
function handleNotes(req, res) {
  const { method } = req;
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Get all notes
  if (pathname === '/api/notes' && method === 'GET') {
    // Mock notes data
    const notes = [
      { id: 1, title: 'Meeting Notes', content: 'Discuss project timeline and deliverables with the team.', date: '2023-08-21' },
      { id: 2, title: 'Shopping List', content: 'Milk, eggs, bread, fruits, vegetables', date: '2023-08-20' },
      { id: 3, title: 'Ideas', content: 'New app feature: dark mode, search functionality', date: '2023-08-19' },
    ];
    
    return res.status(200).json({ success: true, notes });
  }
  
  // Create a new note
  if (pathname === '/api/notes' && method === 'POST') {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // Mock creating a new note
    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString().split('T')[0]
    };
    
    return res.status(201).json({ success: true, note: newNote });
  }
  
  // Get, update or delete a specific note
  const noteIdMatch = pathname.match(/\/api\/notes\/(\d+)/);
  if (noteIdMatch) {
    const noteId = parseInt(noteIdMatch[1]);
    
    // Mock note data
    const mockNote = {
      id: noteId,
      title: 'Sample Note',
      content: 'This is a sample note content.',
      date: '2023-08-21'
    };
    
    // Get a specific note
    if (method === 'GET') {
      return res.status(200).json({ success: true, note: mockNote });
    }
    
    // Update a note
    if (method === 'PUT') {
      const { title, content } = req.body;
      
      if (!title && !content) {
        return res.status(400).json({ error: 'Title or content is required' });
      }
      
      // Mock updating the note
      const updatedNote = {
        ...mockNote,
        title: title || mockNote.title,
        content: content || mockNote.content,
        date: new Date().toISOString().split('T')[0]
      };
      
      return res.status(200).json({ success: true, note: updatedNote });
    }
    
    // Delete a note
    if (method === 'DELETE') {
      return res.status(200).json({ success: true, message: `Note ${noteId} deleted successfully` });
    }
  }
  
  return res.status(404).json({ error: 'Notes endpoint not found' });
}