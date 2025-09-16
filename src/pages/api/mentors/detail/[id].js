import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Mentor ID is required' });
  }

  try {
    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection error: POSTGRES_URL not found');
      return res.status(500).json({ 
        error: 'Database configuration error',
        success: false
      });
    }

    // Get mentor details
    const result = await sql`
      SELECT 
        id, name, email, subject, phone, bio, 
        specialization, experience, status, created_at, last_login, verified, user_id, role
      FROM mentor_users
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Mentor not found',
        success: false
      });
    }

    const mentor = result.rows[0];

    res.status(200).json({
      success: true,
      mentor: {
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        subject: mentor.subject,
        phone: mentor.phone,
        bio: mentor.bio,
        specialization: mentor.specialization,
        experience: mentor.experience,
        status: mentor.status,
        verified: mentor.verified || false,
        created_at: mentor.created_at,
        last_login: mentor.last_login,
        user_id: mentor.user_id,
        role: mentor.role
      }
    });

  } catch (error) {
    console.error('Mentor detail error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch mentor details',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false
    });
  }
}
