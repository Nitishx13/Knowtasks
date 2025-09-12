async function createQZFilesTable() {
  const { sql } = await import('@vercel/postgres');
  try {
    console.log('Creating qz_files table...');

    // Create qz_files table
    await sql`
      CREATE TABLE IF NOT EXISTS qz_files (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100) DEFAULT 'General',
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(10) NOT NULL,
        file_size BIGINT NOT NULL,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ qz_files table created successfully');

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_qz_files_subject ON qz_files(subject)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_qz_files_created_at ON qz_files(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_qz_files_is_favorite ON qz_files(is_favorite)`;

    console.log('✅ Indexes created successfully');

  } catch (error) {
    console.error('❌ Error creating qz_files table:', error);
    throw error;
  }
}

// Run the function
createQZFilesTable()
  .then(() => {
    console.log('🎉 QZ files table setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
