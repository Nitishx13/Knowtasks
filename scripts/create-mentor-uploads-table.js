require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function createMentorUploadsTable() {
  try {
    console.log('🔧 Creating mentor_uploads table...');
    
    // Drop table if exists (for clean setup)
    await sql`DROP TABLE IF EXISTS mentor_uploads CASCADE`;
    console.log('✅ Dropped existing mentor_uploads table');
    
    // Create mentor_uploads table with proper schema
    await sql`
      CREATE TABLE mentor_uploads (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        category VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        year INTEGER,
        exam_type VARCHAR(100),
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    
    console.log('✅ Created mentor_uploads table');
    
    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_mentor_uploads_user_id ON mentor_uploads(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mentor_uploads_type ON mentor_uploads(type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mentor_uploads_subject ON mentor_uploads(subject)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_mentor_uploads_category ON mentor_uploads(category)`;
    
    console.log('✅ Created indexes');
    
    // Verify table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_uploads'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📊 mentor_uploads table schema:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
    });
    
    // Insert test data
    console.log('\n📝 Inserting test data...');
    
    const testUpload = await sql`
      INSERT INTO mentor_uploads (
        user_id, title, description, subject, category, type, 
        file_name, file_path, file_size
      ) VALUES (
        'test_user_123',
        'Sample Physics Notes',
        'Comprehensive notes on mechanics and thermodynamics',
        'physics',
        'neet',
        'notes',
        'physics-notes-sample.pdf',
        '/uploads/mentor-content/physics-notes-sample.pdf',
        1024000
      )
      RETURNING *
    `;
    
    console.log('✅ Test data inserted:', testUpload.rows[0]);
    
    console.log('\n🎉 mentor_uploads table setup complete!');
    
  } catch (error) {
    console.error('❌ Error creating mentor_uploads table:', error.message);
  }
}

createMentorUploadsTable();
