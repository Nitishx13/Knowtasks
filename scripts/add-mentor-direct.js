const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function addMentorDirect() {
  try {
    console.log('🔧 Adding mentor directly to database...');

    // Mentor details - MODIFY THESE VALUES
    const mentorData = {
      name: 'Dr. Alex Thompson',
      email: 'alex.thompson@mentor.com',
      password: 'MentorPass123!',
      subject: 'Physics',
      phone: '+1-555-0456',
      bio: 'Expert physics teacher specializing in quantum mechanics and thermodynamics',
      specialization: 'Quantum Physics, Thermodynamics',
      experience: 8,
      status: 'active',
      role: 'mentor'
    };

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(mentorData.password, saltRounds);

    // Insert mentor user
    const mentorResult = await sql`
      INSERT INTO mentor_users (
        name, email, password_hash, subject, phone, bio, 
        specialization, experience, status, role, created_at
      ) VALUES (
        ${mentorData.name},
        ${mentorData.email},
        ${hashedPassword},
        ${mentorData.subject},
        ${mentorData.phone},
        ${mentorData.bio},
        ${mentorData.specialization},
        ${mentorData.experience},
        ${mentorData.status},
        ${mentorData.role},
        CURRENT_TIMESTAMP
      ) RETURNING id, name, email, subject
    `;

    const mentorId = mentorResult.rows[0].id;

    // Create mentor profile
    await sql`
      INSERT INTO mentor_profiles (
        mentor_id, total_students, total_uploads, total_sessions, rating, created_at
      ) VALUES (
        ${mentorId}, 0, 0, 0, 0.0, CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Mentor added successfully!');
    console.log('📋 Mentor Details:');
    console.log(`   ID: ${mentorId}`);
    console.log(`   Name: ${mentorData.name}`);
    console.log(`   Email: ${mentorData.email}`);
    console.log(`   Subject: ${mentorData.subject}`);
    console.log(`   Status: ${mentorData.status}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${mentorData.email}`);
    console.log(`   Password: ${mentorData.password}`);
    
    console.log('\n🌐 Access URLs:');
    console.log('   Login: /mentor/login-new');
    console.log('   Dashboard: /mentor/dashboard-new');

  } catch (error) {
    if (error.message.includes('duplicate key')) {
      console.error('❌ Mentor with this email already exists!');
    } else {
      console.error('❌ Failed to add mentor:', error.message);
    }
  }
}

addMentorDirect();
