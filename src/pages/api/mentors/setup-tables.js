import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Drop and recreate mentor_applications table with correct schema
    await sql`DROP TABLE IF EXISTS mentor_applications CASCADE`;
    await sql`
      CREATE TABLE mentor_applications (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        experience VARCHAR(255),
        bio TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Drop and recreate mentor_users table with correct schema
    await sql`DROP TABLE IF EXISTS mentor_users CASCADE`;
    await sql`
      CREATE TABLE mentor_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT,
        user_id VARCHAR(100) UNIQUE,
        subject VARCHAR(255),
        phone VARCHAR(50),
        experience VARCHAR(255),
        bio TEXT,
        role VARCHAR(50) DEFAULT 'mentor',
        status VARCHAR(50) DEFAULT 'active',
        verified BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return res.status(200).json({
      success: true,
      message: 'Database tables created successfully',
      tables: ['mentor_applications', 'mentor_users']
    });

  } catch (error) {
    console.error('Error creating tables:', error);
    return res.status(500).json({ 
      error: 'Failed to create tables',
      details: error.message 
    });
  }
}
