import jwt from 'jsonwebtoken';

// Generate JWT token for authenticated users
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user'
  };

  // Sign the token with a secret key and set expiration
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback_secret_key_for_development',
    { expiresIn: '24h' }
  );
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key_for_development'
    );
  } catch (error) {
    return null;
  }
}

// Middleware to authenticate requests
export function authenticate(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid token.' });
    }
    
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Invalid token.' });
  }
}