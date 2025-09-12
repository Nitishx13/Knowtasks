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
      return res.status(500).json({ 
        error: 'Database configuration error: POSTGRES_URL not found',
        success: false
      });
    }

    // Test database connection
    const result = await sql`SELECT NOW() as current_time`;
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      current_time: result.rows[0]?.current_time,
      environment: process.env.NODE_ENV
    });

  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message,
      success: false
    });
  }
}