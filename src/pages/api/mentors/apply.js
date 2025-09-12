import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the form data from the request body
    const {
      name,
      email,
      phone,
      subject,
      specialization,
      experience,
      bio,
      status
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !subject || !experience || !bio) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if the email already exists in the mentor applications
    const existingMentor = await sql`
      SELECT id FROM mentor_users WHERE email = ${email}
    `;
    
    if (existingMentor.rows.length > 0) {
      return res.status(400).json({ error: 'A mentor with this email already exists' });
    }
    
    // Create a new mentor application
    const result = await sql`
      INSERT INTO mentor_users (
        name,
        email,
        phone,
        subject,
        specialization,
        experience,
        bio,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${name},
        ${email},
        ${phone || ''},
        ${subject},
        ${specialization || ''},
        ${experience},
        ${bio},
        ${'pending'}, 
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) RETURNING id
    `;
    
    // Create mentor profile entry
    await sql`
      INSERT INTO mentor_profiles (
        mentor_id, 
        total_students, 
        total_uploads, 
        total_sessions, 
        rating, 
        created_at
      ) VALUES (
        ${result.rows[0].id}, 
        0, 
        0, 
        0, 
        0.0, 
        CURRENT_TIMESTAMP
      )
    `;
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Mentor application submitted successfully',
      mentorId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error submitting mentor application:', error);
    return res.status(500).json({ error: 'Failed to submit mentor application' });
  }
}