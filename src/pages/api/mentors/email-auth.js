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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Get mentor with profile data - only active mentors can use email-only authentication
    const result = await sql`
      SELECT 
        m.id, m.name, m.email, m.subject, m.phone, 
        m.bio, m.specialization, m.experience, m.status, m.created_at,
        mp.total_students, mp.total_uploads, mp.total_sessions, mp.rating
      FROM mentor_users m
      LEFT JOIN mentor_profiles mp ON m.id = mp.mentor_id
      WHERE m.email = ${email.toLowerCase().trim()} 
        AND m.status = 'active'
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'No active mentor found with this email' 
      });
    }

    const mentor = result.rows[0];

    // Update last login
    await sql`
      UPDATE mentor_users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${mentor.id}
    `;

    // Get mentor's students data
    const studentsResult = await sql`
      SELECT 
        s.id, s.name, s.email, s.created_at,
        COUNT(su.id) as total_summaries,
        COUNT(n.id) as total_notes
      FROM students s
      LEFT JOIN summaries su ON s.id = su.user_id
      LEFT JOIN notes n ON s.id = n.user_id
      WHERE s.mentor_id = ${mentor.id}
      GROUP BY s.id, s.name, s.email, s.created_at
      ORDER BY s.created_at DESC
    `;

    // Get mentor's content statistics
    const contentStats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM formula_bank WHERE uploaded_by = ${mentor.email}) as formula_count,
        (SELECT COUNT(*) FROM flashcards WHERE uploaded_by = ${mentor.email}) as flashcard_count,
        (SELECT COUNT(*) FROM pyq WHERE uploaded_by = ${mentor.email}) as pyq_count
    `;

    const mentorData = {
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
      profile: {
        total_students: mentor.total_students || 0,
        total_uploads: mentor.total_uploads || 0,
        total_sessions: mentor.total_sessions || 0,
        rating: mentor.rating || 0.0
      },
      students: studentsResult.rows,
      content_stats: contentStats.rows[0] || { formula_count: 0, flashcard_count: 0, pyq_count: 0 }
    };

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      mentor: mentorData
    });

  } catch (error) {
    console.error('Mentor email authentication error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}