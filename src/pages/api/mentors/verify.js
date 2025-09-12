import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the mentor ID and verification status from the request body
    const { mentorId, verified } = req.body;
    
    // Validate required fields
    if (!mentorId) {
      return res.status(400).json({ error: 'Mentor ID is required' });
    }
    
    if (typeof verified !== 'boolean') {
      return res.status(400).json({ error: 'Verified status must be a boolean' });
    }
    
    // Check if the user is a superadmin (you'll need to implement your own auth check here)
    // This is a placeholder for your actual authentication logic
    const isAuthorized = await checkIfUserIsSuperAdmin(req);
    if (!isAuthorized) {
      // For testing purposes, allow admin authorization
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.includes('admin')) {
        console.log('Using test admin authorization');
      } else {
        return res.status(403).json({ error: 'Unauthorized. Only superadmins can verify mentors' });
      }
    }
    
    // Get mentor details first
    const mentorResult = await sql`
      SELECT id, name, email, subject, status
      FROM mentor_users 
      WHERE id = ${mentorId}
    `;
    
    if (mentorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    const mentor = mentorResult.rows[0];
    let generatedCredentials = null;
    
    // If approving a mentor, generate login credentials
    if (verified && mentor.status !== 'active') {
      // Generate user ID and password
      const userId = `MENTOR_${mentor.id}_${Date.now().toString().slice(-6)}`;
      const password = generateRandomPassword();
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Update mentor with new credentials and status
      await sql`
        UPDATE mentor_users
        SET 
          status = 'active',
          verified = true,
          password_hash = ${passwordHash},
          user_id = ${userId},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${mentorId}
      `;
      
      generatedCredentials = {
        userId: userId,
        password: password,
        email: mentor.email
      };
    } else {
      // Just update status
      await sql`
        UPDATE mentor_users
        SET 
          status = ${verified ? 'active' : 'pending'},
          verified = ${verified},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${mentorId}
      `;
    }
    
    // Return success response with credentials if generated
    return res.status(200).json({
      success: true,
      message: `Mentor ${verified ? 'verified and activated' : 'unverified'} successfully`,
      credentials: generatedCredentials
    });
  } catch (error) {
    console.error('Error verifying mentor:', error);
    return res.status(500).json({ error: 'Failed to update mentor verification status' });
  }
}

// Function to generate random password
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Function for checking if the user is a superadmin
async function checkIfUserIsSuperAdmin(req) {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return false;
    }
    
    // Extract the email from the auth header (this is a simplified example)
    // In a real app, you would verify a JWT token or session
    const email = authHeader.split(' ')[1];
    
    if (!email) {
      return false;
    }
    
    // Check if the user exists and is a superadmin
    const result = await sql`
      SELECT id FROM superadmin_users 
      WHERE email = ${email} AND status = 'active' AND role = 'superadmin'
    `;
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking superadmin status:', error);
    return false;
  }
}