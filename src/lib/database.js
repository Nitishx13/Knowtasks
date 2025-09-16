const { sql } = require('@vercel/postgres');

// Enhanced database operations with proper error handling and user isolation
class Database {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Create comprehensive database schema
      await this.createTables();
      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async createTables() {
    // Users table with enhanced fields
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        clerk_id VARCHAR(255) UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        class_level VARCHAR(10),
        subjects TEXT[],
        profile_image VARCHAR(500),
        bio TEXT,
        preferences JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Mentors table
    await sql`
      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        specialization VARCHAR(100) NOT NULL,
        experience_years INTEGER DEFAULT 0,
        qualification VARCHAR(500),
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_students INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        approved_at TIMESTAMP WITH TIME ZONE,
        approved_by VARCHAR(255)
      )
    `;

    // Documents table with user isolation
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_size BIGINT DEFAULT 0,
        file_type VARCHAR(100),
        subject VARCHAR(100),
        category VARCHAR(100),
        tags TEXT[],
        upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'uploaded',
        is_public BOOLEAN DEFAULT false
      )
    `;

    // Summaries table
    await sql`
      CREATE TABLE IF NOT EXISTS summaries (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        key_points TEXT[],
        word_count INTEGER DEFAULT 0,
        reading_time INTEGER DEFAULT 0,
        difficulty_level VARCHAR(20) DEFAULT 'medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Flashcards table
    await sql`
      CREATE TABLE IF NOT EXISTS flashcards (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        category VARCHAR(100),
        file_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_size INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;


    // Notes table
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        subject VARCHAR(100),
        tags TEXT[],
        is_favorite BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Study plans table
    await sql`
      CREATE TABLE IF NOT EXISTS study_plans (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subjects TEXT[],
        start_date DATE,
        end_date DATE,
        daily_hours INTEGER DEFAULT 2,
        plan_data JSONB DEFAULT '{}',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_subject ON documents(subject)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON summaries(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id)`;
  }

  // User operations
  async createUser(userData) {
    try {
      const result = await sql`
        INSERT INTO users (id, clerk_id, name, email, role, class_level, profile_image, bio)
        VALUES (${userData.id}, ${userData.clerkId || userData.id}, ${userData.name}, ${userData.email}, 
                ${userData.role || 'student'}, ${userData.classLevel || '9'}, 
                ${userData.profileImage || ''}, ${userData.bio || ''})
        ON CONFLICT (id) DO UPDATE SET
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

  async getUserById(userId) {
    try {
      const result = await sql`SELECT * FROM users WHERE id = ${userId}`;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      const result = await sql`
        UPDATE users 
        SET name = COALESCE(${updates.name}, name),
            email = COALESCE(${updates.email}, email),
            role = COALESCE(${updates.role}, role),
            class_level = COALESCE(${updates.classLevel}, class_level),
            subjects = COALESCE(${updates.subjects}, subjects),
            profile_image = COALESCE(${updates.profileImage}, profile_image),
            bio = COALESCE(${updates.bio}, bio),
            preferences = COALESCE(${JSON.stringify(updates.preferences)}, preferences),
            updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Document operations with user isolation
  async createDocument(userId, documentData) {
    try {
      const result = await sql`
        INSERT INTO documents (user_id, title, file_name, file_url, file_size, file_type, subject, category, tags)
        VALUES (${userId}, ${documentData.title}, ${documentData.fileName}, ${documentData.fileUrl},
                ${documentData.fileSize || 0}, ${documentData.fileType}, ${documentData.subject || ''},
                ${documentData.category || ''}, ${documentData.tags || []})
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async getUserDocuments(userId, filters = {}) {
    try {
      let query = sql`SELECT * FROM documents WHERE user_id = ${userId}`;
      
      if (filters.subject) {
        query = sql`SELECT * FROM documents WHERE user_id = ${userId} AND subject = ${filters.subject}`;
      }
      
      if (filters.category) {
        query = sql`SELECT * FROM documents WHERE user_id = ${userId} AND category = ${filters.category}`;
      }
      
      query = sql`${query} ORDER BY upload_date DESC`;
      
      if (filters.limit) {
        query = sql`${query} LIMIT ${filters.limit}`;
      }
      
      const result = await query;
      return result.rows;
    } catch (error) {
      console.error('Error getting user documents:', error);
      throw error;
    }
  }

  async deleteDocument(documentId, userId) {
    try {
      const result = await sql`
        DELETE FROM documents 
        WHERE id = ${documentId} AND user_id = ${userId}
        RETURNING id
      `;
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Summary operations
  async createSummary(userId, summaryData) {
    try {
      const result = await sql`
        INSERT INTO summaries (user_id, document_id, title, content, key_points, word_count, reading_time, difficulty_level)
        VALUES (${userId}, ${summaryData.documentId || null}, ${summaryData.title}, ${summaryData.content},
                ${summaryData.keyPoints || []}, ${summaryData.wordCount || 0}, 
                ${summaryData.readingTime || 0}, ${summaryData.difficultyLevel || 'medium'})
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error creating summary:', error);
      throw error;
    }
  }

  async getUserSummaries(userId, limit = null) {
    try {
      let query = sql`
        SELECT s.*, d.title as document_title, d.subject
        FROM summaries s
        LEFT JOIN documents d ON s.document_id = d.id
        WHERE s.user_id = ${userId}
        ORDER BY s.created_at DESC
      `;
      
      if (limit) {
        query = sql`${query} LIMIT ${limit}`;
      }
      
      const result = await query;
      return result.rows;
    } catch (error) {
      console.error('Error getting user summaries:', error);
      throw error;
    }
  }

  // Notes operations
  async createNote(userId, noteData) {
    try {
      const result = await sql`
        INSERT INTO notes (user_id, title, content, subject, tags)
        VALUES (${userId}, ${noteData.title}, ${noteData.content}, 
                ${noteData.subject || ''}, ${noteData.tags || []})
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async getUserNotes(userId, filters = {}) {
    try {
      let query = sql`SELECT * FROM notes WHERE user_id = ${userId}`;
      
      if (filters.subject) {
        query = sql`SELECT * FROM notes WHERE user_id = ${userId} AND subject = ${filters.subject}`;
      }
      
      query = sql`${query} ORDER BY updated_at DESC`;
      
      const result = await query;
      return result.rows;
    } catch (error) {
      console.error('Error getting user notes:', error);
      throw error;
    }
  }

  async updateNote(noteId, userId, updates) {
    try {
      const result = await sql`
        UPDATE notes 
        SET title = ${updates.title}, content = ${updates.content}, 
            subject = ${updates.subject || ''}, tags = ${updates.tags || []},
            updated_at = NOW()
        WHERE id = ${noteId} AND user_id = ${userId}
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(noteId, userId) {
    try {
      const result = await sql`
        DELETE FROM notes 
        WHERE id = ${noteId} AND user_id = ${userId}
        RETURNING id
      `;
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  // Flashcard operations
  async createFlashcard(userId, flashcardData) {
    try {
      const result = await sql`
        INSERT INTO flashcards (user_id, title, description, subject, category, file_name, file_url, file_size)
        VALUES (${userId}, ${flashcardData.title}, ${flashcardData.description || ''}, 
                ${flashcardData.subject || ''}, ${flashcardData.category || ''}, 
                ${flashcardData.fileName}, ${flashcardData.fileUrl}, ${flashcardData.fileSize || 0})
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error creating flashcard:', error);
      throw error;
    }
  }

  async getUserFlashcards(userId, subject = null) {
    try {
      let query = sql`SELECT * FROM flashcards WHERE user_id = ${userId}`;
      
      if (subject) {
        query = sql`SELECT * FROM flashcards WHERE user_id = ${userId} AND subject = ${subject}`;
      }
      
      query = sql`${query} ORDER BY created_at DESC`;
      
      const result = await query;
      return result.rows;
    } catch (error) {
      console.error('Error getting user flashcards:', error);
      throw error;
    }
  }


  // Study plan operations
  async createStudyPlan(userId, planData) {
    try {
      const result = await sql`
        INSERT INTO study_plans (user_id, title, description, subjects, start_date, end_date, daily_hours, plan_data)
        VALUES (${userId}, ${planData.title}, ${planData.description || ''}, 
                ${planData.subjects || []}, ${planData.startDate}, ${planData.endDate},
                ${planData.dailyHours || 2}, ${JSON.stringify(planData.planData || {})})
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error creating study plan:', error);
      throw error;
    }
  }

  async getUserStudyPlans(userId) {
    try {
      const result = await sql`
        SELECT * FROM study_plans 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
      `;
      return result.rows;
    } catch (error) {
      console.error('Error getting user study plans:', error);
      throw error;
    }
  }

  // Mentor operations
  async createMentorApplication(userId, mentorData) {
    try {
      const result = await sql`
        INSERT INTO mentors (user_id, specialization, experience_years, qualification)
        VALUES (${userId}, ${mentorData.specialization}, ${mentorData.experienceYears || 0}, 
                ${mentorData.qualification || ''})
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error creating mentor application:', error);
      throw error;
    }
  }

  async getMentorByUserId(userId) {
    try {
      const result = await sql`
        SELECT m.*, u.name, u.email, u.profile_image
        FROM mentors m
        JOIN users u ON m.user_id = u.id
        WHERE m.user_id = ${userId}
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting mentor:', error);
      throw error;
    }
  }

  async getAllMentors(status = 'approved') {
    try {
      const result = await sql`
        SELECT m.*, u.name, u.email, u.profile_image
        FROM mentors m
        JOIN users u ON m.user_id = u.id
        WHERE m.status = ${status}
        ORDER BY m.rating DESC, m.total_students DESC
      `;
      return result.rows;
    } catch (error) {
      console.error('Error getting mentors:', error);
      throw error;
    }
  }

  // Admin operations
  async approveMentor(mentorId, approvedBy) {
    try {
      const result = await sql`
        UPDATE mentors 
        SET status = 'approved', approved_at = NOW(), approved_by = ${approvedBy}
        WHERE id = ${mentorId}
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error approving mentor:', error);
      throw error;
    }
  }

  async getUserStats(userId) {
    try {
      const [documents, summaries, notes, flashcards] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM documents WHERE user_id = ${userId}`,
        sql`SELECT COUNT(*) as count FROM summaries WHERE user_id = ${userId}`,
        sql`SELECT COUNT(*) as count FROM notes WHERE user_id = ${userId}`,
        sql`SELECT COUNT(*) as count FROM flashcards WHERE user_id = ${userId}`
      ]);

      return {
        documents: parseInt(documents.rows[0].count),
        summaries: parseInt(summaries.rows[0].count),
        notes: parseInt(notes.rows[0].count),
        flashcards: parseInt(flashcards.rows[0].count)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const result = await sql`SELECT 1 as test`;
      return result.rows[0]?.test === 1;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
const database = new Database();
module.exports = database;
