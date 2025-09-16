import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name, subject } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if mentor already exists in mentor_users
    const existingMentor = await sql`
      SELECT id, email, status FROM mentor_users 
      WHERE email = ${email.toLowerCase().trim()}
    `;

    if (existingMentor.rows.length > 0) {
      const mentor = existingMentor.rows[0];
      
      // Update password for existing mentor
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = `MENTOR_${mentor.id}_${Date.now().toString().slice(-6)}`;
      
      await sql`
        UPDATE mentor_users
        SET 
          password_hash = ${passwordHash},
          user_id = ${userId},
          status = 'active',
          verified = true,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${mentor.id}
      `;

      return res.status(200).json({
        success: true,
        message: 'Mentor account updated successfully',
        mentor: {
          id: mentor.id,
          email: email,
          status: 'active'
        }
      });
    }

    // Create new mentor if doesn't exist
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `MENTOR_${Date.now().toString().slice(-6)}`;

    const result = await sql`
      INSERT INTO mentor_users (
        name, email, password_hash, user_id, subject, role, status, verified, created_at, updated_at
      ) VALUES (
        ${name || 'Mentor'}, 
        ${email.toLowerCase().trim()}, 
        ${passwordHash}, 
        ${userId}, 
        ${subject || 'General'}, 
        'mentor', 
        'active', 
        true, 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      ) RETURNING id, email, name
    `;

    return res.status(201).json({
      success: true,
      message: 'Mentor account created successfully',
      mentor: result.rows[0]
    });

  } catch (error) {
    console.error('Error setting up mentor:', error);
    return res.status(500).json({ 
      error: 'Failed to setup mentor account',
      details: error.message 
    });
  }
}
