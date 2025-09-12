const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkMentorSchema() {
  try {
    console.log('Checking mentor_users table schema...');
    
    const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_users'
    `;
    
    console.log('Columns in mentor_users table:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}`);
    });
    
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkMentorSchema();