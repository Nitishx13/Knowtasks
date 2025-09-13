import database from '../../../lib/database';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await database.initialize();

    const { userId } = getAuth(req);
    const testUserId = req.headers['x-test-user-id'] || 'test_user_123';
    const effectiveUserId = userId || (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' ? testUserId : null);
    
    if (!effectiveUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await database.getUserStats(effectiveUserId);
    
    // Calculate additional metrics
    const totalItems = stats.documents + stats.summaries + stats.notes + stats.flashcards;
    const estimatedTimeSaved = stats.summaries * 15; // 15 minutes per summary
    
    res.status(200).json({
      ...stats,
      totalItems,
      estimatedTimeSaved,
      monthlyUsage: Math.min(100, totalItems * 5) + '%'
    });
  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
