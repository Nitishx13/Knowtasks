import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user ID - REQUIRED for security
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to delete mentor content'
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing required field: id' });
    }

    // Get file info before deletion - SECURE: only allow deletion of user's own files
    const fileResult = await sql`
      SELECT file_path, file_name FROM mentor_uploads 
      WHERE id = ${id} AND user_id = ${userId}
    `;

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const { file_path } = fileResult.rows[0];

    // Delete from database - SECURE: only delete user's own files
    await sql`DELETE FROM mentor_uploads WHERE id = ${id} AND user_id = ${userId}`;

    // Delete physical file if it exists
    if (file_path && fs.existsSync(file_path)) {
      try {
        fs.unlinkSync(file_path);
      } catch (fileError) {
        console.warn('Could not delete physical file:', fileError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ 
      error: 'Failed to delete content',
      details: error.message 
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
