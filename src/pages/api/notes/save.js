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

    const { title, content, subject, chapter, difficulty, noteType, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    // Calculate word count
    const wordCount = content.trim().split(/\s+/).length;

    // Create the notes table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        subject TEXT DEFAULT '',
        chapter TEXT DEFAULT '',
        difficulty TEXT DEFAULT 'medium',
        note_type TEXT DEFAULT 'general',
        tags TEXT[] DEFAULT '{}',
        word_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index for user_id if it doesn't exist
    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)
    `;

    // Insert the note
    const result = await sql`
      INSERT INTO notes (user_id, title, content, subject, chapter, difficulty, note_type, tags, word_count)
      VALUES (${userId}, ${title}, ${content}, ${subject || ''}, ${chapter || ''}, ${difficulty || 'medium'}, ${noteType || 'general'}, ${tags || []}, ${wordCount})
      RETURNING id, title, subject, chapter, difficulty, note_type, word_count, created_at
    `;

    const savedNote = result.rows[0];

    res.status(201).json({ 
      success: true, 
      message: 'Note saved successfully',
      note: savedNote
    });

  } catch (error) {
    console.error('Error saving note:', error);
    
    res.status(500).json({ 
      error: 'Failed to save note',
      details: error.message 
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
