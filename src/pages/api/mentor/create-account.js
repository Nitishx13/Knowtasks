import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = 'adarsh@gmail.com';
    const password = '8gI9hEq6jQlq';
    
    // Check if mentor already exists
    const existing = await sql`
      SELECT id, email, status FROM mentor_users 
      WHERE email = ${email}
    `;
    
    if (existing.rows.length > 0) {
      // Update existing mentor
      const passwordHash = await bcrypt.hash(password, 10);
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
      
      return res.status(200).json({
        success: true,
        message: 'Mentor account updated successfully',
        action: 'updated'
      });
    } else {
      // Create new mentor
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = `MENTOR_${Date.now().toString().slice(-6)}`;
      
      const result = await sql`
        INSERT INTO mentor_users (
          name, email, password_hash, user_id, subject, role, status, verified, created_at, updated_at
        ) VALUES (
          'Adarsh', 
          ${email}, 
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
      
      return res.status(201).json({
        success: true,
        message: 'Mentor account created successfully',
        mentor: result.rows[0],
        action: 'created'
      });
    }
    
  } catch (error) {
    console.error('Error creating mentor account:', error);
    return res.status(500).json({ 
      error: 'Failed to create mentor account',
      details: error.message 
    });
  }
}
