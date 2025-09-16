require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function createTestMentor() {
  try {
    console.log('Creating test mentor in mentor_users table...');
    
    // First, check if the table exists and its structure
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_users'
      ORDER BY ordinal_position;
    `;
    
    console.log('mentor_users table columns:', tableInfo.rows);
    
    // Check if mentor already exists
    const existingMentor = await sql`
      SELECT * FROM mentor_users WHERE user_id = 'mentor_test_123'
    `;
    
    if (existingMentor.rows.length > 0) {
      console.log('Test mentor already exists:', existingMentor.rows[0]);
      return;
    }
    
    // Create test mentor record
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
        'mentor_test_123',
        'Dr. Test Mentor',
        'test.mentor@example.com',
        'hashed_password_123',
        'physics',
        5,
        'mentor',
        'active',
        NOW()
      )
      RETURNING *
    `;
    
    console.log('✅ Test mentor created successfully:', result.rows[0]);
    
    // Verify the mentor was created
    const verification = await sql`
      SELECT * FROM mentor_users WHERE user_id = 'mentor_test_123'
    `;
    
    console.log('✅ Verification - mentor exists:', verification.rows[0]);
    
  } catch (error) {
    console.error('❌ Error creating test mentor:', error.message);
    console.error('Full error:', error);
  }
}

createTestMentor();
