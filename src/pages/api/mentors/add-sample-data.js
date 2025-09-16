import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Add sample mentor applications
    const applications = [
      {
        name: 'Nitish',
        email: 'nitish@gmail.com',
        phone: '+1234567890',
        subject: 'Computer Science',
        experience: '3 years',
        bio: 'Experienced software developer and mentor in programming and web development.'
      },
      {
        name: 'Adarsh',
        email: 'adarsh@gmail.com',
        phone: '+1234567891',
        subject: 'Mathematics',
        experience: '5 years',
        bio: 'Mathematics expert with extensive teaching experience in algebra and calculus.'
      }
    ];

    const results = [];
    
    for (const app of applications) {
      const result = await sql`
        INSERT INTO mentor_applications (name, email, phone, subject, experience, bio, status, verified, created_at)
        VALUES (
          ${app.name}, 
          ${app.email}, 
          ${app.phone}, 
          ${app.subject}, 
          ${app.experience}, 
          ${app.bio},
          'pending', 
          false, 
          CURRENT_TIMESTAMP
        ) 
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email, subject, status, created_at
      `;
      
      if (result.rows.length > 0) {
        results.push(result.rows[0]);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Sample mentor applications added successfully',
      applications: results,
      count: results.length
    });

  } catch (error) {
    console.error('Error adding sample data:', error);
    return res.status(500).json({ 
      error: 'Failed to add sample data',
      details: error.message 
    });
  }
}
