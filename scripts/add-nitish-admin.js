const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function addNitishAdmin() {
  try {
    console.log('Adding Nitish as SuperAdmin user...');
    
    const name = 'Nitish Kumar';
    const email = 'nitishx13@gmail.com';
    const password = 'nitish@9899';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert or update SuperAdmin
    const result = await sql`
      INSERT INTO superadmin_users (name, email, password_hash, role, status)
      VALUES (${name}, ${email}, ${hashedPassword}, 'superadmin', 'active')
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, name, email, role, status
    `;
    
    console.log('Nitish SuperAdmin created successfully!');
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User data:', result.rows[0]);
    
  } catch (error) {
    console.error('Error creating Nitish SuperAdmin:', error);
  } finally {
    process.exit();
  }
}

addNitishAdmin();
