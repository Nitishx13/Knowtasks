const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fixConceptsTable() {
  try {
    console.log('Fixing concepts table - removing foreign key constraint...');
    
    // Drop the existing table and recreate without foreign key
    await sql`DROP TABLE IF EXISTS concepts CASCADE`;
    
    // Create concepts table without foreign key constraint
    await sql`
      CREATE TABLE concepts (
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
    
    console.log('✅ Concepts table recreated without foreign key constraint');
    
    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_concepts_user_id ON concepts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_concepts_subject ON concepts(subject)`;
    
    console.log('✅ Indexes created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing concepts table:', error);
    process.exit(1);
  }
}

fixConceptsTable();
