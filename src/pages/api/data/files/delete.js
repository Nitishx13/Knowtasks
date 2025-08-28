const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    // First, get the file information
    const fileResult = await sql`
      SELECT file_url, file_name FROM uploaded_files WHERE id = ${fileId}
    `;

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = fileResult.rows[0];

    // Delete the file from the database
    await sql`
      DELETE FROM uploaded_files WHERE id = ${fileId}
    `;

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
