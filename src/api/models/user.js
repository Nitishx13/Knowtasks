// User model for authentication and user management
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password; // This should be hashed in a real application
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // In a real application, these methods would interact with a database
  static async findByEmail(email) {
    // Mock implementation for development
    if (email === 'test@example.com') {
      return new User({
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password_here', // In real app, this would be properly hashed
        name: 'Test User',
        role: 'user'
      });
    }
    return null;
  }

  static async findById(id) {
    // Mock implementation for development
    if (id === '1') {
      return new User({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      });
    }
    return null;
  }

  // Verify password (in a real app, would use bcrypt or similar)
  async verifyPassword(password) {
    // Mock implementation for development
    return password === 'password123';
  }
}

export default User;