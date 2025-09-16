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
    
    console.log('Formula save API - User ID:', userId);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to save formulas'
      });
    }

    const { name, formula, description, applications, subject, chapter, difficulty } = req.body;
    
    console.log('Formula save data:', { name, formula, subject, userId });

    if (!name || !formula || !subject) {
      return res.status(400).json({ error: 'Missing required fields: name, formula, subject' });
    }

    // Insert formula into database
    const result = await sql`
      INSERT INTO formulas (
        name, formula, description, applications, subject, chapter, difficulty, user_id, created_at
      ) VALUES (
        ${name}, ${formula}, ${description || ''}, ${applications || ''}, 
        ${subject}, ${chapter || ''}, ${difficulty || 'medium'}, ${userId}, NOW()
      ) RETURNING id
    `;

    const formulaId = result.rows[0].id;

    res.status(200).json({ 
      success: true, 
      formulaId,
      message: `Formula "${name}" saved successfully to ${subject} bank` 
    });

  } catch (error) {
    console.error('Error saving formula:', error);
    
    // Handle specific database errors
    if (error.message.includes('relation "formulas" does not exist')) {
      return res.status(500).json({ 
        error: 'Database table not found. Please run database setup first.',
        details: 'The formulas table needs to be created.'
      });
    }

    res.status(500).json({ 
      error: 'Failed to save formula',
      details: error.message 
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
