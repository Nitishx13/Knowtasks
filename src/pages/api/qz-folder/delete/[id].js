import { sql } from '@vercel/postgres';
import fs from 'fs';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection error: POSTGRES_URL not found');
      return res.status(500).json({ 
        error: 'Database configuration error',
        success: false
      });
    }

    // Get file info from database
    const result = await sql`
      SELECT id, file_path
      FROM qz_files
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'File not found',
        success: false
      });
    }

    const file = result.rows[0];

    // Delete file from disk if it exists
    if (fs.existsSync(file.file_path)) {
      try {
        fs.unlinkSync(file.file_path);
      } catch (fileError) {
        console.error('Error deleting file from disk:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete file record from database
    await sql`
      DELETE FROM qz_files
      WHERE id = ${id}
    `;

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('QZ file delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false
    });
  }
}
