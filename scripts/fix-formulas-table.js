const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fixFormulasTable() {
  try {
    console.log('Fixing formulas table - removing foreign key constraint...');
    
    // Drop the existing table and recreate without foreign key
    await sql`DROP TABLE IF EXISTS formulas CASCADE`;
    
    // Create formulas table without foreign key constraint
    await sql`
      CREATE TABLE formulas (
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
    
    console.log('✅ Formulas table recreated without foreign key constraint');
    
    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_formulas_user_id ON formulas(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_formulas_subject ON formulas(subject)`;
    
    console.log('✅ Indexes created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing formulas table:', error);
    process.exit(1);
  }
}

fixFormulasTable();
