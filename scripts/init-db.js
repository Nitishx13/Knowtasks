// Database initialization script for Vercel Postgres
// Run with: npm run init-db

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Check if table exists and get current structure
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'uploaded_files'
      )
    `;

    if (tableExists.rows[0].exists) {
      console.log('Table uploaded_files already exists. Checking structure...');
      
      // Get current columns
      const currentColumns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'uploaded_files' 
        ORDER BY ordinal_position
      `;
      
      const columnNames = currentColumns.rows.map(col => col.column_name);
      console.log('Current columns:', columnNames);
      
      // Add missing columns if they don't exist
      if (!columnNames.includes('content')) {
        console.log('Adding content column...');
        await sql`ALTER TABLE uploaded_files ADD COLUMN content TEXT`;
      }
      
      if (!columnNames.includes('summary')) {
        console.log('Adding summary column...');
        await sql`ALTER TABLE uploaded_files ADD COLUMN summary TEXT`;
      }
      
      if (!columnNames.includes('file_type')) {
        console.log('Adding file_type column...');
        await sql`ALTER TABLE uploaded_files ADD COLUMN file_type VARCHAR(20)`;
      }
      
      if (!columnNames.includes('created_at')) {
        console.log('Adding created_at column...');
        await sql`ALTER TABLE uploaded_files ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
      }
      
      if (!columnNames.includes('updated_at')) {
        console.log('Adding updated_at column...');
        await sql`ALTER TABLE uploaded_files ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
      }
      
    } else {
      console.log('Creating uploaded_files table...');
      
      // Create uploaded_files table
      await sql`
        CREATE TABLE uploaded_files (
          id SERIAL PRIMARY KEY,
          file_name VARCHAR(255) NOT NULL,
          file_url TEXT NOT NULL,
          file_size BIGINT NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          upload_source VARCHAR(100) DEFAULT 'web_upload',
          upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'pending',
          content TEXT,
          summary TEXT,
          file_type VARCHAR(20),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    }

    // Create indexes for better performance (ignore if they already exist)
    try {
      await sql`CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id)`;
      console.log('Created user_id index');
    } catch (e) {
      console.log('user_id index already exists');
    }
    
    try {
      await sql`CREATE INDEX idx_uploaded_files_status ON uploaded_files(status)`;
      console.log('Created status index');
    } catch (e) {
      console.log('status index already exists');
    }
    
    try {
      await sql`CREATE INDEX idx_uploaded_files_upload_date ON uploaded_files(upload_date)`;
      console.log('Created upload_date index');
    } catch (e) {
      console.log('upload_date index already exists');
    }
    
    try {
      await sql`CREATE INDEX idx_uploaded_files_file_type ON uploaded_files(file_type)`;
      console.log('Created file_type index');
    } catch (e) {
      console.log('file_type index already exists');
    }

    // Create a function to update the updated_at timestamp
    try {
      await sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql'
      `;
      console.log('Created update_updated_at_column function');
    } catch (e) {
      console.log('Function already exists');
    }

    // Create a trigger to automatically update the updated_at column
    try {
      await sql`DROP TRIGGER IF EXISTS update_uploaded_files_updated_at ON uploaded_files`;
      await sql`
        CREATE TRIGGER update_uploaded_files_updated_at
        BEFORE UPDATE ON uploaded_files
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `;
      console.log('Created updated_at trigger');
    } catch (e) {
      console.log('Trigger already exists');
    }

    console.log('Database initialized successfully!');
    
    // Test the connection and table
    const result = await sql`SELECT COUNT(*) FROM uploaded_files`;
    console.log(`Current file count: ${result.rows[0].count}`);

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase();
