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
      experience,
      bio,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !experience) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'subject', 'experience']
      });
    }

    // Check if mentor already applied (skip for now to test)
    try {
      const existingApplication = await sql`
        SELECT id FROM mentor_applications 
        WHERE email = ${email.toLowerCase().trim()}
      `;

      if (existingApplication.rows.length > 0) {
        return res.status(409).json({ 
          error: 'Application already exists for this email'
        });
      }
    } catch (checkError) {
      console.log('Error checking existing applications (continuing anyway):', checkError.message);
    }

    // Insert application record only - no automatic account creation
    const applicationResult = await sql`
      INSERT INTO mentor_applications (name, email, phone, subject, experience, bio, status, verified, created_at)
      VALUES (${name}, ${email.toLowerCase().trim()}, ${phone}, ${subject}, ${experience}, ${bio || ''}, 'pending', false, CURRENT_TIMESTAMP)
      RETURNING id, name, email, subject, status, created_at
    `;
    
    // Return success response - application submitted for admin review
    return res.status(201).json({
      success: true,
      message: 'Mentor application submitted successfully! Please wait for admin approval.',
      application: applicationResult.rows[0],
      status: 'pending_review'
    });
  } catch (error) {
    console.error('Error submitting mentor application:', error);
    return res.status(500).json({ 
      error: 'Failed to submit mentor application',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}