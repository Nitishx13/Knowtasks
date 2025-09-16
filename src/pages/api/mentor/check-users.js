import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch all mentor users from the database
    const result = await sql`
      SELECT id, email, name, experience, subjects, created_at 
      FROM mentor_users 
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      success: true,
      mentors: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch mentor users',
      details: error.message 
    });
  }
}
