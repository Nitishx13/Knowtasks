import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
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

    // Check if mentor exists
    const mentorResult = await sql`
      SELECT id, name, email, user_id
      FROM mentor_users
      WHERE id = ${id}
    `;

    if (mentorResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Mentor not found',
        success: false
      });
    }

    const mentor = mentorResult.rows[0];

    // Generate new password
    const newPassword = generateRandomPassword();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Generate user ID if not exists
    let userId = mentor.user_id;
    if (!userId) {
      userId = `MENTOR_${mentor.id}_${Date.now().toString().slice(-6)}`;
    }

    // Update mentor with new password and user ID
    await sql`
      UPDATE mentor_users
      SET 
        password_hash = ${passwordHash},
        user_id = ${userId},
        status = 'active',
        verified = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    res.status(200).json({
      success: true,
      password: newPassword,
      user_id: userId,
      message: 'New password generated successfully'
    });

  } catch (error) {
    console.error('Generate password error:', error);
    res.status(500).json({ 
      error: 'Failed to generate new password',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false
    });
  }
}

function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
