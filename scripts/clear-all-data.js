// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function clearAllData() {
  try {
    console.log('🗑️  Clearing all data from Formula Bank, Flashcards, and PYQ...');
    
    // Clear Formula Bank data
    console.log('Clearing Formula Bank data...');
    const formulaResult = await sql`DELETE FROM uploaded_files WHERE 1=1`;
    console.log(`✅ Deleted ${formulaResult.rowCount} Formula Bank items`);
    
    // Clear Flashcards data
    console.log('Clearing Flashcards data...');
    const flashcardResult = await sql`DELETE FROM flashcards WHERE 1=1`;
    console.log(`✅ Deleted ${flashcardResult.rowCount} Flashcard items`);
    
    // Clear PYQ data
    console.log('Clearing PYQ data...');
    const pyqResult = await sql`DELETE FROM pyq WHERE 1=1`;
    console.log(`✅ Deleted ${pyqResult.rowCount} PYQ items`);
    
    // Clear uploaded files from uploads directory
    console.log('Clearing uploaded files...');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let deletedFiles = 0;
      
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
          deletedFiles++;
        }
      });
      
      console.log(`✅ Deleted ${deletedFiles} uploaded files`);
    } else {
      console.log('📁 Uploads directory not found');
    }
    
    console.log('\n🎉 All data cleared successfully!');
    console.log('- Formula Bank: Empty');
    console.log('- Flashcards: Empty');
    console.log('- PYQ: Empty');
    console.log('- Uploaded files: Removed');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    
    if (error.message.includes('POSTGRES_URL')) {
      console.log('\n💡 Database connection issue:');
      console.log('Make sure your .env.local file has the correct POSTGRES_URL');
    }
  }
}

// Confirmation prompt
console.log('⚠️  WARNING: This will delete ALL data from:');
console.log('- Formula Bank items');
console.log('- Flashcards');
console.log('- Previous Year Questions (PYQ)');
console.log('- All uploaded files');
console.log('\nThis action cannot be undone!');

// Run the clear operation
clearAllData();
