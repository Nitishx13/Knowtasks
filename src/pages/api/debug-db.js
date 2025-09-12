import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const testQuery = await sql`SELECT NOW() as current_time`;
    console.log('Database connection successful:', testQuery.rows[0]);
    
    // Check if superadmin_users table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'superadmin_users'
      )
    `;
    
    console.log('Table exists:', tableCheck.rows[0].exists);
    
    // If table exists, count users
    let userCount = 0;
    if (tableCheck.rows[0].exists) {
      const countQuery = await sql`SELECT COUNT(*) as count FROM superadmin_users`;
      userCount = countQuery.rows[0].count;
      console.log('User count:', userCount);
    }
    
    res.status(200).json({
      success: true,
      database_connected: true,
      current_time: testQuery.rows[0].current_time,
      table_exists: tableCheck.rows[0].exists,
      user_count: userCount,
      environment: process.env.NODE_ENV
    });
    
  } catch (error) {
    console.error('Database debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}
