const { sql } = require('@vercel/postgres');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all summaries
      const result = await sql`
        SELECT * FROM summaries 
        ORDER BY created_at DESC
      `;
      
      res.status(200).json({
        success: true,
        summaries: result.rows
      });
      
    } else if (req.method === 'POST') {
      // Save a new summary
      const { title, content, keyPoints, fileName, fileUrl, wordCount, documentType, estimatedPages } = req.body;
      
      if (!title || !content || !fileName) {
        return res.status(400).json({ error: 'Title, content, and filename are required' });
      }
      
      const result = await sql`
        INSERT INTO summaries (title, content, key_points, file_name, file_url, word_count, document_type, estimated_pages)
        VALUES (${title}, ${content}, ${keyPoints || []}, ${fileName}, ${fileUrl || ''}, ${wordCount || 0}, ${documentType || 'PDF'}, ${estimatedPages || 1})
        RETURNING *
      `;
      
      res.status(201).json({
        success: true,
        summary: result.rows[0]
      });
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Library API error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}
