const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function addNitishMentor() {
  try {
    console.log('Adding Nitish as mentor...');
    
    const mentorData = {
      name: 'Nitish Kumar',
      email: 'nitish121@gmail.com',
      password: 'nitish@121',
      subject: 'Computer Science',
      status: 'active'
    };
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(mentorData.password, 10);
    
    // Insert mentor into mentor_users table
    const result = await sql`
      INSERT INTO mentor_users (name, email, password_hash, subject, status)
      VALUES (${mentorData.name}, ${mentorData.email}, ${hashedPassword}, ${mentorData.subject}, ${mentorData.status})
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        subject = EXCLUDED.subject,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, name, email, subject, status, created_at
    `;
    
    console.log('✅ Mentor added successfully!');
    console.log('\n📋 Mentor Details:');
    console.log(`  Name: ${result.rows[0].name}`);
    console.log(`  Email: ${result.rows[0].email}`);
    console.log(`  Subject: ${result.rows[0].subject}`);
    console.log(`  Status: ${result.rows[0].status}`);
    console.log(`  ID: ${result.rows[0].id}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log(`  Email: ${mentorData.email}`);
    console.log(`  Password: ${mentorData.password}`);
    
    console.log('\n🌐 Login URL: https://knowtasks.vercel.app/mentor/login');
    
  } catch (error) {
    console.error('❌ Error adding mentor:', error);
  }
}

addNitishMentor();
