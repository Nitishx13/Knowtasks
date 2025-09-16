import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Drop existing table if it exists (to fix schema issues)
    await sql`DROP TABLE IF EXISTS mentor_uploads`;
    
    // Create mentor_uploads table with correct schema
    await sql`
      CREATE TABLE mentor_uploads (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        year INTEGER,
        exam_type VARCHAR(100),
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        uploaded_by VARCHAR(255),
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index on user_id for better query performance
    await sql`CREATE INDEX idx_mentor_uploads_user_id ON mentor_uploads(user_id)`;
    
    // Create index on type for filtering
    await sql`CREATE INDEX idx_mentor_uploads_type ON mentor_uploads(type)`;

    res.status(200).json({ 
      success: true, 
      message: 'mentor_uploads table created successfully with correct schema',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ 
      error: 'Failed to create mentor_uploads table',
      details: error.message 
    });
  }
}
