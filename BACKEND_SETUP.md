# Backend Setup Guide

This guide will help you set up the complete backend infrastructure for the PDF summarization service using UploadThing, LangChain, OpenAI, and NeoDB.

## Prerequisites

- Node.js 18+ installed
- Neo4j database (local or cloud)
- OpenAI API key
- UploadThing account

## 1. Environment Variables Setup

Update your `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# NeoDB Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password

# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here
```

## 2. Neo4j Database Setup

### Option A: Local Neo4j Installation

1. Download and install Neo4j Desktop from [neo4j.com](https://neo4j.com/download/)
2. Create a new database project
3. Start the database
4. Set the password in your environment variables

### Option B: Neo4j AuraDB (Cloud)

1. Go to [neo4j.com/cloud/platform/aura-graph-database](https://neo4j.com/cloud/platform/aura-graph-database)
2. Create a free account
3. Create a new database
4. Copy the connection details to your environment variables

## 3. OpenAI API Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and add billing information
3. Generate an API key
4. Add the key to your environment variables

## 4. UploadThing Setup

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create an account
3. Create a new project
4. Copy the API keys to your environment variables

## 5. Database Initialization

Run the database initialization script:

```bash
node -e "require('./src/lib/init-db.js')"
```

This will:
- Test the Neo4j connection
- Create necessary constraints and indexes
- Set up the database schema

## 6. Backend Architecture

### File Structure

```
src/
├── lib/
│   ├── neo4j.js              # Neo4j database operations
│   ├── langchain.js          # LangChain + OpenAI integration
│   ├── uploadthing.js        # UploadThing configuration
│   └── init-db.js           # Database initialization
├── pages/api/
│   ├── uploadthing/
│   │   └── [...uploadthing].js  # UploadThing API routes
│   └── summarize/
│       ├── upload.js         # PDF upload and summarization
│       └── list.js          # Fetch user summaries
└── services/
    └── api.js               # Frontend API service
```

### Key Components

#### 1. Neo4j Database (`src/lib/neo4j.js`)
- Database connection management
- CRUD operations for summaries
- User-summary relationships
- Schema initialization

#### 2. LangChain Integration (`src/lib/langchain.js`)
- OpenAI model configuration
- PDF text extraction
- Text chunking for large documents
- AI-powered summarization
- Document structure analysis

#### 3. UploadThing (`src/lib/uploadthing.js`)
- File upload configuration
- PDF file validation
- User authentication integration
- Upload progress tracking

#### 4. API Endpoints
- `/api/uploadthing/[...uploadthing]` - File upload handling
- `/api/summarize/upload` - PDF processing and summarization
- `/api/summarize/list` - Fetch user's summaries

## 7. Testing the Setup

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the summarize page
3. Upload a PDF file
4. Check the console for any errors
5. Verify the summary is generated and saved

## 8. Troubleshooting

### Common Issues

1. **Neo4j Connection Failed**
   - Check your connection string and credentials
   - Ensure Neo4j is running
   - Verify firewall settings

2. **OpenAI API Errors**
   - Check your API key is correct
   - Ensure you have sufficient credits
   - Verify the API key has the right permissions

3. **UploadThing Errors**
   - Verify your API keys
   - Check file size limits (4MB for PDFs)
   - Ensure proper authentication

4. **PDF Processing Errors**
   - Check if the PDF is password protected
   - Verify the PDF contains extractable text
   - Ensure the file is not corrupted

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG=true
NODE_ENV=development
```

## 9. Production Deployment

### Environment Variables
Ensure all environment variables are set in your production environment.

### Database
- Use Neo4j AuraDB for production
- Set up proper backup and monitoring
- Configure connection pooling

### File Storage
- UploadThing handles file storage automatically
- Files are stored securely in the cloud
- Automatic cleanup of unused files

### Security
- All API endpoints are protected with Clerk authentication
- File uploads are validated and sanitized
- Database queries are parameterized to prevent injection

## 10. Monitoring and Logging

The backend includes comprehensive logging for:
- Database operations
- File uploads
- AI processing
- Error handling

Check your server logs for detailed information about the processing pipeline.

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the console logs
3. Verify all environment variables are set correctly
4. Test each component individually
