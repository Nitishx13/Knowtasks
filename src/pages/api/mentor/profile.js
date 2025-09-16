import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User must be authenticated to access profile'
      });
    }

    // Fetch mentor user data from mentor_users table
    console.log('Looking for mentor with userId:', userId);
    
    const result = await sql`
      SELECT id, email, name, experience, subject, created_at, user_id 
      FROM mentor_users 
      WHERE user_id = ${userId}
    `;
    
    console.log('Database query result:', result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Mentor not found',
        message: 'No mentor profile found for this user ID'
      });
    }

    const mentorData = result.rows[0];

    return res.status(200).json({
      success: true,
      mentor: {
        userId: mentorData.id,
        name: mentorData.name,
        email: mentorData.email,
        experience: mentorData.experience,
        subjects: mentorData.subject,
        joinDate: mentorData.created_at
      }
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch mentor profile',
      details: error.message 
    });
  }
}

export default authMiddleware(handler);
