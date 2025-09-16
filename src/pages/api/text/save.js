const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  try {
    // Set proper headers for JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get authenticated user ID - REQUIRED for security
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to save notes'
      });
    }

    const { text, title, summary, subject, chapter, difficulty, noteType } = req.body;
    
    if (!text || !subject) {
      return res.status(400).json({ error: 'Missing required fields: text, subject' });
    }

    // Insert note into database
    const result = await sql`
      INSERT INTO notes (
        title, content, summary, subject, chapter, difficulty, note_type, word_count, user_id, created_at
      ) VALUES (
        ${title || 'Text Notes'}, ${text}, ${summary || ''}, 
        ${subject}, ${chapter || ''}, ${difficulty || 'medium'}, 
        ${noteType || 'general'}, ${text.split(/\s+/).length}, ${userId}, NOW()
      ) RETURNING id
    `;

    const noteId = result.rows[0].id;

    res.status(200).json({ 
      success: true, 
      noteId,
      message: `Notes saved successfully to ${subject}` 
    });

  } catch (error) {
    console.error('Error saving note:', error);
    
    // Handle specific database errors
    if (error.message.includes('relation "notes" does not exist')) {
      return res.status(500).json({ 
        error: 'Database table not found. Please run database setup first.',
        details: 'The notes table needs to be created.'
      });
    }

    res.status(500).json({ 
      error: 'Failed to save note',
      details: error.message 
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);