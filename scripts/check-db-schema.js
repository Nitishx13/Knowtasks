require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function checkSchema() {
  try {
    console.log('Checking mentor_users table schema...');
    const result = await sql`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_users'
    `;
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();