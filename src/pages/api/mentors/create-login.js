import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mentorId, email, password } = req.body;

  if (!mentorId || !email || !password) {
    return res.status(400).json({ 
      error: 'Missing required fields: mentorId, email, password' 
    });
  }

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `MENTOR_${Date.now().toString().slice(-6)}`;

    // Get mentor application details
    const mentorApp = await sql`
      SELECT name, subject, phone, experience, bio
      FROM mentor_applications
      WHERE id = ${mentorId}
    `;

    if (mentorApp.rows.length === 0) {
      return res.status(404).json({ error: 'Mentor application not found' });
    }

    const mentor = mentorApp.rows[0];

    // Create mentor user account
    const result = await sql`
      INSERT INTO mentor_users (
        name, email, password_hash, user_id, subject, role, status, verified, 
        phone, experience, bio, created_at, updated_at
      ) VALUES (
        ${mentor.name}, 
        ${email.toLowerCase().trim()}, 
        ${passwordHash}, 
        ${userId}, 
        ${mentor.subject}, 
        'mentor', 
        'active', 
        true,
        ${mentor.phone},
        ${mentor.experience},
        ${mentor.bio},
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      ) RETURNING id, email, name, user_id
    `;

    // Update application status
    await sql`
      UPDATE mentor_applications
      SET verified = true, status = 'approved'
      WHERE id = ${mentorId}
    `;

    return res.status(201).json({
      success: true,
      message: 'Mentor login created successfully',
      mentor: result.rows[0],
      credentials: {
        email: email,
        password: password
      }
    });

  } catch (error) {
    console.error('Error creating mentor login:', error);
    return res.status(500).json({ 
      error: 'Failed to create mentor login',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
