import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Create table if it doesn't exist
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

      // Check if users exist, if not create them
      const userCount = await sql`SELECT COUNT(*) as count FROM superadmin_users`;
      
      if (parseInt(userCount.rows[0].count) === 0) {
        const hashedPassword1 = await bcrypt.hash('admin123', 10);
        const hashedPassword2 = await bcrypt.hash('nitish@9899', 10);
        
        await sql`
          INSERT INTO superadmin_users (name, email, password_hash) VALUES 
          ('Super Admin', 'admin@knowtasks.com', ${hashedPassword1}),
          ('Nitish Kumar', 'nitishx13@gmail.com', ${hashedPassword2})
        `;
      }

      // Authenticate user
      const result = await sql`
        SELECT id, name, email, password_hash, role, status, last_login
        FROM superadmin_users 
        WHERE email = ${email} AND status = 'active'
      `;

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const admin = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, admin.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await sql`
        UPDATE superadmin_users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ${admin.id}
      `;

      const { password_hash, ...adminData } = admin;
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: adminData
      });

    } catch (error) {
      console.error('SuperAdmin login error:', error);
      res.status(500).json({ 
        error: 'Login failed', 
        details: error.message 
      });
    }

  } else if (req.method === 'GET') {
    // Get dashboard stats
    try {
      const [userStats, mentorStats, uploadStats] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`.catch(() => ({ rows: [{ count: 0 }] })),
        sql`SELECT COUNT(*) as count FROM mentors WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`.catch(() => ({ rows: [{ count: 0 }] })),
        sql`SELECT COUNT(*) as count FROM uploads WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`.catch(() => ({ rows: [{ count: 0 }] }))
      ]);

      res.status(200).json({
        success: true,
        data: {
          newUsers: parseInt(userStats.rows[0].count),
          newMentors: parseInt(mentorStats.rows[0].count),
          newUploads: parseInt(uploadStats.rows[0].count),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(200).json({
        success: true,
        data: {
          newUsers: 0,
          newMentors: 0,
          newUploads: 0,
          timestamp: new Date().toISOString()
        }
      });
    }

  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
