// Database initialization script for Formula Bank and Authentication
// Run with: node scripts/init-formula-bank-db.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function initFormulaBankDatabase() {
  try {
    console.log('Initializing Formula Bank and Authentication database...');

    // Create formula_bank table
    const formulaBankExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'formula_bank'
      )
    `;

    if (!formulaBankExists.rows[0].exists) {
      console.log('Creating formula_bank table...');
      await sql`
        CREATE TABLE formula_bank (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_name VARCHAR(255) NOT NULL,
          file_url TEXT NOT NULL,
          file_size BIGINT NOT NULL,
          category VARCHAR(100) NOT NULL,
          subject VARCHAR(100) NOT NULL,
          uploaded_by VARCHAR(255) NOT NULL,
          uploader_role VARCHAR(50) NOT NULL DEFAULT 'mentor',
          content TEXT,
          summary TEXT,
          tags TEXT[],
          is_public BOOLEAN DEFAULT true,
          status VARCHAR(50) DEFAULT 'active',
          download_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('Formula Bank table created successfully!');
    } else {
      console.log('Formula Bank table already exists.');
    }

    // Create superadmin_users table
    const superAdminExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'superadmin_users'
      )
    `;

    if (!superAdminExists.rows[0].exists) {
      console.log('Creating superadmin_users table...');
      await sql`
        CREATE TABLE superadmin_users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'superadmin',
          status VARCHAR(50) DEFAULT 'active',
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('SuperAdmin users table created successfully!');
    } else {
      console.log('SuperAdmin users table already exists.');
    }

    // Create mentor_users table
    const mentorExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'mentor_users'
      )
    `;

    if (!mentorExists.rows[0].exists) {
      console.log('Creating mentor_users table...');
      await sql`
        CREATE TABLE mentor_users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          subject VARCHAR(100) NOT NULL,
          role VARCHAR(50) DEFAULT 'mentor',
          status VARCHAR(50) DEFAULT 'active',
          students_count INTEGER DEFAULT 0,
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('Mentor users table created successfully!');
    } else {
      console.log('Mentor users table already exists.');
    }

    // Create indexes for better performance
    try {
      await sql`CREATE INDEX idx_formula_bank_category ON formula_bank(category)`;
      await sql`CREATE INDEX idx_formula_bank_subject ON formula_bank(subject)`;
      await sql`CREATE INDEX idx_formula_bank_uploader ON formula_bank(uploaded_by)`;
      await sql`CREATE INDEX idx_formula_bank_status ON formula_bank(status)`;
      await sql`CREATE INDEX idx_superadmin_email ON superadmin_users(email)`;
      await sql`CREATE INDEX idx_mentor_email ON mentor_users(email)`;
      await sql`CREATE INDEX idx_mentor_subject ON mentor_users(subject)`;
      console.log('Indexes created successfully!');
    } catch (e) {
      console.log('Some indexes already exist, continuing...');
    }

    // Create update triggers
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

      await sql`DROP TRIGGER IF EXISTS update_formula_bank_updated_at ON formula_bank`;
      await sql`
        CREATE TRIGGER update_formula_bank_updated_at
        BEFORE UPDATE ON formula_bank
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `;

      await sql`DROP TRIGGER IF EXISTS update_superadmin_updated_at ON superadmin_users`;
      await sql`
        CREATE TRIGGER update_superadmin_updated_at
        BEFORE UPDATE ON superadmin_users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `;

      await sql`DROP TRIGGER IF EXISTS update_mentor_updated_at ON mentor_users`;
      await sql`
        CREATE TRIGGER update_mentor_updated_at
        BEFORE UPDATE ON mentor_users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `;

      console.log('Triggers created successfully!');
    } catch (e) {
      console.log('Triggers already exist, continuing...');
    }

    // Insert default SuperAdmin user (hashed password for 'Nitish@98990')
    try {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('Nitish@98990', 10);
      
      await sql`
        INSERT INTO superadmin_users (name, email, password_hash, role, status)
        VALUES ('Nitish Kumar', 'nitishx13@gmail.com', ${hashedPassword}, 'superadmin', 'active')
        ON CONFLICT (email) DO NOTHING
      `;
      console.log('Default SuperAdmin user created/verified!');
    } catch (e) {
      console.log('Error creating default SuperAdmin:', e.message);
    }

    console.log('Formula Bank and Authentication database initialized successfully!');
    
    // Test the connection and tables
    const formulaBankCount = await sql`SELECT COUNT(*) FROM formula_bank`;
    const superAdminCount = await sql`SELECT COUNT(*) FROM superadmin_users`;
    const mentorCount = await sql`SELECT COUNT(*) FROM mentor_users`;
    
    console.log(`Current Formula Bank items: ${formulaBankCount.rows[0].count}`);
    console.log(`Current SuperAdmin users: ${superAdminCount.rows[0].count}`);
    console.log(`Current Mentor users: ${mentorCount.rows[0].count}`);

  } catch (error) {
    console.error('Error initializing Formula Bank database:', error);
    process.exit(1);
  }
}

// Run the initialization
initFormulaBankDatabase();
