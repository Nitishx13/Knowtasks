// Script to check user IDs in the database
// Run with: node scripts/check-user-id.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function checkUserIds() {
  try {
    console.log('Checking user IDs in database...');

    // Check users table
    console.log('\nChecking users table:');
    try {
      const users = await sql`SELECT id, name, email, created_at FROM users`;
      
      if (users.rows.length === 0) {
        console.log('  No users found in the database');
      } else {
        console.log(`  Found ${users.rows.length} users:`);
        users.rows.forEach(user => {
          console.log(`  - ID: ${user.id}`);
          console.log(`    Name: ${user.name}`);
          console.log(`    Email: ${user.email}`);
          console.log(`    Created: ${user.created_at}`);
          console.log('');
        });
      }
    } catch (error) {
      console.log(`  Error querying users table: ${error.message}`);
    }

    // Check documents table for user references
    console.log('\nChecking documents table for user references:');
    try {
      const documents = await sql`
        SELECT user_id, COUNT(*) as doc_count 
        FROM documents 
        GROUP BY user_id
      `;
      
      if (documents.rows.length === 0) {
        console.log('  No documents found in the database');
      } else {
        console.log(`  Found documents for ${documents.rows.length} users:`);
        documents.rows.forEach(doc => {
          console.log(`  - User ID: ${doc.user_id}, Document count: ${doc.doc_count}`);
        });
      }
    } catch (error) {
      console.log(`  Error querying documents table: ${error.message}`);
    }

    // Check uploaded_files table for user references
    console.log('\nChecking uploaded_files table for user references:');
    try {
      const files = await sql`
        SELECT user_id, COUNT(*) as file_count 
        FROM uploaded_files 
        GROUP BY user_id
      `;
      
      if (files.rows.length === 0) {
        console.log('  No uploaded files found in the database');
      } else {
        console.log(`  Found uploaded files for ${files.rows.length} users:`);
        files.rows.forEach(file => {
          console.log(`  - User ID: ${file.user_id}, File count: ${file.file_count}`);
        });
      }
    } catch (error) {
      console.log(`  Error querying uploaded_files table: ${error.message}`);
    }

    // Check text_files table for user references if it exists
    console.log('\nChecking text_files table for user references:');
    try {
      const textFiles = await sql`
        SELECT user_id, COUNT(*) as file_count 
        FROM text_files 
        GROUP BY user_id
      `;
      
      if (textFiles.rows.length === 0) {
        console.log('  No text files found in the database');
      } else {
        console.log(`  Found text files for ${textFiles.rows.length} users:`);
        textFiles.rows.forEach(file => {
          console.log(`  - User ID: ${file.user_id}, File count: ${file.file_count}`);
        });
      }
    } catch (error) {
      console.log(`  Error querying text_files table: ${error.message}`);
    }

    console.log('\nUser ID check completed.');
  } catch (error) {
    console.error('Error checking user IDs:', error);
  }
}

// Run the function
checkUserIds();