import { initializeDatabase, testConnection, getDriver } from './neo4j';

export async function initDatabase() {
  try {
    console.log('Testing Neo4j connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to Neo4j database');
      return false;
    }
    
    console.log('Neo4j connection successful');
    
    console.log('Initializing database schema...');
    await initializeDatabase();
    
    console.log('Database initialization completed successfully');
    return true;
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Run initialization if this file is executed directly
if (typeof window === 'undefined') {
  initDatabase()
    .then(success => {
      if (success) {
        console.log('✅ Database ready');
        process.exit(0);
      } else {
        console.error('❌ Database initialization failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Database initialization error:', error);
      process.exit(1);
    });
}
