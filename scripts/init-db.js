// Database initialization script for Vercel Postgres
// Run with: npm run init-db

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { initializeDatabase, testConnection } = require('../src/lib/postgres.js');

async function initDatabase() {
  try {
    console.log('🧪 Testing Vercel Postgres Connection...\n');
    
    // Test 1: Connection
    console.log('1. Testing database connection...');
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✅ Database connection successful!\n');
    } else {
      console.log('❌ Database connection failed!');
      console.log('Please check your environment variables:');
      console.log('- POSTGRES_URL');
      console.log('- POSTGRES_HOST');
      console.log('- POSTGRES_DATABASE');
      console.log('- POSTGRES_USERNAME');
      console.log('- POSTGRES_PASSWORD');
      console.log('\nOr create a Vercel Postgres database in your Vercel dashboard.');
      return;
    }
    
    // Test 2: Initialize schema
    console.log('2. Initializing database schema...');
    await initializeDatabase();
    console.log('✅ Database schema initialized!\n');
    
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Your database now contains:');
    console.log('- users table (for Clerk authentication)');
    console.log('- documents table (for uploaded files)');
    console.log('- summaries table (for AI-generated summaries)');
    console.log('\n🚀 You can now run: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error('\n🔍 Check the following:');
    console.error('1. Vercel Postgres database is created');
    console.error('2. Environment variables are set correctly');
    console.error('3. Database is active in Vercel dashboard');
    console.error('\n📖 See VERCEL_POSTGRES_SETUP.md for detailed instructions');
  }
}

// Run the initialization
initDatabase();
