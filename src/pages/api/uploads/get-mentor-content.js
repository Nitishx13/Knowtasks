import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;

    let query;
    if (type && ['formula', 'flashcard', 'pyq'].includes(type)) {
      query = sql`
        SELECT id, title, description, category, subject, type, year, exam_type,
               file_name, file_size, created_at
        FROM mentor_uploads 
        WHERE type = ${type}
        ORDER BY created_at DESC
      `;
    } else {
      query = sql`
        SELECT id, title, description, category, subject, type, year, exam_type,
               file_name, file_size, created_at
        FROM mentor_uploads 
        ORDER BY created_at DESC
      `;
    }

    const result = await query;

    return res.status(200).json({
      success: true,
      uploads: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get uploads error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch uploads',
      details: error.message 
    });
  }
}
