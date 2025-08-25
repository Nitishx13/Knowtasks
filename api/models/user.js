// User model schema

/**
 * User schema definition
 * In a real application, this would be a database model
 * using MongoDB, PostgreSQL, or another database
 */
class User {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.email = data.email || '';
    this.password = data.password || ''; // In production, this would be hashed
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Validate user data
   * @returns {Object} - Validation result with success and error message
   */
  validate() {
    if (!this.email) {
      return { success: false, message: 'Email is required' };
    }
    
    if (!this.email.includes('@')) {
      return { success: false, message: 'Invalid email format' };
    }
    
    if (!this.password) {
      return { success: false, message: 'Password is required' };
    }
    
    if (this.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }
    
    if (!this.name) {
      return { success: false, message: 'Name is required' };
    }
    
    return { success: true };
  }

  /**
   * Hash a password (mock implementation)
   * In production, use a proper password hashing library like bcrypt
   * @param {string} password - Plain text password
   * @returns {string} - Hashed password
   */
  static hashPassword(password) {
    // This is a mock implementation
    // In production, use bcrypt or similar
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
  }

  /**
   * Compare a password with a hashed password (mock implementation)
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {boolean} - Whether the password matches
   */
  static comparePassword(password, hashedPassword) {
    // This is a mock implementation
    // In production, use bcrypt or similar
    const hashedInput = User.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  /**
   * Mock database of users
   * In production, this would be a real database
   */
  static users = [
    {
      id: '1',
      email: 'user@example.com',
      // This is 'password' hashed with our mock implementation
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      name: 'Example User',
      role: 'user',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '2',
      email: 'test@test.com',
      // This is 'password123' hashed with our mock implementation
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      name: 'Test User',
      role: 'user',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '3',
      email: 'test@example.com',
      // This is 'password123' hashed with our mock implementation
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      name: 'Test Example User',
      role: 'user',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ];

  /**
   * Find a user by email
   * @param {string} email - Email to search for
   * @returns {Object|null} - User object or null if not found
   */
  static findByEmail(email) {
    return User.users.find(user => user.email === email) || null;
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID to search for
   * @returns {Object|null} - User object or null if not found
   */
  static findById(id) {
    return User.users.find(user => user.id === id) || null;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} - Created user
   */
  static create(userData) {
    const user = new User(userData);
    const validation = user.validate();
    
    if (!validation.success) {
      throw new Error(validation.message);
    }
    
    // Hash the password before storing
    user.password = User.hashPassword(user.password);
    
    // Add to mock database
    User.users.push(user);
    
    return user;
  }
}

export default User;