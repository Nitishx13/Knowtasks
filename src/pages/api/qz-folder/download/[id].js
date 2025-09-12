import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
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
      SELECT id, title, file_path, file_type
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

    // Check if file exists on disk
    if (!fs.existsSync(file.file_path)) {
      return res.status(404).json({ 
        error: 'File not found on disk',
        success: false
      });
    }

    // Set appropriate headers for file download
    const fileName = `${file.title}${file.file_type}`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = fs.createReadStream(file.file_path);
    fileStream.pipe(res);

  } catch (error) {
    console.error('QZ file download error:', error);
    res.status(500).json({ 
      error: 'Failed to download file',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false
    });
  }
}
