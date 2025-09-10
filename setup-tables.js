const { sql } = require('@vercel/postgres');

async function setupTables() {
  try {
    console.log('Setting up database tables...');
    
    // Create flashcards table
    await sql`
      CREATE TABLE IF NOT EXISTS flashcards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        subject VARCHAR(100),
        file_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_size INTEGER,
        uploaded_by VARCHAR(255),
        uploader_role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Flashcards table ready');
    
    // Create pyq table
    await sql`
      CREATE TABLE IF NOT EXISTS pyq (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        subject VARCHAR(100),
        year INTEGER,
        exam_type VARCHAR(100),
        file_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_size INTEGER,
        uploaded_by VARCHAR(255),
        uploader_role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ PYQ table ready');
    
    console.log('All tables setup complete!');
    
  } catch (error) {
    console.error('Database setup error:', error.message);
  }
}

setupTables();
