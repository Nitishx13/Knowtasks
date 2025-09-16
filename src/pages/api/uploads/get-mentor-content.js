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
        message: 'User must be authenticated to access mentor content'
      });
    }

    const { type } = req.query;

    let query;
    if (type && ['formula', 'flashcard', 'pyq', 'notes'].includes(type)) {
      query = sql`
        SELECT id, title, description, category, subject, type, year, exam_type,
               file_name, file_size, created_at
        FROM mentor_uploads 
        WHERE type = ${type} AND user_id = ${userId}
        ORDER BY created_at DESC
      `;
    } else {
      query = sql`
        SELECT id, title, description, category, subject, type, year, exam_type,
               file_name, file_size, created_at
        FROM mentor_uploads 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
    }

    const result = await query;

    // Ensure result and rows exist to prevent undefined errors
    const rows = result && result.rows ? result.rows : [];

    return res.status(200).json({
      success: true,
      content: rows,
      uploads: rows,
      count: rows.length
    });

  } catch (error) {
    console.error('Get uploads error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch uploads',
      details: error.message 
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
