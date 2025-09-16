const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setupConceptsTable() {
  try {
    console.log('Creating concepts table...');
    console.log('Database URL:', process.env.POSTGRES_URL ? 'Found' : 'Missing');
    
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
        difficulty VARCHAR(50) DEFAULT 'medium',
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Concepts table created successfully');
    
    // Create index for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_concepts_user_id ON concepts(user_id)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_concepts_subject ON concepts(subject)
    `;
    
    console.log('✅ Indexes created successfully');
    
    // Insert sample concept for testing
    await sql`
      INSERT INTO concepts (title, description, key_points, examples, subject, chapter, difficulty, user_id)
      VALUES (
        'Electromagnetic Induction',
        'The process by which a changing magnetic field induces an electric current in a conductor.',
        '• Faraday''s Law: EMF = -dΦ/dt\n• Lenz''s Law: Direction opposes change\n• Applications in generators and transformers\n• Mutual and self-induction',
        'Electric generators, transformers, induction cooktops, wireless charging, magnetic braking systems',
        'Physics',
        'Electromagnetic Induction',
        'hard',
        'sample-user'
      )
      ON CONFLICT DO NOTHING
    `;
    
    console.log('✅ Sample concept inserted');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up concepts table:', error);
    process.exit(1);
  }
}

setupConceptsTable();
