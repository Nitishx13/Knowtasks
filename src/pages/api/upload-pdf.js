const { sql } = require('@vercel/postgres');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileUrl, fileName, fileSize, uploadSource } = req.body;

    if (!fileUrl || !fileName) {
      return res.status(400).json({ error: 'File URL and filename are required' });
    }

    console.log('Received upload request:', { fileUrl, fileName, fileSize, uploadSource });

    // Test database connection first
    console.log('Testing database connection...');
    await sql`SELECT NOW()`;
    console.log('Database connection test successful');

    // Create files table if it doesn't exist
    console.log('Creating/checking files table...');
    await sql`
      CREATE TABLE IF NOT EXISTS uploaded_files (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_size BIGINT,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'uploaded',
        user_id VARCHAR(255),
        upload_source VARCHAR(50) DEFAULT 'local'
      )
    `;
    console.log('Files table ready');

    // Insert the uploaded file
    console.log('Inserting file into database...');
    const result = await sql`
      INSERT INTO uploaded_files (file_name, file_url, file_size, user_id, upload_source)
      VALUES (${fileName}, ${fileUrl}, ${fileSize || 0}, 'test-user', ${uploadSource || 'local'})
      RETURNING *
    `;

    const savedFile = result.rows[0];
    console.log('File uploaded successfully to Neon database:', savedFile);

    res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully to Neon database',
      file: savedFile
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
