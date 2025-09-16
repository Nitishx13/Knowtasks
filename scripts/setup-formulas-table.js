const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setupFormulasTable() {
  try {
    console.log('Creating formulas table...');
    console.log('Database URL:', process.env.POSTGRES_URL ? 'Found' : 'Missing');
    
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
        difficulty VARCHAR(50) DEFAULT 'medium',
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Formulas table created successfully');
    
    // Create index for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_formulas_user_id ON formulas(user_id)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_formulas_subject ON formulas(subject)
    `;
    
    console.log('✅ Indexes created successfully');
    
    // Insert sample formula for testing
    await sql`
      INSERT INTO formulas (name, formula, description, applications, subject, chapter, difficulty, user_id)
      VALUES (
        'Newton''s Second Law',
        'F = ma',
        'Force equals mass times acceleration. This fundamental law relates the net force acting on an object to its mass and acceleration.',
        'Used in mechanics problems, calculating forces in motion, analyzing collisions, and understanding dynamics.',
        'Physics',
        'Mechanics',
        'medium',
        'sample-user'
      )
      ON CONFLICT DO NOTHING
    `;
    
    console.log('✅ Sample formula inserted');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up formulas table:', error);
    process.exit(1);
  }
}

setupFormulasTable();
