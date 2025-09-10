const { sql } = require('@vercel/postgres');

async function checkFlashcardsTable() {
  try {
    // Check if flashcards table exists
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'flashcards'
    `;
    
    console.log('Flashcards table exists:', tableCheck.rows.length > 0);
    
    if (tableCheck.rows.length === 0) {
      console.log('Creating flashcards table...');
      
      // Create flashcards table
      await sql`
        CREATE TABLE flashcards (
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
      
      console.log('Flashcards table created successfully');
    } else {
      console.log('Flashcards table already exists');
      
      // Show table structure
      const columns = await sql`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'flashcards'
        ORDER BY ordinal_position
      `;
      
      console.log('Table structure:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
  } catch (error) {
    console.error('Database error:', error.message);
  }
}

checkFlashcardsTable();
