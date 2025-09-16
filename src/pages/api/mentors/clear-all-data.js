import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear all mentor-related tables
    await sql`DELETE FROM mentor_uploads`;
    await sql`DELETE FROM mentor_users`;
    await sql`DELETE FROM mentor_applications`;

    return res.status(200).json({
      success: true,
      message: 'All mentor-related data cleared successfully',
      tables_cleared: ['mentor_uploads', 'mentor_users', 'mentor_applications']
    });

  } catch (error) {
    console.error('Error clearing mentor data:', error);
    return res.status(500).json({ 
      error: 'Failed to clear mentor data',
      details: error.message 
    });
  }
}
