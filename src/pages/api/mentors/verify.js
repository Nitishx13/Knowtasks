import { sql } from '@vercel/postgres';

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
      return res.status(403).json({ error: 'Unauthorized. Only superadmins can verify mentors' });
    }
    
    // Update the mentor's verification status
    const result = await sql`
      UPDATE mentor_users
      SET 
        status = ${verified ? 'active' : 'pending'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${mentorId}
      RETURNING id
    `;
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: `Mentor ${verified ? 'verified' : 'unverified'} successfully`,
    });
  } catch (error) {
    console.error('Error verifying mentor:', error);
    return res.status(500).json({ error: 'Failed to update mentor verification status' });
  }
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