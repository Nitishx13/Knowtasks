const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

async function createAdarshAccount() {
  try {
    const email = 'adarsh@gmail.com';
    const password = '8gI9hEq6jQlq';
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `MENTOR_${Date.now().toString().slice(-6)}`;

    // Create mentor account directly
    const mentorResult = await sql`
      INSERT INTO mentor_users (
        name, email, password_hash, user_id, subject, role, status, verified, 
        phone, experience, bio, created_at, updated_at
      ) VALUES (
        'Adarsh', 
        ${email}, 
        ${passwordHash}, 
        ${userId}, 
        'Mathematics', 
        'mentor', 
        'active', 
        true,
        '+1234567890',
        '5 years',
        'Experienced mathematics mentor',
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      ) RETURNING id, email, name, user_id
    `;

    console.log('✅ Mentor account created:', mentorResult.rows[0]);
    console.log('🔑 Login credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Login URL: /mentor/login-new');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdarshAccount();
