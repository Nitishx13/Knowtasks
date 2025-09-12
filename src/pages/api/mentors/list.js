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
    // Get all mentors with their profile data and student counts
    const result = await sql`
      SELECT 
        m.id, m.name, m.email, m.subject, m.phone, m.bio, 
        m.specialization, m.experience, m.status, m.created_at, m.last_login,
        mp.total_students, mp.total_uploads, mp.total_sessions, mp.rating,
        COUNT(s.id) as active_students
      FROM mentor_users m
      LEFT JOIN mentor_profiles mp ON m.id = mp.mentor_id
      LEFT JOIN students s ON m.id = s.mentor_id
      GROUP BY m.id, m.name, m.email, m.subject, m.phone, m.bio, 
               m.specialization, m.experience, m.status, m.created_at, m.last_login,
               mp.total_students, mp.total_uploads, mp.total_sessions, mp.rating
      ORDER BY m.created_at DESC
    `;

    const mentors = result.rows.map(mentor => ({
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      subject: mentor.subject,
      phone: mentor.phone,
      bio: mentor.bio,
      specialization: mentor.specialization,
      experience: mentor.experience,
      status: mentor.status,
      created_at: mentor.created_at,
      last_login: mentor.last_login,
      profile: {
        total_students: mentor.total_students || 0,
        active_students: mentor.active_students || 0,
        total_uploads: mentor.total_uploads || 0,
        total_sessions: mentor.total_sessions || 0,
        rating: mentor.rating || 0.0
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
