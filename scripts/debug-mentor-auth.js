require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function debugMentorAuth() {
  try {
    console.log('=== Debugging Mentor Authentication ===\n');
    
    // Check all mentors in database
    const allMentors = await sql`
      SELECT user_id, name, email, id FROM mentor_users ORDER BY created_at DESC
    `;
    
    console.log('All mentors in database:');
    allMentors.rows.forEach(mentor => {
      console.log(`- ID: ${mentor.id}, user_id: ${mentor.user_id}, name: ${mentor.name}, email: ${mentor.email}`);
    });
    
    console.log('\n=== Testing Authentication ===');
    
    // Test with test_user_123 (from AuthContext)
    const testUser = await sql`
      SELECT * FROM mentor_users WHERE user_id = 'test_user_123'
    `;
    
    console.log('\nLooking for user_id "test_user_123":');
    if (testUser.rows.length > 0) {
      console.log('✅ Found:', testUser.rows[0]);
    } else {
      console.log('❌ Not found');
    }
    
    // Test with mentor_test_123 (our created mentor)
    const mentorTest = await sql`
      SELECT * FROM mentor_users WHERE user_id = 'mentor_test_123'
    `;
    
    console.log('\nLooking for user_id "mentor_test_123":');
    if (mentorTest.rows.length > 0) {
      console.log('✅ Found:', mentorTest.rows[0]);
    } else {
      console.log('❌ Not found');
    }
    
    console.log('\n=== Solution ===');
    console.log('The dashboard is using "test_user_123" from AuthContext,');
    console.log('but our mentor record has user_id "mentor_test_123".');
    console.log('We need to either:');
    console.log('1. Create a mentor record with user_id "test_user_123", OR');
    console.log('2. Update the dashboard to use "mentor_test_123"');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugMentorAuth();
