const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function createNotesTable() {
  try {
    console.log('Creating notes table...');
    
    // Create notes table without foreign key constraint
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        subject VARCHAR(100) NOT NULL,
        chapter VARCHAR(255),
        difficulty VARCHAR(50) DEFAULT 'medium',
        note_type VARCHAR(50) DEFAULT 'general',
        word_count INTEGER DEFAULT 0,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Notes table created successfully');
    
    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notes_note_type ON notes(note_type)`;
    
    console.log('✅ Indexes created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating notes table:', error);
    process.exit(1);
  }
}

createNotesTable();
