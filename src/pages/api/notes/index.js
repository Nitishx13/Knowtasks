// Next.js API route for notes

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route based on HTTP method
  switch (req.method) {
    case 'GET':
      return getNotes(req, res);
    case 'POST':
      return createNote(req, res);
    case 'PUT':
      return updateNote(req, res);
    case 'DELETE':
      return deleteNote(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get all notes or a specific note
function getNotes(req, res) {
  try {
    const { id } = req.query;
    
    // Mock data - in production, fetch from a database
    const mockNotes = [
      { id: '1', title: 'Machine Learning Basics', content: 'This is a summary of machine learning basics...', date: '2023-05-15' },
      { id: '2', title: 'Introduction to React', content: 'React is a JavaScript library for building user interfaces...', date: '2023-05-14' },
      { id: '3', title: 'Advanced CSS Techniques', content: 'CSS Grid and Flexbox are powerful layout systems...', date: '2023-05-13' }
    ];
    
    if (id) {
      const note = mockNotes.find(note => note.id === id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      return res.status(200).json({ success: true, note });
    }
    
    return res.status(200).json({ success: true, notes: mockNotes });
  } catch (error) {
    console.error('Get notes error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Create a new note
function createNote(req, res) {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }
    
    // Mock creation - in production, save to a database
    const newNote = {
      id: Date.now().toString(), // Generate a unique ID
      title,
      content,
      date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };
    
    return res.status(201).json({
      success: true,
      note: newNote
    });
  } catch (error) {
    console.error('Create note error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Update an existing note
function updateNote(req, res) {
  try {
    const { id } = req.query;
    const { title, content } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }
    
    // Mock update - in production, update in a database
    // For demo purposes, we'll just return success
    return res.status(200).json({
      success: true,
      note: {
        id,
        title: title || 'Updated Note',
        content: content || 'Updated content...',
        date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
      }
    });
  } catch (error) {
    console.error('Update note error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a note
function deleteNote(req, res) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }
    
    // Mock deletion - in production, delete from a database
    // For demo purposes, we'll just return success
    return res.status(200).json({
      success: true,
      message: `Note ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}