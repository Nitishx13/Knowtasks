import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

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

  const { name, email, password, subject, phone, bio, specialization, experience } = req.body;

  // Validate required fields
  if (!name || !email || !password || !subject) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['name', 'email', 'password', 'subject']
    });
  }

  try {
    // Check if mentor already exists
    const existingMentor = await sql`
      SELECT id FROM mentor_users WHERE email = ${email}
    `;

    if (existingMentor.rows.length > 0) {
      return res.status(409).json({ error: 'Mentor with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create mentor
    const result = await sql`
      INSERT INTO mentor_users (
        name, email, password_hash, subject, phone, bio, 
        specialization, experience, role, status, created_at
      ) VALUES (
        ${name}, ${email}, ${hashedPassword}, ${subject}, 
        ${phone || null}, ${bio || null}, ${specialization || null}, 
        ${experience || 0}, 'mentor', 'active', CURRENT_TIMESTAMP
      ) RETURNING id, name, email, subject, phone, bio, specialization, experience, status, created_at
    `;

    const mentor = result.rows[0];

    // Create mentor profile table entry
    await sql`
      INSERT INTO mentor_profiles (
        mentor_id, total_students, total_uploads, total_sessions, 
        rating, created_at
      ) VALUES (
        ${mentor.id}, 0, 0, 0, 0.0, CURRENT_TIMESTAMP
      )
    `;

    res.status(201).json({
      success: true,
      message: 'Mentor created successfully',
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
        created_at: mentor.created_at
      }
    });

  } catch (error) {
    console.error('Mentor creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create mentor',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
