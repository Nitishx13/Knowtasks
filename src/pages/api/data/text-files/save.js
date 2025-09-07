import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user ID from request (added by auth middleware)
  const userId = req.userId || req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required',
      message: 'User ID is required for saving text files'
    });
  }

  try {
    const { text, title } = req.body;
    
    if (!text || !title) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields', 
        message: 'Both text content and title are required'
      });
    }

    const uploadDate = new Date().toISOString();
    const wordCount = text.split(/\s+/).length;

    // Store text file in database with user ID
    const result = await sql`
      INSERT INTO text_files (
        title, 
        content, 
        user_id, 
        upload_date, 
        word_count
      ) VALUES (
        ${title}, 
        ${text}, 
        ${userId}, 
        ${uploadDate}, 
        ${wordCount}
      ) RETURNING id
    `;

    const fileId = result.rows[0].id;

    // Return success response with file details
    return res.status(200).json({
      success: true,
      message: 'Text file saved successfully',
      file: {
        id: fileId,
        title,
        wordCount,
        uploadDate,
        userId
      }
    });
  } catch (error) {
    console.error('Error saving text file:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error', 
      details: error.message 
    });
  }
}

// Apply auth middleware
export default authMiddleware(handler);