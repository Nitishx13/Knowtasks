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

  const { email, password, loginType = 'email' } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email/User ID and password are required'
    });
  }

  try {
    // Ensure database connection
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection error: POSTGRES_URL not found');
      return res.status(500).json({
        success: false,
        message: 'Database configuration error'
      });
    }

    // Query mentor from database based on login type
    let result;
    if (loginType === 'userid') {
      // For user ID login, search by user_id field
      result = await sql`
        SELECT id, name, email, password_hash, subject, role, status, last_login, created_at, user_id
        FROM mentor_users 
        WHERE user_id = ${email.trim()} AND status = 'active'
      `;
    } else {
      // For email login
      result = await sql`
        SELECT id, name, email, password_hash, subject, role, status, last_login, created_at, user_id
        FROM mentor_users 
        WHERE email = ${email.toLowerCase().trim()}
      `;
    }

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const mentor = result.rows[0];

    // Check if mentor is active
    if (mentor.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please contact administrator.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, mentor.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
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
      // Continue with login even if update fails
    }

    // Prepare mentor data (exclude password hash)
    const mentorData = {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      subject: mentor.subject,
      role: mentor.role,
      status: mentor.status,
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
    
    // Return proper JSON error response
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
}
