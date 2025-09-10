import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Login mentor
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const result = await sql`
        SELECT id, name, email, password_hash, subject, role, status, last_login
        FROM mentor_users 
        WHERE email = ${email} AND status = 'active'
      `;

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const mentor = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, mentor.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await sql`
        UPDATE mentor_users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ${mentor.id}
      `;

      // Return mentor data (excluding password hash)
      const { password_hash, ...mentorData } = mentor;
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: mentorData
      });

    } catch (error) {
      console.error('Mentor login error:', error);
      res.status(500).json({ error: 'Login failed', details: error.message });
    }

  } else if (req.method === 'PUT') {
    // Create/Update mentor
    const { name, email, password, subject, status = 'active' } = req.body;

    if (!name || !email || !password || !subject) {
      return res.status(400).json({ error: 'Name, email, password, and subject are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await sql`
        INSERT INTO mentor_users (name, email, password_hash, subject, status)
        VALUES (${name}, ${email}, ${hashedPassword}, ${subject}, ${status})
        ON CONFLICT (email) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          subject = EXCLUDED.subject,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, name, email, subject, role, status, created_at
      `;

      res.status(200).json({
        success: true,
        message: 'Mentor account created/updated successfully',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Mentor create/update error:', error);
      res.status(500).json({ error: 'Failed to create/update mentor', details: error.message });
    }

  } else if (req.method === 'GET') {
    // List mentors
    try {
      const result = await sql`
        SELECT id, name, email, subject, role, status, students_count, last_login, created_at
        FROM mentor_users 
        ORDER BY created_at DESC
      `;

      res.status(200).json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      console.error('Mentor list error:', error);
      res.status(500).json({ error: 'Failed to fetch mentors', details: error.message });
    }

  } else if (req.method === 'DELETE') {
    // Delete mentor
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Mentor ID is required' });
    }

    try {
      await sql`DELETE FROM mentor_users WHERE id = ${id}`;
      res.status(200).json({ success: true, message: 'Mentor deleted successfully' });

    } catch (error) {
      console.error('Mentor delete error:', error);
      res.status(500).json({ error: 'Failed to delete mentor', details: error.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
