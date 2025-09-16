require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function createMentorForTestUser() {
  try {
    console.log('Creating mentor record for test_user_123...');
    
    // Check if mentor already exists
    const existingMentor = await sql`
      SELECT * FROM mentor_users WHERE user_id = 'test_user_123'
    `;
    
    if (existingMentor.rows.length > 0) {
      console.log('✅ Mentor already exists for test_user_123:', existingMentor.rows[0]);
      return;
    }
    
    // Create mentor record for the test user
    const result = await sql`
      INSERT INTO mentor_users (
        user_id, 
        name, 
        email, 
        password_hash, 
        subject, 
        experience,
        role, 
        status, 
        created_at
      ) VALUES (
        'test_user_123',
        'Test Dashboard Mentor',
        'dashboard.mentor@example.com',
        'hashed_password_dashboard',
        'mathematics',
        3,
        'mentor',
        'active',
        NOW()
      )
      RETURNING *
    `;
    
    console.log('✅ Mentor created successfully for test_user_123:', result.rows[0]);
    
    // Verify the mentor was created
    const verification = await sql`
      SELECT * FROM mentor_users WHERE user_id = 'test_user_123'
    `;
    
    console.log('✅ Verification - mentor exists:', verification.rows[0]);
    
  } catch (error) {
    console.error('❌ Error creating mentor:', error.message);
  }
}

createMentorForTestUser();
