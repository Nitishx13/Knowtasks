import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, description, keyPoints, examples, subject, chapter, difficulty, userId } = req.body;

    if (!title || !description || !subject || !userId) {
      return res.status(400).json({ error: 'Missing required fields: title, description, subject, userId' });
    }

    // Insert concept into database
    const result = await sql`
      INSERT INTO concepts (
        title, description, key_points, examples, subject, chapter, difficulty, user_id, created_at
      ) VALUES (
        ${title}, ${description}, ${keyPoints || ''}, ${examples || ''}, 
        ${subject}, ${chapter || ''}, ${difficulty || 'medium'}, ${userId}, NOW()
      ) RETURNING id
    `;

    const conceptId = result.rows[0].id;

    res.status(200).json({ 
      success: true, 
      conceptId,
      message: `Concept "${title}" saved successfully for ${subject}` 
    });

  } catch (error) {
    console.error('Error saving concept:', error);
    
    // Handle specific database errors
    if (error.message.includes('relation "concepts" does not exist')) {
      return res.status(500).json({ 
        error: 'Database table not found. Please run database setup first.',
        details: 'The concepts table needs to be created.'
      });
    }

    res.status(500).json({ 
      error: 'Failed to save concept',
      details: error.message 
    });
  }
}
