const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function verifyNitishMentor() {
  try {
    console.log('🔍 Checking Nitish mentor credentials...');
    
    // Check if mentor exists
    const result = await sql`
      SELECT id, name, email, subject, role, status, password_hash, created_at
      FROM mentor_users 
      WHERE email = 'nitish121@gmail.com'
    `;

    if (result.rows.length === 0) {
      console.log('❌ Mentor not found in database');
      console.log('📝 Creating Nitish mentor account...');
      
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('nitish@121', 10);
      
      const insertResult = await sql`
        INSERT INTO mentor_users (name, email, password_hash, subject, role, status)
        VALUES ('Nitish Kumar', 'nitish121@gmail.com', ${hashedPassword}, 'Computer Science', 'mentor', 'active')
        RETURNING id, name, email, subject, role, status, created_at
      `;
      
      console.log('✅ Mentor created successfully:');
      console.log(insertResult.rows[0]);
    } else {
      console.log('✅ Mentor found in database:');
      const mentor = result.rows[0];
      console.log({
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        subject: mentor.subject,
        role: mentor.role,
        status: mentor.status,
        created_at: mentor.created_at
      });
      
      // Test password verification
      const bcrypt = require('bcrypt');
      const isValidPassword = await bcrypt.compare('nitish@121', mentor.password_hash);
      console.log('🔐 Password verification:', isValidPassword ? '✅ Valid' : '❌ Invalid');
      
      if (!isValidPassword) {
        console.log('🔧 Updating password...');
        const newHashedPassword = await bcrypt.hash('nitish@121', 10);
        await sql`
          UPDATE mentor_users 
          SET password_hash = ${newHashedPassword}
          WHERE email = 'nitish121@gmail.com'
        `;
        console.log('✅ Password updated successfully');
      }
    }

    // Test API endpoint
    console.log('\n🧪 Testing mentor login API...');
    const testCredentials = {
      email: 'nitish121@gmail.com',
      password: 'nitish@121'
    };

    // Simulate API call
    const bcrypt = require('bcrypt');
    const mentorCheck = await sql`
      SELECT id, name, email, password_hash, subject, role, status, last_login
      FROM mentor_users 
      WHERE email = ${testCredentials.email} AND status = 'active'
    `;

    if (mentorCheck.rows.length > 0) {
      const mentor = mentorCheck.rows[0];
      const isValid = await bcrypt.compare(testCredentials.password, mentor.password_hash);
      console.log('🔍 API simulation result:', isValid ? '✅ Success' : '❌ Failed');
    }

    console.log('\n📋 Login Details:');
    console.log('URL: https://knowtasks.vercel.app/mentor/login');
    console.log('Email: nitish121@gmail.com');
    console.log('Password: nitish@121');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error);
  }
}

verifyNitishMentor();
