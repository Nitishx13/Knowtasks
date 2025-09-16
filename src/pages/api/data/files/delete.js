const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
import { authMiddleware } from '../../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from request headers or query parameters
    const userId = req.headers['user-id'] || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required', 
        message: 'User ID is required to delete files' 
      });
    }
    
    const { fileId, fileIds } = req.body;
    
    // Handle both single file and bulk delete
    const filesToDelete = fileIds || (fileId ? [fileId] : []);

    if (filesToDelete.length === 0) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    // First, verify all files belong to the user
    const fileResult = await sql`
      SELECT id, file_url, file_name 
      FROM uploaded_files 
      WHERE id = ANY(${filesToDelete}) AND user_id = ${userId}
    `;

    if (fileResult.rows.length === 0) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied',
        message: 'You do not have permission to delete these files'
      });
    }
    
    // Check if all requested files were found
    if (fileResult.rows.length !== filesToDelete.length) {
      console.warn(`User ${userId} attempted to delete files they don't own`);
    }

    // Delete the files from the database
    await sql`
      DELETE FROM uploaded_files 
      WHERE id = ANY(${fileResult.rows.map(row => row.id)}) AND user_id = ${userId}
    `;
    
    // Process each file for physical deletion
    for (const file of fileResult.rows) {
      // Try to delete the physical file (optional - don't fail if file doesn't exist)
      try {
        if (file.file_url.startsWith('http')) {
          // If it's a full URL, extract the path
          const url = new URL(file.file_url);
          const filePath = path.join(process.cwd(), 'uploads', url.pathname.replace('/uploads/', ''));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } else {
          // If it's a relative path
          const filePath = path.join(process.cwd(), 'uploads', file.file_url.replace('/uploads/', ''));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (fileError) {
        console.warn('Could not delete physical file:', fileError);
        // Don't fail the request if file deletion fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}

// Apply auth middleware to protect this route
export default authMiddleware(handler);
