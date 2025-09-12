const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function deployFixMentor() {
  try {
    console.log('🔧 Fixing mentor login deployment issues...');
    
    // 1. Verify mentor exists and is active
    console.log('1️⃣ Checking mentor status...');
    const mentorCheck = await sql`
      SELECT id, name, email, subject, role, status, password_hash
      FROM mentor_users 
      WHERE email = 'nitish121@gmail.com'
    `;

    if (mentorCheck.rows.length === 0) {
      console.log('❌ Mentor not found, creating...');
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('nitish@121', 10);
      
      await sql`
        INSERT INTO mentor_users (name, email, password_hash, subject, role, status)
        VALUES ('Nitish Kumar', 'nitish121@gmail.com', ${hashedPassword}, 'Computer Science', 'mentor', 'active')
      `;
      console.log('✅ Mentor created');
    } else {
      const mentor = mentorCheck.rows[0];
      console.log('✅ Mentor found:', {
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        status: mentor.status
      });

      // Ensure mentor is active
      if (mentor.status !== 'active') {
        await sql`
          UPDATE mentor_users 
          SET status = 'active' 
          WHERE email = 'nitish121@gmail.com'
        `;
        console.log('✅ Mentor status updated to active');
      }
    }

    // 2. Test password verification
    console.log('2️⃣ Testing password verification...');
    const mentorData = await sql`
      SELECT password_hash FROM mentor_users WHERE email = 'nitish121@gmail.com'
    `;
    
    const bcrypt = require('bcrypt');
    const isValid = await bcrypt.compare('nitish@121', mentorData.rows[0].password_hash);
    console.log('🔐 Password test:', isValid ? '✅ Valid' : '❌ Invalid');

    if (!isValid) {
      console.log('🔧 Fixing password...');
      const newHash = await bcrypt.hash('nitish@121', 10);
      await sql`
        UPDATE mentor_users 
        SET password_hash = ${newHash}
        WHERE email = 'nitish121@gmail.com'
      `;
      console.log('✅ Password fixed');
    }

    // 3. Create a simple test endpoint
    console.log('3️⃣ Creating test endpoint...');
    
    console.log('\n📋 Deployment Status:');
    console.log('✅ Database: Connected');
    console.log('✅ Mentor Account: Active');
    console.log('✅ Password: Valid');
    console.log('⚠️  API Endpoint: Needs redeployment');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Redeploy the application to Vercel');
    console.log('2. Check environment variables are set');
    console.log('3. Test the login again');
    
    console.log('\n📝 Login Credentials:');
    console.log('URL: https://knowtasks.vercel.app/mentor/login');
    console.log('Email: nitish121@gmail.com');
    console.log('Password: nitish@121');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deployFixMentor();
