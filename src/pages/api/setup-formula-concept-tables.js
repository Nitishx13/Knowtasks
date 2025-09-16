import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Creating formulas and concepts tables...');

    // Create formulas table
    await sql`
      CREATE TABLE IF NOT EXISTS formulas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        formula TEXT NOT NULL,
        description TEXT,
        applications TEXT,
        subject VARCHAR(100) NOT NULL,
        chapter VARCHAR(255),
        difficulty VARCHAR(20) DEFAULT 'medium',
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create concepts table
    await sql`
      CREATE TABLE IF NOT EXISTS concepts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        key_points TEXT,
        examples TEXT,
        subject VARCHAR(100) NOT NULL,
        chapter VARCHAR(255),
        difficulty VARCHAR(20) DEFAULT 'medium',
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_formulas_user_subject 
      ON formulas(user_id, subject)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_formulas_subject_difficulty 
      ON formulas(subject, difficulty)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_concepts_user_subject 
      ON concepts(user_id, subject)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_concepts_subject_difficulty 
      ON concepts(subject, difficulty)
    `;

    console.log('Tables created successfully');

    res.status(200).json({ 
      success: true, 
      message: 'Formulas and concepts tables created successfully',
      tables: ['formulas', 'concepts']
    });

  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ 
      error: 'Failed to create tables',
      details: error.message 
    });
  }
}
