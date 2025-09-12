import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection error: POSTGRES_URL not found');
      return res.status(500).json({ 
        error: 'Database configuration error',
        success: false
      });
    }

    const { title, description, subject, quizData } = req.body;
    
    if (!title || !quizData) {
      return res.status(400).json({ error: 'Title and quiz data are required' });
    }

    // Convert quiz data to JSON string
    const quizContent = JSON.stringify(quizData);
    
    // Save quiz to database
    const result = await sql`
      INSERT INTO qz_files (
        title, description, subject, file_path, file_type, file_size,
        is_favorite, created_at, updated_at
      ) VALUES (
        ${title}, ${description || ''}, ${subject || 'Quiz'}, ${quizContent},
        ${'.json'}, ${quizContent.length}, ${false}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING id
    `;

    res.status(200).json({
      success: true,
      quiz: {
        id: result.rows[0].id,
        title: title,
        description: description || '',
        subject: subject || 'Quiz',
        file_type: '.json',
        file_size: quizContent.length,
        created_at: new Date().toISOString()
      },
      message: 'Quiz saved successfully'
    });

  } catch (error) {
    console.error('Quiz save error:', error);
    res.status(500).json({ 
      error: 'Failed to save quiz',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      success: false
    });
  }
}