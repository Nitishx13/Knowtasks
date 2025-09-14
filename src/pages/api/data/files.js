const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get user ID from auth middleware - MUST be authenticated
    const userId = req.userId;
    
    if (!userId) {
      console.error('Files API - No authenticated user ID found');
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required',
        message: 'User must be authenticated to access files'
      });
    }
    
    console.log('Files API - Authenticated user ID:', userId);

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

// Enhanced handler with better error handling
async function enhancedHandler(req, res) {
  try {
    // Add CORS headers for better compatibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    return await handler(req, res);
  } catch (error) {
    console.error('Enhanced handler error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(enhancedHandler);
