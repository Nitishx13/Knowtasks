import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
    console.log('Login attempt for:', email);
    
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
      // For email login - also create account if doesn't exist
      result = await sql`
        SELECT id, name, email, password_hash, subject, role, status, last_login, created_at, user_id
        FROM mentor_users 
        WHERE email = ${email.toLowerCase().trim()}
      `;
      
    }

    if (result.rows.length === 0) {
      // Debug logging for specific email
      if (email === 'adarsh@gmail.com') {
        console.log('Debug: No mentor found with email adarsh@gmail.com');
        console.log('Debug: Checking if mentor exists in applications table...');
        
        // Check if mentor exists in mentor_applications table instead
        try {
          const appResult = await sql`
            SELECT id, name, email, subject, verified, status
            FROM mentor_applications 
            WHERE email = ${email.toLowerCase().trim()}
          `;
          
          if (appResult.rows.length > 0) {
            console.log('Debug: Found mentor in applications table:', appResult.rows[0]);
            return res.status(401).json({
              success: false,
              message: 'Account not yet activated. Please contact administrator to verify your application.'
            });
          }
        } catch (appError) {
          console.log('Debug: Error checking applications table:', appError);
        }
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const mentor = result.rows[0];
    
    // Debug logging for specific email
    if (email === 'adarsh@gmail.com') {
      console.log('Debug: Found mentor:', {
        id: mentor.id,
        email: mentor.email,
        status: mentor.status,
        hasPasswordHash: !!mentor.password_hash
      });
    }

    // Check if mentor is active
    if (mentor.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please contact administrator.'
      });
    }

    // Verify password - handle both hashed and plain text passwords for demo
    let isValidPassword = false;
    
    if (mentor.password_hash) {
      // Debug logging for specific email
      if (email === 'adarsh@gmail.com') {
        console.log('Debug: Comparing password with hash');
        console.log('Debug: Password hash exists:', !!mentor.password_hash);
      }
      
      // Try bcrypt comparison first
      try {
        isValidPassword = await bcrypt.compare(password, mentor.password_hash);
        
        if (email === 'adarsh@gmail.com') {
          console.log('Debug: Bcrypt comparison result:', isValidPassword);
        }
      } catch (bcryptError) {
        console.log('Bcrypt comparison failed, trying plain text comparison');
        // If bcrypt fails, try plain text comparison for demo purposes
        isValidPassword = password === mentor.password_hash;
        
        if (email === 'adarsh@gmail.com') {
          console.log('Debug: Plain text comparison result:', isValidPassword);
        }
      }
    } else {
      // If no password_hash, this mentor needs to be set up properly
      if (email === 'adarsh@gmail.com') {
        console.log('Debug: No password hash found for mentor');
      }
      
      return res.status(401).json({
        success: false,
        message: 'Account not properly configured. Please contact administrator.'
      });
    }

    if (!isValidPassword) {
      if (email === 'adarsh@gmail.com') {
        console.log('Debug: Password validation failed');
      }
      
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
