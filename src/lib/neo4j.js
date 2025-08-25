import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const username = process.env.NEO4J_USERNAME || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

let driver;

export function getDriver() {
  if (!driver) {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }
  return driver;
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

export async function testConnection() {
  const driver = getDriver();
  try {
    const session = driver.session();
    const result = await session.run('RETURN 1 as test');
    await session.close();
    return result.records[0].get('test').toNumber() === 1;
  } catch (error) {
    console.error('Neo4j connection test failed:', error);
    return false;
  }
}

// Database operations for summaries
export async function createSummary(userId, summaryData) {
  const driver = getDriver();
  const session = driver.session();
  
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (s:Summary {
        id: randomUUID(),
        title: $title,
        content: $content,
        keyPoints: $keyPoints,
        fileName: $fileName,
        fileUrl: $fileUrl,
        wordCount: $wordCount,
        createdAt: datetime(),
        updatedAt: datetime()
      })
      CREATE (u)-[:CREATED]->(s)
      RETURN s
      `,
      {
        userId,
        title: summaryData.title,
        content: summaryData.content,
        keyPoints: summaryData.keyPoints,
        fileName: summaryData.fileName,
        fileUrl: summaryData.fileUrl,
        wordCount: summaryData.wordCount
      }
    );
    
    return result.records[0].get('s').properties;
  } finally {
    await session.close();
  }
}

export async function getUserSummaries(userId) {
  const driver = getDriver();
  const session = driver.session();
  
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CREATED]->(s:Summary)
      RETURN s
      ORDER BY s.createdAt DESC
      `,
      { userId }
    );
    
    return result.records.map(record => record.get('s').properties);
  } finally {
    await session.close();
  }
}

export async function getSummaryById(summaryId) {
  const driver = getDriver();
  const session = driver.session();
  
  try {
    const result = await session.run(
      `
      MATCH (s:Summary {id: $summaryId})
      RETURN s
      `,
      { summaryId }
    );
    
    if (result.records.length === 0) {
      return null;
    }
    
    return result.records[0].get('s').properties;
  } finally {
    await session.close();
  }
}

export async function deleteSummary(summaryId, userId) {
  const driver = getDriver();
  const session = driver.session();
  
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:CREATED]->(s:Summary {id: $summaryId})
      DETACH DELETE s
      RETURN count(s) as deleted
      `,
      { summaryId, userId }
    );
    
    return result.records[0].get('deleted').toNumber() > 0;
  } finally {
    await session.close();
  }
}

// Initialize database schema
export async function initializeDatabase() {
  const driver = getDriver();
  const session = driver.session();
  
  try {
    // Create constraints and indexes
    await session.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT summary_id IF NOT EXISTS FOR (s:Summary) REQUIRE s.id IS UNIQUE');
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  } finally {
    await session.close();
  }
}
