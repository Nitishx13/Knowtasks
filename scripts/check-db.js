// Script to check database structure and verify tables are empty
// Run with: node scripts/check-db.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function checkDatabase() {
  try {
    console.log('Checking database structure...');

    // Get all tables in the public schema
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    console.log('\nTables in database:');
    for (const table of tables.rows) {
      console.log(`\n- ${table.table_name}`);
      
      // Get record count for each table
      // For dynamic table names, we need to use a different approach
      let countQuery;
      try {
        // Using a raw query approach for dynamic table names
        if (table.table_name === 'text_files') {
          countQuery = await sql`SELECT COUNT(*) FROM text_files`;
        } else if (table.table_name === 'uploaded_files') {
          countQuery = await sql`SELECT COUNT(*) FROM uploaded_files`;
        } else if (table.table_name === 'users') {
          countQuery = await sql`SELECT COUNT(*) FROM users`;
        } else if (table.table_name === 'documents') {
          countQuery = await sql`SELECT COUNT(*) FROM documents`;
        } else if (table.table_name === 'summaries') {
          countQuery = await sql`SELECT COUNT(*) FROM summaries`;
        } else {
          console.log(`  Unable to count records for table: ${table.table_name}`);
          countQuery = { rows: [{ count: 'unknown' }] };
        }
      } catch (error) {
        console.log(`  Error counting records for table ${table.table_name}: ${error.message}`);
        countQuery = { rows: [{ count: 'error' }] };
      }
      console.log(`  Records: ${countQuery.rows[0].count}`);
      
      // Get columns for each table
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${table.table_name}
      `;
      
      console.log('  Columns:');
      columns.rows.forEach(column => {
        console.log(`    - ${column.column_name} (${column.data_type})`);
      });
    }

    console.log('\nDatabase check completed!');

  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

// Run the check database function
checkDatabase();