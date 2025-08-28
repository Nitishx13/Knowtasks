const { generateSummary } = require('../../src/lib/langchain');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key is not configured',
        details: 'Please set OPENAI_API_KEY in your environment variables'
      });
    }

    const { text, fileName } = req.body;

    if (!text || !fileName) {
      return res.status(400).json({ error: 'Text and filename are required' });
    }

    console.log('Testing summarization with:', { fileName, textLength: text.length });

    // Generate AI summary
    const summary = await generateSummary(text, fileName);
    
    if (!summary) {
      return res.status(500).json({ error: 'Failed to generate summary' });
    }

    res.status(200).json({
      success: true,
      summary: {
        title: summary.title,
        content: summary.content,
        keyPoints: summary.keyPoints,
        wordCount: summary.wordCount
      }
    });

  } catch (error) {
    console.error('Test summarization error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}
