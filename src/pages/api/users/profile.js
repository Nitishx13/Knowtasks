import database from '../../../lib/database';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  try {
    // Initialize database
    await database.initialize();

    const { userId } = getAuth(req);
    
    // Handle test auth
    const testUserId = req.headers['x-test-user-id'] || 'test_user_123';
    const effectiveUserId = userId || (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' ? testUserId : null);
    
    if (!effectiveUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const user = await database.getUserById(effectiveUserId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
        break;

      case 'PUT':
        const updates = req.body;
        const updatedUser = await database.updateUser(effectiveUserId, updates);
        res.status(200).json({ user: updatedUser });
        break;

      case 'POST':
        // Create or sync user
        const userData = req.body;
        const newUser = await database.createUser({
          id: effectiveUserId,
          clerkId: userId,
          ...userData
        });
        res.status(201).json({ user: newUser });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'POST']);
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
