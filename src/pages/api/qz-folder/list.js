import { sql } from '@vercel/postgres';

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

  try {
    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection error: POSTGRES_URL not found');
      return res.status(500).json({ 
        error: 'Database configuration error',
        success: false,
        files: []
      });
    }

    // Get QZ files from database
    let result;
    try {
      result = await sql`
        SELECT 
          id, title, description, subject, file_path, file_type, file_size,
          is_favorite, created_at, updated_at
        FROM qz_files
        ORDER BY created_at DESC
      `;
    } catch (dbError) {
      console.error('Database query error:', dbError);
      // Return empty array if table doesn't exist
      return res.status(200).json({
        success: true,
        files: [],
        total: 0,
        message: 'No QZ files found'
      });
    }

    const files = result.rows.map(file => ({
      id: file.id,
      title: file.title,
      description: file.description,
      subject: file.subject,
      file_path: file.file_path,
      file_type: file.file_type,
      file_size: file.file_size,
      is_favorite: file.is_favorite || false,
      created_at: file.created_at,
      updated_at: file.updated_at
    }));

    res.status(200).json({
      success: true,
      files: files,
      total: files.length
    });

  } catch (error) {
    console.error('QZ files list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch QZ files',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false,
      files: []
    });
  }
}
