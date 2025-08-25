// Authentication utilities for the backend
import crypto from 'crypto';

// Secret key for JWT signing - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';

/**
 * Generate a JWT token
 * @param {Object} user - User object to encode in the token
 * @returns {string} - JWT token
 */
export function generateToken(user) {
  // Create JWT header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  // Create JWT payload
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };
  
  // Encode header and payload
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64url');
  
  // Return complete JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    // Split token into parts
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(signatureInput)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      console.error('Invalid token signature');
      return null;
    }
    
    // Decode the payload
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      console.error('Token has expired');
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