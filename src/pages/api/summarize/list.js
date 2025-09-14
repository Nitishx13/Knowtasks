import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user ID from middleware - REQUIRED for security
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to access summaries'
      });
    }
    
    const { search, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT 
        id, 
        file_name, 
        file_url, 
        file_size, 
        user_id, 
        upload_source, 
        upload_date, 
        status,
        content,
        summary,
        file_type
      FROM uploaded_files 
      WHERE status = 'processed'
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (search) {
      query += ` AND (file_name ILIKE $${++paramCount} OR content ILIKE $${++paramCount} OR summary ILIKE $${++paramCount})`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // ALWAYS filter by authenticated user ID - no exceptions for security
    query += ` AND user_id = $${++paramCount}`;
    params.push(userId);
    
    query += ` ORDER BY upload_date DESC`;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(parseInt(limit), offset);
    
    const result = await sql.query(query, params);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM uploaded_files WHERE status = 'processed'`;
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (file_name ILIKE $1 OR content ILIKE $2 OR summary ILIKE $3)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // ALWAYS filter count by authenticated user ID - no exceptions for security
    countQuery += ` AND user_id = $${countParams.length + 1}`;
    countParams.push(userId);
    
    const countResult = await sql.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    const summaries = result.rows.map(file => ({
      id: file.id,
      fileName: file.file_name,
      fileUrl: file.file_url,
      fileSize: file.file_size,
      userId: file.user_id,
      uploadSource: file.upload_source,
      uploadDate: file.upload_date,
      status: file.status,
      content: file.content,
      summary: file.summary,
      fileType: file.file_type,
      wordCount: file.content ? file.content.split(/\s+/).length : 0,
      formattedSize: formatFileSize(file.file_size),
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
      summaries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching summaries:', error);
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

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
