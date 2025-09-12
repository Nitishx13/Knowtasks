import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Initializing SuperAdmin users...');
    
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
    
    const createdUsers = [];
    
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
      
      createdUsers.push({
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role,
        status: result.rows[0].status
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'SuperAdmin users initialized successfully',
      users: createdUsers
    });
    
  } catch (error) {
    console.error('Error initializing SuperAdmin users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize SuperAdmin users',
      details: error.message
    });
  }
}
