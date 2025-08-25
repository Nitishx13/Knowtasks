// Next.js API route for user registration
import { generateToken } from '../../../../api/utils/auth';
import User from '../../../../api/models/user';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { name, email, password } = req.body;
    
    // Validate request data
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Registration failed',
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    try {
      const newUser = User.create({
        name,
        email,
        password,
        role: 'user'
      });
      
      // Create user object for token (exclude sensitive data)
      const userForToken = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      
      // Generate JWT token
      const token = generateToken(userForToken);
      
      // Set HTTP-only cookie with the token
      res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Strict`);
      
      // Return success response with user data and token
      return res.status(201).json({
        success: true,
        user: userForToken,
        token // Also return token in response for client-side storage if needed
      });
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validationError.message
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An error occurred during registration'
    });
  }
}