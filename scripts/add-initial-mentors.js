const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

async function addInitialMentors() {
  try {
    console.log('Adding initial mentor data...');
    
    // Hash passwords for initial mentors
    const hashedPassword1 = await bcrypt.hash('physics123', 10);
    const hashedPassword2 = await bcrypt.hash('math456', 10);
    const hashedPassword3 = await bcrypt.hash('chem789', 10);
    
    // Insert initial mentors
    await sql`
      INSERT INTO mentor_users (name, email, password_hash, subject, status, students_count)
      VALUES 
        ('Dr. Sarah Johnson', 'sarah.johnson@knowtasks.com', ${hashedPassword1}, 'Physics', 'active', 25),
        ('Prof. Michael Chen', 'michael.chen@knowtasks.com', ${hashedPassword2}, 'Mathematics', 'active', 18),
        ('Dr. Emily Rodriguez', 'emily.rodriguez@knowtasks.com', ${hashedPassword3}, 'Chemistry', 'pending', 12)
      ON CONFLICT (email) DO NOTHING
    `;
    
    console.log('✓ Initial mentor data added successfully');
    
    // Verify the data was inserted
    const result = await sql`SELECT name, email, subject, status FROM mentor_users ORDER BY created_at`;
    console.log('\nCurrent mentors in database:');
    result.rows.forEach(mentor => {
      console.log(`- ${mentor.name} (${mentor.email}) - ${mentor.subject} - ${mentor.status}`);
    });
    
  } catch (error) {
    console.error('Error adding initial mentors:', error.message);
  }
}

addInitialMentors();
