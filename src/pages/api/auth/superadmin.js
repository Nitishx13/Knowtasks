import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Login superadmin
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // First, ensure the superadmin_users table exists
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

      // Check if any superadmin users exist, if not, create default ones
      const existingUsers = await sql`SELECT COUNT(*) as count FROM superadmin_users`;
      
      if (existingUsers.rows[0].count === '0') {
        console.log('No SuperAdmin users found, creating default users...');
        
        const defaultUsers = [
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

        for (const user of defaultUsers) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await sql`
            INSERT INTO superadmin_users (name, email, password_hash, role, status)
            VALUES (${user.name}, ${user.email}, ${hashedPassword}, 'superadmin', 'active')
          `;
        }
        
        console.log('Default SuperAdmin users created successfully');
      }

      const result = await sql`
        SELECT id, name, email, password_hash, role, status, last_login
        FROM superadmin_users 
        WHERE email = ${email} AND status = 'active'
      `;

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const superadmin = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, superadmin.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await sql`
        UPDATE superadmin_users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ${superadmin.id}
      `;

      // Return superadmin data (excluding password hash)
      const { password_hash, ...superadminData } = superadmin;
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: superadminData
      });

    } catch (error) {
      console.error('SuperAdmin login error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        error: 'Login failed', 
        details: error.message,
        code: error.code 
      });
    }

  } else if (req.method === 'PUT') {
    // Create/Update superadmin
    const { name, email, password, status = 'active' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await sql`
        INSERT INTO superadmin_users (name, email, password_hash, status)
        VALUES (${name}, ${email}, ${hashedPassword}, ${status})
        ON CONFLICT (email) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, name, email, role, status, created_at
      `;

      res.status(200).json({
        success: true,
        message: 'SuperAdmin account created/updated successfully',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('SuperAdmin create/update error:', error);
      res.status(500).json({ error: 'Failed to create/update SuperAdmin', details: error.message });
    }

  } else if (req.method === 'GET') {
    // List superadmins
    try {
      const result = await sql`
        SELECT id, name, email, role, status, last_login, created_at
        FROM superadmin_users 
        ORDER BY created_at DESC
      `;

      res.status(200).json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      console.error('SuperAdmin list error:', error);
      res.status(500).json({ error: 'Failed to fetch SuperAdmins', details: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
