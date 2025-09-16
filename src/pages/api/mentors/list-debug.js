import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Query all mentors from database (for debugging)
    const result = await sql`
      SELECT id, name, email, subject, role, status, verified, created_at
      FROM mentor_users 
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      mentors: result.rows
    });

  } catch (error) {
    console.error('List mentors error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Database error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
}
