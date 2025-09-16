const { sql } = require('@vercel/postgres');

// Database operations for users
async function createUser(userId, userData) {
  try {
    const result = await sql`
      INSERT INTO users (id, name, email, created_at, updated_at)
      VALUES (${userId}, ${userData.name || 'Unknown User'}, ${userData.email || 'unknown@example.com'}, NOW(), NOW())
      ON CONFLICT (id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        updated_at = NOW()
      RETURNING *
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

// Document storage functions
async function createDocument(userId, documentData) {
  try {
    const result = await sql`
      INSERT INTO documents (user_id, file_name, file_url, file_size, file_type, upload_date, status)
      VALUES (${userId}, ${documentData.fileName}, ${documentData.fileUrl}, ${documentData.fileSize || 0}, ${documentData.fileType || 'unknown'}, NOW(), 'uploaded')
      RETURNING *
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

async function getUserDocuments(userId) {
  try {
    const result = await sql`
      SELECT * FROM documents 
      WHERE user_id = ${userId}
      ORDER BY upload_date DESC
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user documents:', error);
    throw error;
  }
}

// Database operations for summaries
async function createSummary(userId, summaryData) {
  try {
    const result = await sql`
      INSERT INTO summaries (user_id, title, content, key_points, file_name, file_url, word_count, document_type, estimated_pages, created_at, updated_at)
      VALUES (${userId}, ${summaryData.title}, ${summaryData.content}, ${summaryData.keyPoints}, ${summaryData.fileName}, ${summaryData.fileUrl}, ${summaryData.wordCount}, ${summaryData.documentType}, ${summaryData.estimatedPages}, NOW(), NOW())
      RETURNING *
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating summary:', error);
    throw error;
  }
}

async function getUserSummaries(userId) {
  try {
    const result = await sql`
      SELECT * FROM summaries 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user summaries:', error);
    throw error;
  }
}

async function getSummaryById(summaryId) {
  try {
    const result = await sql`
      SELECT s.*, u.id as user_id 
      FROM summaries s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ${summaryId}
    `;
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const summary = result.rows[0];
    summary.userId = summary.user_id;
    delete summary.user_id;
    
    return summary;
  } catch (error) {
    console.error('Error getting summary by ID:', error);
    throw error;
  }
}

async function deleteSummary(summaryId, userId = null) {
  try {
    if (userId) {
      // Delete summary owned by specific user
      const result = await sql`
        DELETE FROM summaries 
        WHERE id = ${summaryId} AND user_id = ${userId}
        RETURNING id
      `;
      
      return result.rows.length > 0;
    } else {
      // Delete any summary with the given ID (admin operation)
      const result = await sql`
        DELETE FROM summaries 
        WHERE id = ${summaryId}
        RETURNING id
      `;
      
      return result.rows.length > 0;
    }
  } catch (error) {
    console.error('Error deleting summary:', error);
    throw error;
  }
}

// Initialize database schema
async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_size BIGINT DEFAULT 0,
        file_type VARCHAR(100) DEFAULT 'unknown',
        upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'uploaded',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create summaries table
    await sql`
      CREATE TABLE IF NOT EXISTS summaries (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        key_points TEXT[] DEFAULT '{}',
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        word_count INTEGER DEFAULT 0,
        document_type VARCHAR(100) DEFAULT 'PDF',
        estimated_pages INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_id ON users(id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON summaries(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries(created_at)`;
    
    // Create text_files table with proper foreign key constraint
    await sql`
      CREATE TABLE IF NOT EXISTS text_files (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        word_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'processed'
      )
    `;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_text_files_user_id ON text_files(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_text_files_created_at ON text_files(created_at)`;

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`;
    return result.rows[0]?.test === 1;
  } catch (error) {
    console.error('Postgres connection test failed:', error);
    return false;
  }
}

// Export all functions
module.exports = {
  createUser,
  getUserById,
  createDocument,
  getUserDocuments,
  createSummary,
  getUserSummaries,
  getSummaryById,
  deleteSummary,
  initializeDatabase,
  testConnection
};
