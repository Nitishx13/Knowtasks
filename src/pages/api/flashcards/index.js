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
        const { subject } = req.query;
        const flashcards = await database.getUserFlashcards(effectiveUserId, subject);
        res.status(200).json({ flashcards });
        break;

      case 'POST':
        const flashcardData = req.body;
        const newFlashcard = await database.createFlashcard(effectiveUserId, flashcardData);
        res.status(201).json({ flashcard: newFlashcard });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Flashcards API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
