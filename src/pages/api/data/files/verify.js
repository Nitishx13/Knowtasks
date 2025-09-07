const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileId, userId } = req.query;
    
    if (!fileId || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing parameters', 
        message: 'File ID and User ID are required' 
      });
    }

    // Verify file belongs to the user
    const result = await sql`
      SELECT id FROM uploaded_files 
      WHERE id = ${fileId} AND user_id = ${userId}
    `;

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You do not have permission to access this file'
      });
    }

    res.status(200).json({
      success: true,
      message: 'File access verified'
    });

  } catch (error) {
    console.error('Error verifying file access:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}

// Apply auth middleware to protect this route
export default authMiddleware(handler);