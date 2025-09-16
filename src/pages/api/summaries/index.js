import { getAuth } from '../../../utils/serverAuth';
import { Database } from '../../../lib/database';

const database = new Database();

export default async function handler(req, res) {
  try {
    const { userId, error: authError } = await getAuth(req);
    
    if (authError) {
      return res.status(401).json({ error: authError });
    }

    switch (req.method) {
      case 'GET':
        try {
          const summaries = await database.getUserSummaries(userId);
          res.status(200).json({ success: true, summaries });
        } catch (error) {
          console.error('Error fetching summaries:', error);
          res.status(500).json({ error: 'Failed to fetch summaries' });
        }
        break;

      case 'POST':
        try {
          const { documentId, content, title } = req.body;
          
          if (!documentId || !content) {
            return res.status(400).json({ error: 'Document ID and content are required' });
          }

          const summaryData = {
            id: Date.now().toString(),
            userId,
            documentId,
            title: title || 'Document Summary',
            content,
            createdAt: new Date().toISOString()
          };

          const summary = await database.createSummary(summaryData);
          res.status(201).json({ success: true, summary });
        } catch (error) {
          console.error('Error creating summary:', error);
          res.status(500).json({ error: 'Failed to create summary' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
