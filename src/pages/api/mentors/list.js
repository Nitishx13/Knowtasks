import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection error: POSTGRES_URL not found');
      return res.status(500).json({ 
        error: 'Database configuration error',
        success: false,
        mentors: []
      });
    }

    // Get mentors from mentor_applications table (pending applications)
    let result;
    try {
      result = await sql`
        SELECT 
          id, name, email, subject, phone, bio, 
          experience, status, created_at, verified
        FROM mentor_applications
        ORDER BY created_at DESC
      `;
    } catch (dbError) {
      console.error('Database query error:', dbError);
      // Return empty array if table doesn't exist
      return res.status(200).json({
        success: true,
        mentors: [],
        total: 0,
        message: 'No mentor applications found'
      });
    }

    const mentors = result.rows.map(mentor => ({
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      subject: mentor.subject,
      phone: mentor.phone,
      bio: mentor.bio,
      experience: mentor.experience,
      status: mentor.status || 'pending',
      verified: mentor.verified || false,
      created_at: mentor.created_at,
      last_login: null,
      profile: {
        total_students: 0,
        active_students: 0,
        total_uploads: 0,
        total_sessions: 0,
        rating: 0.0
      }
    }));

    res.status(200).json({
      success: true,
      mentors: mentors,
      total: mentors.length
    });

  } catch (error) {
    console.error('Mentor list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch mentors',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
