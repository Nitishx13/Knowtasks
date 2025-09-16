const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setupMentorSystem() {
  try {
    console.log('🚀 Setting up comprehensive mentor management system...');

    // Create mentor_profiles table
    console.log('1️⃣ Creating mentor_profiles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS mentor_profiles (
        id SERIAL PRIMARY KEY,
        mentor_id INTEGER REFERENCES mentor_users(id) ON DELETE CASCADE,
        total_students INTEGER DEFAULT 0,
        total_uploads INTEGER DEFAULT 0,
        total_sessions INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create students table
    console.log('2️⃣ Creating students table...');
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mentor_id INTEGER REFERENCES mentor_users(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Update mentor_users table with additional fields
    console.log('3️⃣ Updating mentor_users table...');
    try {
      await sql`ALTER TABLE mentor_users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`;
      await sql`ALTER TABLE mentor_users ADD COLUMN IF NOT EXISTS bio TEXT`;
      await sql`ALTER TABLE mentor_users ADD COLUMN IF NOT EXISTS specialization VARCHAR(255)`;
      await sql`ALTER TABLE mentor_users ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0`;
      await sql`ALTER TABLE mentor_users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
    } catch (error) {
      console.log('   Columns may already exist, continuing...');
    }

    // Create mentor profiles for existing mentors
    console.log('4️⃣ Creating profiles for existing mentors...');
    const existingMentors = await sql`
      SELECT id FROM mentor_users 
      WHERE id NOT IN (SELECT mentor_id FROM mentor_profiles WHERE mentor_id IS NOT NULL)
    `;

    for (const mentor of existingMentors.rows) {
      await sql`
        INSERT INTO mentor_profiles (mentor_id, total_students, total_uploads, total_sessions, rating)
        VALUES (${mentor.id}, 0, 0, 0, 0.0)
      `;
    }

    // Create sample students for testing
    console.log('5️⃣ Creating sample students...');
    const sampleStudents = [
      { name: 'John Doe', email: 'john.doe@student.com' },
      { name: 'Jane Smith', email: 'jane.smith@student.com' },
      { name: 'Mike Johnson', email: 'mike.johnson@student.com' },
      { name: 'Sarah Wilson', email: 'sarah.wilson@student.com' },
      { name: 'David Brown', email: 'david.brown@student.com' }
    ];

    // Get Nitish mentor ID
    const nitishMentor = await sql`
      SELECT id FROM mentor_users WHERE email = 'nitish121@gmail.com'
    `;

    if (nitishMentor.rows.length > 0) {
      const mentorId = nitishMentor.rows[0].id;
      
      for (const student of sampleStudents) {
        try {
          await sql`
            INSERT INTO students (name, email, mentor_id, status)
            VALUES (${student.name}, ${student.email}, ${mentorId}, 'active')
            ON CONFLICT (email) DO NOTHING
          `;
        } catch (error) {
          console.log(`   Student ${student.email} may already exist`);
        }
      }

      // Update mentor profile with student count
      const studentCount = await sql`
        SELECT COUNT(*) as count FROM students WHERE mentor_id = ${mentorId}
      `;

      await sql`
        UPDATE mentor_profiles 
        SET total_students = ${studentCount.rows[0].count}
        WHERE mentor_id = ${mentorId}
      `;
    }

    // Create indexes for better performance
    console.log('6️⃣ Creating indexes...');
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_mentor_profiles_mentor_id ON mentor_profiles(mentor_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_students_mentor_id ON students(mentor_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_students_email ON students(email)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_mentor_users_email ON mentor_users(email)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_mentor_users_status ON mentor_users(status)`;
    } catch (error) {
      console.log('   Some indexes may already exist');
    }

    console.log('✅ Mentor management system setup complete!');
    console.log('\n📋 System Features:');
    console.log('• Comprehensive mentor profiles');
    console.log('• Student management and tracking');
    console.log('• Content statistics and analytics');
    console.log('• Secure authentication system');
    console.log('• SuperAdmin mentor creation');
    console.log('• Real-time dashboard with user-specific data');

    console.log('\n🔗 API Endpoints Available:');
    console.log('• POST /api/mentors/create - Create new mentor');
    console.log('• POST /api/mentors/authenticate - Mentor login');
    console.log('• GET /api/mentors/list - List all mentors');

    console.log('\n🎯 Access Points:');
    console.log('• Mentor Login: /mentor/login-new');
    console.log('• Mentor Dashboard: /mentor/dashboard-new');
    console.log('• SuperAdmin: Use ComprehensiveMentorManagement component');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.error('Details:', error.message);
  }
}

setupMentorSystem();
