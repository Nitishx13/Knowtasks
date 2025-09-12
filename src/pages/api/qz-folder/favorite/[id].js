import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
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

    // Get current favorite status
    const currentResult = await sql`
      SELECT is_favorite
      FROM qz_files
      WHERE id = ${id}
    `;

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'File not found',
        success: false
      });
    }

    const currentFavorite = currentResult.rows[0].is_favorite;
    const newFavorite = !currentFavorite;

    // Update favorite status
    await sql`
      UPDATE qz_files
      SET is_favorite = ${newFavorite}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    res.status(200).json({
      success: true,
      is_favorite: newFavorite,
      message: `File ${newFavorite ? 'added to' : 'removed from'} favorites`
    });

  } catch (error) {
    console.error('QZ file favorite toggle error:', error);
    res.status(500).json({ 
      error: 'Failed to update favorite status',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false
    });
  }
}
