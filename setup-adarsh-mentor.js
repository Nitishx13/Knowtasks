const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

async function setupAdarshMentor() {
  try {
    console.log('Setting up mentor account for adarsh@gmail.com...');
    
    // First check if mentor exists
    const existing = await sql`
      SELECT id, email, status FROM mentor_users 
      WHERE email = 'adarsh@gmail.com'
    `;
    
    if (existing.rows.length > 0) {
      console.log('Mentor exists:', existing.rows[0]);
      
      // Update existing mentor with new password
      const passwordHash = await bcrypt.hash('8gI9hEq6jQlq', 10);
      const userId = `MENTOR_${existing.rows[0].id}_${Date.now().toString().slice(-6)}`;
      
      await sql`
        UPDATE mentor_users
        SET 
          password_hash = ${passwordHash},
          user_id = ${userId},
          status = 'active',
          verified = true,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.rows[0].id}
      `;
      
      console.log('Updated existing mentor account');
    } else {
      // Create new mentor
      const passwordHash = await bcrypt.hash('8gI9hEq6jQlq', 10);
      const userId = `MENTOR_${Date.now().toString().slice(-6)}`;
      
      const result = await sql`
        INSERT INTO mentor_users (
          name, email, password_hash, user_id, subject, role, status, verified, created_at, updated_at
        ) VALUES (
          'Adarsh', 
          'adarsh@gmail.com', 
          ${passwordHash}, 
          ${userId}, 
          'Mathematics', 
          'mentor', 
          'active', 
          true, 
          CURRENT_TIMESTAMP, 
          CURRENT_TIMESTAMP
        ) RETURNING id, email, name
      `;
      
      console.log('Created new mentor account:', result.rows[0]);
    }
    
    // Verify the account was created/updated properly
    const verification = await sql`
      SELECT id, name, email, status, verified, user_id
      FROM mentor_users 
      WHERE email = 'adarsh@gmail.com'
    `;
    
    console.log('Final mentor account state:', verification.rows[0]);
    console.log('Setup complete! Mentor can now login with adarsh@gmail.com / 8gI9hEq6jQlq');
    
  } catch (error) {
    console.error('Error setting up mentor:', error);
  }
}

setupAdarshMentor();
