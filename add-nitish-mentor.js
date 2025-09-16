const { sql } = require('@vercel/postgres');

async function addNitishMentor() {
  try {
    console.log('Adding mentor application for nitish@gmail.com...');
    
    const result = await sql`
      INSERT INTO mentor_applications (name, email, phone, subject, experience, bio, status, verified, created_at)
      VALUES (
        'Nitish', 
        'nitish@gmail.com', 
        '+1234567890', 
        'Computer Science', 
        '3 years', 
        'Experienced software developer and mentor in programming and web development.',
        'pending', 
        false, 
        CURRENT_TIMESTAMP
      ) RETURNING id, name, email, subject, status, created_at
    `;
    
    console.log('✅ Mentor application added:', result.rows[0]);
    console.log('📝 Status: Pending (waiting for admin approval)');
    console.log('🔗 Admin can create login at: /admin/dashboard?section=Mentor%20Management');
    
  } catch (error) {
    console.error('❌ Error adding mentor application:', error.message);
  }
}

addNitishMentor();
