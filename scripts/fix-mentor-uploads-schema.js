const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function fixMentorUploadsSchema() {
  try {
    console.log('Checking current mentor_uploads table schema...\n');
    
    // Check current columns
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_uploads' 
      ORDER BY ordinal_position
    `;
    
    console.log('Current columns:');
    columns.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Check if uploaded_by column exists
    const hasUploadedBy = columns.rows.some(row => row.column_name === 'uploaded_by');
    
    if (!hasUploadedBy) {
      console.log('\n❌ uploaded_by column missing. Adding it...');
      
      await sql`
        ALTER TABLE mentor_uploads 
        ADD COLUMN uploaded_by VARCHAR(255) DEFAULT 'mentor'
      `;
      
      console.log('✅ Added uploaded_by column');
    } else {
      console.log('\n✅ uploaded_by column already exists');
    }
    
    // Verify final schema
    const finalColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_uploads' 
      ORDER BY ordinal_position
    `;
    
    console.log('\nFinal schema:');
    finalColumns.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('Error fixing schema:', error.message);
  }
}

fixMentorUploadsSchema();
