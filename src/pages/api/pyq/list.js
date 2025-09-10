import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, search, year, examType } = req.query;

    let query = 'SELECT * FROM pyq WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category && category !== '') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (year && year !== '') {
      query += ` AND year = $${paramIndex}`;
      params.push(year);
      paramIndex++;
    }

    if (examType && examType !== '') {
      query += ` AND exam_type = $${paramIndex}`;
      params.push(examType);
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
    console.error('PYQ list error:', error);
    res.status(500).json({ error: 'Failed to fetch PYQ' });
  }
}
