require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function checkMentorTable() {
  try {
    console.log('Checking mentor_users table...\n');
    
    // Check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'mentor_users'
      );
    `;
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ mentor_users table does not exist');
      return;
    }
    
    console.log('✅ mentor_users table exists');
    
    // Get table structure
    console.log('\n📋 Table Structure:');
    const structure = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'mentor_users'
      ORDER BY ordinal_position;
    `;
    
    structure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Count total mentors
    const count = await sql`SELECT COUNT(*) as total FROM mentor_users`;
    console.log(`\n📊 Total mentors: ${count.rows[0].total}`);
    
    // Show all mentors
    if (count.rows[0].total > 0) {
      console.log('\n👥 Current mentors:');
      const mentors = await sql`
        SELECT id, name, email, subject, status, created_at, last_login
        FROM mentor_users 
        ORDER BY created_at DESC
      `;
      
      mentors.rows.forEach(mentor => {
        console.log(`  ${mentor.id}: ${mentor.name} (${mentor.email})`);
        console.log(`      Subject: ${mentor.subject}, Status: ${mentor.status}`);
        console.log(`      Created: ${new Date(mentor.created_at).toLocaleString()}`);
        console.log(`      Last Login: ${mentor.last_login ? new Date(mentor.last_login).toLocaleString() : 'Never'}`);
        console.log('');
      });
    } else {
      console.log('\n❌ No mentors found in table');
    }
    
  } catch (error) {
    console.error('❌ Error checking mentor table:', error.message);
    
    if (error.message.includes('POSTGRES_URL')) {
      console.log('\n💡 Database connection not configured.');
      console.log('To fix this:');
      console.log('1. Set up your database (Vercel Postgres, Supabase, etc.)');
      console.log('2. Add POSTGRES_URL to your .env.local file');
      console.log('3. Run: node setup-tables.js');
      console.log('4. Run: node scripts/add-initial-mentors.js');
    }
  }
}

checkMentorTable();
