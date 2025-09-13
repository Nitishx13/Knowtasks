import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear all data from mentor_users table
    await sql`DELETE FROM mentor_users`;
    
    // Also clear mentor_applications table if needed
    await sql`DELETE FROM mentor_applications`;

    return res.status(200).json({
      success: true,
      message: 'All mentor data cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing mentor data:', error);
    return res.status(500).json({ 
      error: 'Failed to clear mentor data',
      details: error.message 
    });
  }
}
