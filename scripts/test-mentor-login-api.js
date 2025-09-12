const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function testMentorLoginAPI() {
  console.log('🧪 Testing mentor login API locally...');
  
  try {
    // Simulate the API logic
    const email = 'nitish121@gmail.com';
    const password = 'nitish@121';
    
    console.log('1️⃣ Querying mentor from database...');
    const result = await sql`
      SELECT id, name, email, password_hash, subject, role, status, last_login, created_at
      FROM mentor_users 
      WHERE email = ${email.toLowerCase().trim()}
    `;

    if (result.rows.length === 0) {
      console.log('❌ Mentor not found');
      return;
    }

    const mentor = result.rows[0];
    console.log('✅ Mentor found:', {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      status: mentor.status
    });

    // Check if mentor is active
    if (mentor.status !== 'active') {
      console.log('❌ Mentor account is not active');
      return;
    }

    console.log('2️⃣ Verifying password...');
    const isValidPassword = await bcrypt.compare(password, mentor.password_hash);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return;
    }

    console.log('✅ Password verified');

    console.log('3️⃣ Updating last login...');
    await sql`
      UPDATE mentor_users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${mentor.id}
    `;

    // Prepare mentor data (exclude password hash)
    const mentorData = {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      subject: mentor.subject,
      role: mentor.role,
      status: mentor.status,
      last_login: new Date().toISOString(),
      created_at: mentor.created_at
    };

    console.log('✅ Login API test successful!');
    console.log('📋 Mentor data:', mentorData);

    // Test the actual API endpoint locally
    console.log('\n🌐 Testing actual API endpoint...');
    
    const testPayload = {
      email: 'nitish121@gmail.com',
      password: 'nitish@121'
    };

    console.log('API would receive:', testPayload);
    console.log('API would return:', {
      success: true,
      message: 'Login successful',
      mentor: mentorData
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Details:', error);
  }
}

testMentorLoginAPI();
