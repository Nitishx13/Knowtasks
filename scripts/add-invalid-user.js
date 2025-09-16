const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function addInvalidUser() {
  try {
    console.log('Adding invalid_user to mentor_users table...\n');
    
    // Insert invalid_user for testing
    const result = await sql`
      INSERT INTO mentor_users (user_id, name, email, subject, experience)
      VALUES (
        'invalid_user',
        'Invalid Test User',
        'invalid@test.com',
        'physics',
        2
      )
      RETURNING user_id, name, email
    `;
    
    console.log('✅ Successfully added invalid_user:');
    console.table(result.rows);
    
    // Verify all test users now exist
    const allUsers = await sql`SELECT user_id, name, email FROM mentor_users WHERE user_id IN ('test_user_123', 'mentor_test_123', 'invalid_user') ORDER BY user_id`;
    
    console.log('\nAll test users in mentor_users table:');
    console.table(allUsers.rows);
    
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      console.log('ℹ️ invalid_user already exists in the table');
      
      // Show existing record
      const existing = await sql`SELECT user_id, name, email FROM mentor_users WHERE user_id = 'invalid_user'`;
      console.table(existing.rows);
    } else {
      console.error('Error adding invalid_user:', error.message);
    }
  }
}

addInvalidUser();
