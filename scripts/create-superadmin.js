const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function createSuperAdmin() {
  try {
    console.log('Creating SuperAdmin user...');
    
    // Create both admin users
    const users = [
      {
        name: 'Super Admin',
        email: 'admin@knowtasks.com',
        password: 'admin123'
      },
      {
        name: 'Nitish Kumar',
        email: 'nitishx13@gmail.com',
        password: 'nitish@9899'
      }
    ];
    
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
    
    // Insert or update each SuperAdmin user
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const result = await sql`
        INSERT INTO superadmin_users (name, email, password_hash, role, status)
        VALUES (${user.name}, ${user.email}, ${hashedPassword}, 'superadmin', 'active')
        ON CONFLICT (email) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, name, email, role, status
      `;
      
      console.log(`SuperAdmin created successfully: ${user.name}`);
      console.log('Email:', user.email);
      console.log('Password:', user.password);
      console.log('User data:', result.rows[0]);
      console.log('---');
    }
    
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
  }
}

createSuperAdmin();
