const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    await sql`SELECT NOW()`;
    
    // Get user ID from request (added by auth middleware)
    const userId = req.userId || req.headers['user-id'];
    
    console.log('Files API - User ID from request:', userId);
    
    if (!userId) {
      console.error('Files API - No user ID found in request');
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required',
        message: 'User ID is required to fetch files'
      });
    }

    // Fetch only files belonging to the current user
    const result = await sql`
      SELECT 
        id,
        file_name,
        file_url,
        file_size,
        user_id,
        upload_source,
        upload_date,
        status
      FROM uploaded_files 
      WHERE user_id = ${userId}
      ORDER BY upload_date DESC
    `;

    const files = result.rows.map(file => ({
      id: file.id,
      fileName: file.file_name,
      fileUrl: file.file_url,
      fileSize: file.file_size,
      userId: file.user_id,
      uploadSource: file.upload_source,
      uploadDate: file.upload_date,
      status: file.status,
      // Format file size for display
      formattedSize: formatFileSize(file.file_size),
      // Format date for display
      formattedDate: new Date(file.upload_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    res.status(200).json({
      success: true,
      files,
      total: files.length
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Apply auth middleware to protect this route
export default authMiddleware(handler);
