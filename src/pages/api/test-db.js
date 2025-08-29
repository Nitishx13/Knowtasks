import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    const connectionTest = await sql`SELECT NOW() as current_time`;
    
    // Test table structure
    const tableInfo = await sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'uploaded_files' 
      ORDER BY ordinal_position
    `;
    
    // Get current file count
    const fileCount = await sql`SELECT COUNT(*) as count FROM uploaded_files`;
    
    // Get sample data (if any)
    const sampleData = await sql`
      SELECT id, file_name, file_type, status, upload_date 
      FROM uploaded_files 
      ORDER BY upload_date DESC 
      LIMIT 5
    `;

    res.status(200).json({
      success: true,
      database: {
        connection: 'Connected',
        currentTime: connectionTest.rows[0].current_time,
        tableExists: tableInfo.rows.length > 0,
        columns: tableInfo.rows,
        totalFiles: parseInt(fileCount.rows[0].count),
        sampleFiles: sampleData.rows
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: 'Database connection or query failed'
    });
  }
}
