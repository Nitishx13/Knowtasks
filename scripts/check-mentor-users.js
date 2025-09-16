const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkMentorUsers() {
  try {
    console.log('Checking mentor_users table...\n');
    
    // Get all mentor users
    const result = await sql`SELECT user_id, name, email, subject, experience FROM mentor_users ORDER BY user_id`;
    
    console.log('Current mentor_users table:');
    console.table(result.rows);
    
    console.log(`\nTotal mentors: ${result.rows.length}`);
    
    // Check specific test users
    const testUsers = ['test_user_123', 'mentor_test_123', 'invalid_user'];
    
    console.log('\nTest user verification:');
    for (const userId of testUsers) {
      const userExists = result.rows.find(row => row.user_id === userId);
      if (userExists) {
        console.log(`✅ ${userId}: EXISTS (${userExists.name})`);
      } else {
        console.log(`❌ ${userId}: NOT FOUND`);
      }
    }
    
  } catch (error) {
    console.error('Error checking mentor_users:', error.message);
  }
}

checkMentorUsers();
