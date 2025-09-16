const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

// This script should be run on Vercel production to initialize SuperAdmin users
async function initProductionAdmin() {
  try {
    console.log('Initializing SuperAdmin users for production...');
    
    // Create both admin users for production
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
    
    console.log('SuperAdmin table created/verified');
    
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
      
      console.log(`Production SuperAdmin created: ${user.name}`);
      console.log('Email:', user.email);
      console.log('User ID:', result.rows[0].id);
    }
    
    console.log('Production SuperAdmin initialization complete!');
    
  } catch (error) {
    console.error('Error initializing production SuperAdmin:', error);
    throw error;
  }
}

// Export for use in API routes or run directly
if (require.main === module) {
  initProductionAdmin().catch(console.error);
}

module.exports = { initProductionAdmin };
