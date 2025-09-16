// Script to clear all data from the database tables
// Run with: node scripts/clear-db.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function clearDatabase() {
  try {
    console.log('Clearing all database tables...');

    // Clear uploaded_files table
    console.log('Clearing uploaded_files table...');
    await sql`TRUNCATE TABLE uploaded_files CASCADE`;
    
    // Clear text_files table
    console.log('Clearing text_files table...');
    await sql`TRUNCATE TABLE text_files CASCADE`;
    
    // Clear users table if it exists
    console.log('Clearing users table...');
    try {
      await sql`TRUNCATE TABLE users CASCADE`;
    } catch (error) {
      console.log('Users table may not exist or another error occurred:', error.message);
    }
    
    // Clear documents table if it exists
    console.log('Clearing documents table...');
    try {
      await sql`TRUNCATE TABLE documents CASCADE`;
    } catch (error) {
      console.log('Documents table may not exist or another error occurred:', error.message);
    }
    
    // Clear summaries table if it exists
    console.log('Clearing summaries table...');
    try {
      await sql`TRUNCATE TABLE summaries CASCADE`;
    } catch (error) {
      console.log('Summaries table may not exist or another error occurred:', error.message);
    }

    console.log('Database cleared successfully!');
    
    // Verify tables are empty
    const uploadedFilesCount = await sql`SELECT COUNT(*) FROM uploaded_files`;
    console.log(`Uploaded files count: ${uploadedFilesCount.rows[0].count}`);
    
    const textFilesCount = await sql`SELECT COUNT(*) FROM text_files`;
    console.log(`Text files count: ${textFilesCount.rows[0].count}`);
    
    try {
      const usersCount = await sql`SELECT COUNT(*) FROM users`;
      console.log(`Users count: ${usersCount.rows[0].count}`);
    } catch (error) {
      console.log('Could not count users table');
    }
    
    try {
      const documentsCount = await sql`SELECT COUNT(*) FROM documents`;
      console.log(`Documents count: ${documentsCount.rows[0].count}`);
    } catch (error) {
      console.log('Could not count documents table');
    }

  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

// Run the clear database function
clearDatabase();