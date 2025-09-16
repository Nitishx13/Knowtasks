import { getAuth as clerkGetAuth } from '@clerk/nextjs/server';

/**
 * Server-side authentication utility for API routes
 * @param {Object} req - Next.js request object
 * @returns {Promise<Object>} Object containing userId and potential error
 */
export async function getAuth(req) {
  try {
    // For development/testing mode
    if (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true') {
      const testUserId = req.headers['x-test-user-id'] || 'test_user_123';
      return { userId: testUserId, error: null };
    }

    // Use Clerk's server-side auth
    const { userId } = clerkGetAuth(req);
    
    if (!userId) {
      return { userId: null, error: 'Unauthorized - No valid session' };
    }

    return { userId, error: null };
  } catch (error) {
    console.error('Server auth error:', error);
    return { userId: null, error: 'Authentication failed' };
  }
}

/**
 * Middleware to check if user is authenticated
 * @param {Function} handler - API route handler
 * @returns {Function} Wrapped handler with auth check
 */
export function withAuth(handler) {
  return async (req, res) => {
    const { userId, error } = await getAuth(req);
    
    if (error) {
      return res.status(401).json({ error });
    }
    
    // Add userId to request for handler to use
    req.userId = userId;
    
    return handler(req, res);
  };
}
