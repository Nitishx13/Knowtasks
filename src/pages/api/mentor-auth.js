import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    // Query mentor from database
    const result = await sql`
      SELECT id, name, email, password_hash, subject, role, status, verified, last_login, created_at
      FROM mentor_users 
      WHERE email = ${email.toLowerCase().trim()} AND status = 'active' AND verified = true
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const mentor = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, mentor.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login timestamp
    try {
      await sql`
        UPDATE mentor_users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ${mentor.id}
      `;
    } catch (updateError) {
      console.warn('Failed to update last login:', updateError);
    }

    // Prepare mentor data (exclude password hash)
    const mentorData = {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      subject: mentor.subject,
      role: mentor.role,
      status: mentor.status,
      verified: mentor.verified,
      last_login: new Date().toISOString(),
      created_at: mentor.created_at
    };

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      mentor: mentorData
    });

  } catch (error) {
    console.error('Mentor login error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
}
