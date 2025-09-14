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
        message: 'User must be authenticated to access formula bank'
      });
    }

    const { category, subject, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT id, title, description, file_name, file_url, file_size,
             category, subject, uploaded_by, uploader_role, tags,
             download_count, created_at, updated_at
      FROM formula_bank 
      WHERE status = 'active' AND user_id = $1
    `;
    
    const params = [userId];
    let paramCount = 1;

    if (category && category !== 'all') {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (subject && subject !== 'all') {
      paramCount++;
      query += ` AND subject = $${paramCount}`;
      params.push(subject);
    }

    if (search) {
      paramCount++;
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount} OR array_to_string(tags, ' ') ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(parseInt(offset));

    const result = await sql.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM formula_bank WHERE status = 'active' AND user_id = $1`;
    const countParams = [userId];
    let countParamCount = 1;

    if (category && category !== 'all') {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }

    if (subject && subject !== 'all') {
      countParamCount++;
      countQuery += ` AND subject = $${countParamCount}`;
      countParams.push(subject);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (title ILIKE $${countParamCount} OR description ILIKE $${countParamCount} OR array_to_string(tags, ' ') ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await sql.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < totalCount
      }
    });

  } catch (error) {
    console.error('List formula bank error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Formula Bank items',
      details: error.message 
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
