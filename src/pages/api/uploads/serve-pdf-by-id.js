import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    // Get authenticated user ID - check headers directly
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to access files'
      });
    }

    // Get file info from database - SECURE: only allow access to user's own files
    const result = await sql`
      SELECT file_name, title FROM mentor_uploads 
      WHERE id = ${id} AND user_id = ${userId}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const { file_name, title } = result.rows[0];
    
    // Construct the file path
    const uploadsDir = path.join(process.cwd(), 'uploads', 'mentor-content');
    const filePath = path.join(uploadsDir, file_name);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Physical file not found:', filePath);
      return res.status(404).json({ error: 'Physical file not found' });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    // Set appropriate headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Disposition', `inline; filename="${title}.pdf"`);

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error reading file' });
      }
    });

  } catch (error) {
    console.error('PDF serve error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export handler directly - authentication handled internally
export default handler;
