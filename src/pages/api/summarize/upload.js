const { sql } = require('@vercel/postgres');
const { extractTextFromPDF, generateSummary, analyzeDocumentStructure } = require('../../../lib/langchain');
const path = require('path');
const fs = require('fs');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileUrl, fileName } = req.body;

    if (!fileUrl || !fileName) {
      return res.status(400).json({ error: 'File URL and filename are required' });
    }

    console.log('Processing PDF for summarization:', { fileUrl, fileName });

    // Test database connection
    await sql`SELECT NOW()`;

    // Create summaries table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS summaries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        key_points TEXT[] DEFAULT '{}',
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        word_count INTEGER DEFAULT 0,
        document_type VARCHAR(100) DEFAULT 'PDF',
        estimated_pages INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Convert file URL to local path
    const filePath = path.join(process.cwd(), 'public', fileUrl.replace('/uploads/', 'uploads/'));
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Extract text from PDF
    const text = await extractTextFromPDF(filePath);
    if (!text) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Generate AI summary
    const summary = await generateSummary(text, fileName);
    if (!summary) {
      return res.status(500).json({ error: 'Failed to generate summary' });
    }

    // Analyze document structure
    const structure = await analyzeDocumentStructure(text);

    // Save summary to database
    const result = await sql`
      INSERT INTO summaries (title, content, key_points, file_name, file_url, word_count, document_type, estimated_pages)
      VALUES (${summary.title}, ${summary.content}, ${summary.keyPoints}, ${fileName}, ${fileUrl}, ${summary.wordCount}, 'PDF', ${structure.estimatedPages})
      RETURNING *
    `;

    const savedSummary = result.rows[0];
    console.log('Summary saved to database:', savedSummary);

    res.status(200).json({
      success: true,
      summary: {
        title: summary.title,
        content: summary.content,
        keyPoints: summary.keyPoints,
        wordCount: summary.wordCount,
        estimatedPages: structure.estimatedPages,
        documentStructure: structure
      }
    });

  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}
