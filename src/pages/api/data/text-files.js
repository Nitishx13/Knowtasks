const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from request (added by auth middleware)
  const userId = req.userId || req.headers['user-id'];
  
  console.log('Text Files API - User ID from request:', userId);
  
  if (!userId) {
    console.error('Text Files API - No user ID found in request');
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required',
      message: 'User ID is required to fetch text files'
    });
  }

    // Test database connection
    await sql`SELECT NOW()`;

    // Fetch only text files belonging to the current user
    // Check if the type column exists in the table
    let result;
    try {
      result = await sql`
        SELECT 
          id,
          title,
          content,
          user_id,
          created_at,
          updated_at
        FROM text_files 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
    } catch (dbError) {
      // If there's an error with the query, try a simpler query
      console.error('Error with initial query:', dbError.message);
      result = await sql`
        SELECT * FROM text_files 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
    }

    const files = result.rows.map(file => ({
      id: file.id,
      title: file.title,
      content: file.content,
      type: file.type,
      userId: file.user_id,
      createdAt: file.created_at,
      updatedAt: file.updated_at,
      // Format date for display
      formattedDate: new Date(file.created_at).toLocaleDateString('en-US', {
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
    console.error('Error fetching text files:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}

// Apply auth middleware to protect this route
export default authMiddleware(handler);