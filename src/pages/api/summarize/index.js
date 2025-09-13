import { getAuth } from '../../utils/auth';
import { Database } from '../../../lib/database';

const database = new Database();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { userId, error: authError } = await getAuth(req);
    
    if (authError) {
      return res.status(401).json({ error: authError });
    }

    const { documentId, text, type = 'general' } = req.body;
    
    if (!documentId && !text) {
      return res.status(400).json({
        success: false,
        error: 'Document ID or text content is required'
      });
    }
    
    let contentToSummarize = text;
    let documentTitle = 'Text Summary';
    
    // If documentId is provided, fetch the document
    if (documentId) {
      try {
        const documents = await database.getUserDocuments(userId);
        const document = documents.find(doc => doc.id === documentId);
        
        if (!document) {
          return res.status(404).json({ error: 'Document not found' });
        }
        
        contentToSummarize = document.content || document.title;
        documentTitle = document.title;
      } catch (error) {
        console.error('Error fetching document:', error);
        return res.status(500).json({ error: 'Failed to fetch document' });
      }
    }
    
    // Generate summary using AI or mock function
    const summaryContent = await generateSummary(contentToSummarize, type);
    
    // Create summary record in database
    try {
      const summaryData = {
        id: Date.now().toString(),
        userId,
        documentId: documentId || null,
        title: `Summary: ${documentTitle}`,
        content: summaryContent,
        createdAt: new Date().toISOString()
      };

      const summary = await database.createSummary(summaryData);
      
      res.status(200).json({
        success: true,
        summary: {
          id: summary.id,
          title: summary.title,
          content: summary.content,
          created_at: summary.created_at
        },
        originalLength: contentToSummarize.length,
        summaryLength: summaryContent.length,
        type
      });
    } catch (error) {
      console.error('Error creating summary:', error);
      res.status(500).json({ error: 'Failed to create summary' });
    }
  } catch (error) {
    console.error('Summarization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to generate a summary (mock implementation)
async function generateSummary(text, type = 'general') {
  // In production, this would call OpenAI API or another AI service
  // For demo purposes, we'll create a more intelligent mock summary
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(' ');
  
  let summaryLength;
  switch (type) {
    case 'concise':
      summaryLength = Math.max(1, Math.floor(sentences.length * 0.2));
      break;
    case 'detailed':
      summaryLength = Math.max(3, Math.floor(sentences.length * 0.5));
      break;
    case 'general':
    default:
      summaryLength = Math.max(2, Math.floor(sentences.length * 0.3));
      break;
  }
  
  // Take the first few sentences as a simple summary
  const summarySentences = sentences.slice(0, summaryLength);
  let summary = summarySentences.join('. ').trim();
  
  if (summary && !summary.endsWith('.')) {
    summary += '.';
  }
  
  // Add some educational context for students
  if (summary.length < 50) {
    summary = `Key points from the document: ${summary}`;
  }
  
  return summary || 'This document contains important information that can be studied further.';
}