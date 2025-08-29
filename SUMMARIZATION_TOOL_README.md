# Smart Summarization Tool

A powerful document summarization tool built with Next.js, featuring PDF processing, advanced text analysis, and Neon database storage.

## Features

### 🚀 Core Functionality
- **PDF Upload & Processing**: Upload PDF files up to 50MB for automatic text extraction
- **Advanced Summarization**: Intelligent algorithm that analyzes word frequency, sentence position, and content relevance
- **Multiple Input Methods**: Upload files or paste text directly
- **Database Storage**: All summaries are stored in Neon database for persistence and retrieval
- **Search & Filter**: Find previous summaries by filename or content

### 📊 Supported File Types
- **PDF**: Full text extraction and processing
- **TXT**: Plain text files
- **DOC/DOCX**: Word documents (placeholder support)
- **Other**: Generic file handling

### 🎯 Summarization Algorithm
The tool uses an advanced algorithm that:
- Analyzes word frequency and importance
- Considers sentence position (earlier sentences get higher scores)
- Optimizes for sentence length and readability
- Filters out common stop words
- Generates summaries that are 20-30% of original length

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
The tool uses Vercel Postgres (Neon) for data storage. Ensure you have:
- Vercel Postgres database created
- Environment variables configured in `.env.local`:
  ```
  POSTGRES_URL=your_postgres_connection_string
  POSTGRES_HOST=your_host
  POSTGRES_DATABASE=your_database
  POSTGRES_USERNAME=your_username
  POSTGRES_PASSWORD=your_password
  ```

### 3. Initialize Database
```bash
npm run init-db
```

This creates the necessary tables and indexes for optimal performance.

### 4. Start Development Server
```bash
npm run dev
```

## API Endpoints

### Upload & Summarize
- **POST** `/api/summarize/upload`
  - Uploads files and generates summaries
  - Stores results in database
  - Returns file ID, content, and summary

### List Summaries
- **GET** `/api/summarize/list`
  - Retrieves all summaries with pagination
  - Supports search and filtering
  - Query parameters: `search`, `page`, `limit`, `userId`

### Get Specific Summary
- **GET** `/api/summarize/[id]`
  - Retrieves a specific summary by ID
  - Returns full summary details

### Text Summarization
- **POST** `/api/summarize`
  - Summarizes plain text input
  - Uses mock algorithm for text-only input

### Database Test
- **GET** `/api/test-db`
  - Tests database connection
  - Shows table structure and sample data

## Usage

### 1. File Upload
1. Navigate to the Summarize page in your dashboard
2. Click "Upload File" tab
3. Select a PDF or text file (up to 50MB)
4. Click "Upload & Summarize"
5. Wait for processing and view results

### 2. Text Input
1. Click "Paste Text" tab
2. Enter or paste your text content
3. Click "Generate Summary"
4. View the generated summary

### 3. View Previous Summaries
- All summaries are automatically saved to the database
- Use the search bar to find specific summaries
- View file details, word counts, and creation dates

## Database Schema

### `uploaded_files` Table
```sql
CREATE TABLE uploaded_files (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  upload_source VARCHAR(100) DEFAULT 'web_upload',
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  content TEXT,
  summary TEXT,
  file_type VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `user_id` for user-specific queries
- `status` for filtering processed files
- `upload_date` for chronological sorting
- `file_type` for file type filtering

## Technical Details

### File Processing
- **PDF**: Uses `pdf-parse` library for text extraction
- **Text**: Direct file reading with UTF-8 encoding
- **Storage**: Files are processed and then cleaned up from temporary storage
- **Content**: Full text content and generated summaries are stored in database

### Summarization Algorithm
1. **Text Cleaning**: Normalize whitespace and remove special characters
2. **Sentence Splitting**: Break text into meaningful sentences
3. **Word Analysis**: Calculate frequency and filter stop words
4. **Scoring**: Score sentences based on:
   - Word frequency (50% weight)
   - Position in document (30% weight)
   - Sentence length optimization (20% weight)
5. **Selection**: Choose top-scoring sentences for summary
6. **Reconstruction**: Combine selected sentences into coherent summary

### Performance Features
- Database indexes for fast queries
- Pagination for large result sets
- Efficient file processing with cleanup
- Connection pooling via Vercel Postgres

## Troubleshooting

### Common Issues

1. **PDF Processing Fails**
   - Ensure PDF is not corrupted
   - Check file size (max 50MB)
   - Verify PDF contains extractable text

2. **Database Connection Errors**
   - Check environment variables
   - Verify Vercel Postgres is active
   - Run `npm run init-db` to test connection

3. **File Upload Fails**
   - Check file size limits
   - Verify file type is supported
   - Check browser console for errors

### Testing
- Use `/api/test-db` to verify database connectivity
- Check browser network tab for API responses
- Monitor server logs for detailed error information

## Future Enhancements

- **AI Integration**: Connect to external AI services for better summaries
- **Batch Processing**: Handle multiple files simultaneously
- **Export Options**: Download summaries in various formats
- **Collaboration**: Share summaries with team members
- **Analytics**: Track usage patterns and summary quality

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify database configuration
3. Check API endpoint responses
4. Review server logs for detailed error information

---

**Note**: This tool is designed for educational and productivity purposes. Ensure you have proper rights to process and summarize any documents you upload.
