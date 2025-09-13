import database from '../../../lib/database';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  try {
    await database.initialize();

    const { userId } = getAuth(req);
    const testUserId = req.headers['x-test-user-id'] || 'test_user_123';
    const effectiveUserId = userId || (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' ? testUserId : null);
    
    if (!effectiveUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const { subject, category, limit } = req.query;
        const filters = { subject, category, limit: limit ? parseInt(limit) : null };
        const documents = await database.getUserDocuments(effectiveUserId, filters);
        res.status(200).json({ documents });
        break;

      case 'POST':
        const documentData = req.body;
        const newDocument = await database.createDocument(effectiveUserId, documentData);
        res.status(201).json({ document: newDocument });
        break;

      case 'DELETE':
        const { documentId } = req.body;
        const deleted = await database.deleteDocument(documentId, effectiveUserId);
        if (deleted) {
          res.status(200).json({ message: 'Document deleted successfully' });
        } else {
          res.status(404).json({ error: 'Document not found or unauthorized' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Documents API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
