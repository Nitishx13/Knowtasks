const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  try {
    // Set proper headers for JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get authenticated user ID - REQUIRED for security
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to fetch notes'
      });
    }

    // Fetch user's notes from database
    const result = await sql`
      SELECT id, title, content, summary, subject, chapter, difficulty, note_type, word_count, created_at
      FROM notes 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json({ 
      success: true, 
      notes: result.rows
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
    
    if (error.message.includes('relation "notes" does not exist')) {
      return res.status(500).json({ 
        error: 'Database table not found. Please run database setup first.',
        details: 'The notes table needs to be created.'
      });
    }

    res.status(500).json({ 
      error: 'Failed to fetch notes',
      details: error.message 
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
