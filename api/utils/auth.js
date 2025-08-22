// Authentication utilities for the backend

/**
 * Generate a mock JWT token
 * In a real implementation, you would use a library like jsonwebtoken
 * @param {Object} user - User object to encode in the token
 * @returns {string} - JWT token
 */
export function generateToken(user) {
  // This is a mock implementation
  // In production, use a proper JWT library
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };
  
  // Convert payload to base64
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
  
  // In a real implementation, you would sign this with a secret key
  return `mock-jwt-header.${encodedPayload}.mock-jwt-signature`;
}

/**
 * Verify a JWT token
 * In a real implementation, you would verify the signature
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    // In a real implementation, you would verify the signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Middleware to authenticate requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function to call if authenticated
 */
export function authenticate(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Attach user info to request
  req.user = {
    id: payload.sub,
    email: payload.email,
    name: payload.name
  };
  
  // Call next function
  return next(req, res);
}