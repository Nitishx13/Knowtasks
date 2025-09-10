// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function setupDatabaseTables() {
  try {
    console.log('🔧 Setting up database tables...');
    
    // Create flashcards table
    console.log('Creating flashcards table...');
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
    console.log('✅ Flashcards table created successfully');
    
    // Create pyq table
    console.log('Creating PYQ table...');
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
    console.log('✅ PYQ table created successfully');
    
    // Verify tables exist
    const flashcardsCheck = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'flashcards'
    `;
    
    const pyqCheck = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'pyq'
    `;
    
    console.log('\n📊 Database Status:');
    console.log(`- Flashcards table: ${flashcardsCheck.rows.length > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`- PYQ table: ${pyqCheck.rows.length > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
    
    if (flashcardsCheck.rows.length > 0 && pyqCheck.rows.length > 0) {
      console.log('\n🎉 All database tables are ready!');
      console.log('You can now upload flashcards and PYQ files.');
    }
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    
    if (error.message.includes('POSTGRES_URL')) {
      console.log('\n💡 Setup Instructions:');
      console.log('1. Create a .env.local file in the project root');
      console.log('2. Add your database connection string:');
      console.log('   POSTGRES_URL=your_database_connection_string');
      console.log('3. Run this script again: npm run setup-db');
    }
  }
}

// Run the setup
setupDatabaseTables();
