const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function createSuperAdmin() {
  try {
    console.log('Creating SuperAdmin user...');
    
    const name = 'Super Admin';
    const email = 'admin@knowtasks.com';
    const password = 'admin123';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // First, ensure the table exists
    await sql`
      CREATE TABLE IF NOT EXISTS superadmin_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'superadmin',
        status VARCHAR(20) DEFAULT 'active',
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
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
    
    console.log('SuperAdmin created successfully!');
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User data:', result.rows[0]);
    
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
  }
}

createSuperAdmin();
