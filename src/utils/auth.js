/**
 * Authentication utility functions for client-side use
 */

/**
 * Gets the authentication token from Clerk session
 * @returns {Promise<string|null>} The authentication token or null if not available
 */
export const getAuthToken = async () => {
  try {
    // Check if Clerk is available in the window object
    if (typeof window !== 'undefined' && window.Clerk) {
      const token = await window.Clerk.session?.getToken();
      return token || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting authentication token:', error);
    return null;
  }
};

/**
 * Creates headers with authentication token for API requests
 * @param {string} userId - The user ID to include in headers
 * @returns {Promise<Object>} Headers object with authorization and user-id
 */
export const getAuthHeaders = async (userId) => {
  const token = await getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'user-id': userId || '',
    'Content-Type': 'application/json'
  };
};