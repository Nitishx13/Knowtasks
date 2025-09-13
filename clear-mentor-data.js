const { sql } = require('@vercel/postgres');

async function clearMentorData() {
  try {
    console.log('Clearing mentor_users table...');
    const result1 = await sql`DELETE FROM mentor_users`;
    console.log('✅ Cleared mentor_users table');
    
    console.log('Clearing mentor_applications table...');
    const result2 = await sql`DELETE FROM mentor_applications`;
    console.log('✅ Cleared mentor_applications table');
    
    console.log('All mentor data cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing mentor data:', error.message);
  }
}

clearMentorData();
