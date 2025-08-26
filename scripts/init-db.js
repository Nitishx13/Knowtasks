// Script to initialize Neo4j database during deployment
import { initDatabase } from '../src/lib/init-db';

console.log('Starting database initialization script...');

initDatabase()
  .then(success => {
    if (success) {
      console.log('✅ Database initialization completed successfully');
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