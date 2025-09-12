const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function setupMentorTable() {
  try {
    console.log('Setting up mentor_users table...');
    
    // Create mentor_users table with proper structure
    await sql`
      CREATE TABLE IF NOT EXISTS mentor_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'mentor',
        status VARCHAR(20) DEFAULT 'active',
        students_count INTEGER DEFAULT 0,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ mentor_users table created/verified');
    
    // Check if mentors already exist
    const existingMentors = await sql`SELECT COUNT(*) as count FROM mentor_users`;
    
    if (existingMentors.rows[0].count > 0) {
      console.log(`📊 Found ${existingMentors.rows[0].count} existing mentors in database`);
      
      // Show existing mentors
      const mentors = await sql`SELECT id, name, email, subject, status FROM mentor_users ORDER BY created_at`;
      console.log('\n📋 Current Mentors:');
      mentors.rows.forEach(mentor => {
        console.log(`  - ${mentor.name} (${mentor.email}) - ${mentor.subject} [${mentor.status}]`);
      });
      return;
    }
    
    console.log('📝 Adding initial mentors...');
    
    // Add initial mentors
    const initialMentors = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@knowtasks.com',
        password: 'physics123',
        subject: 'Physics'
      },
      {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@knowtasks.com',
        password: 'math456',
        subject: 'Mathematics'
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@knowtasks.com',
        password: 'chem789',
        subject: 'Chemistry'
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@knowtasks.com',
        password: 'bio123',
        subject: 'Biology'
      },
      {
        name: 'Prof. Lisa Wang',
        email: 'lisa.wang@knowtasks.com',
        password: 'cs456',
        subject: 'Computer Science'
      }
    ];
    
    for (const mentor of initialMentors) {
      const hashedPassword = await bcrypt.hash(mentor.password, 10);
      
      const result = await sql`
        INSERT INTO mentor_users (name, email, password_hash, subject, status)
        VALUES (${mentor.name}, ${mentor.email}, ${hashedPassword}, ${mentor.subject}, 'active')
        RETURNING id, name, email, subject, status
      `;
      
      console.log(`✅ Added: ${mentor.name} - ${mentor.subject}`);
      console.log(`   Login: ${mentor.email} / ${mentor.password}`);
    }
    
    console.log('\n🎉 Mentor setup completed successfully!');
    console.log('\n📋 All Mentors can now login at: /mentor/login');
    
  } catch (error) {
    console.error('❌ Error setting up mentor table:', error);
  }
}

setupMentorTable();
