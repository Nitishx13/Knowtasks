const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fixNotesTable() {
  try {
    console.log('Fixing notes table...');
    
    // Drop existing table if it exists
    await sql`DROP TABLE IF EXISTS notes CASCADE`;
    console.log('✅ Dropped existing notes table');
    
    // Create notes table without foreign key constraint
    await sql`
      CREATE TABLE notes (
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
    await sql`CREATE INDEX idx_notes_user_id ON notes(user_id)`;
    await sql`CREATE INDEX idx_notes_subject ON notes(subject)`;
    await sql`CREATE INDEX idx_notes_note_type ON notes(note_type)`;
    
    console.log('✅ Indexes created successfully');
    
    // Insert sample data for testing
    await sql`
      INSERT INTO notes (
        title, content, summary, subject, chapter, difficulty, note_type, word_count, user_id
      ) VALUES (
        'Sample Physics Notes',
        'This is a sample physics note about mechanics and motion.',
        'Basic concepts of mechanics',
        'Physics',
        'Mechanics',
        'medium',
        'general',
        12,
        'test_user_123'
      )
    `;
    
    console.log('✅ Sample data inserted');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing notes table:', error);
    process.exit(1);
  }
}

fixNotesTable();
