import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user ID - REQUIRED for security
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to access flashcards'
      });
    }

    const { category, search } = req.query;

    let query = 'SELECT * FROM flashcards WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (category && category !== '') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search && search !== '') {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await sql.query(query, params);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Flashcards list error:', error);
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
