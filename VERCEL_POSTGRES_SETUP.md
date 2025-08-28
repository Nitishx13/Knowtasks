# Vercel Postgres Neon Setup Guide for Knowtasks

## 🎯 What We're Building

A complete database system using **Vercel Postgres (Neon)** to store:
- **Users** (from Clerk authentication)
- **Documents** (uploaded PDFs, files)
- **Summaries** (AI-generated summaries of documents)

## 🚀 Why Vercel Postgres Neon?

✅ **Native Vercel Integration** - Automatic environment variables  
✅ **SQL Database** - Familiar relational structure  
✅ **Better for Document Storage** - Perfect for file metadata  
✅ **Easier Deployment** - No external database setup  
✅ **Free Tier** - Generous limits for development  
✅ **Automatic Scaling** - Handles traffic spikes  

## 🚀 Quick Setup

### Step 1: Create Vercel Postgres Database

1. **Go to your Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select your project** (or create new one)
3. **Go to Storage tab**
4. **Click "Create Database"**
5. **Choose "Postgres"**
6. **Select "Neon"** (recommended)
7. **Choose region** (closest to you)
8. **Click "Create"**

### Step 2: Get Connection Details

After creation, Vercel automatically adds these environment variables:
- `POSTGRES_URL` - Full connection string
- `POSTGRES_HOST` - Database host
- `POSTGRES_DATABASE` - Database name
- `POSTGRES_USERNAME` - Username
- `POSTGRES_PASSWORD` - Password

## ⚙️ Environment Configuration

### Your `.env.local` file should look like this:

```env
# Vercel Postgres (automatically set by Vercel)
POSTGRES_URL=postgresql://username:password@host:port/database
POSTGRES_HOST=your-host.neon.tech
POSTGRES_DATABASE=your-database-name
POSTGRES_USERNAME=your-username
POSTGRES_PASSWORD=your-password

# OpenAI Configuration (for AI summarization)
OPENAI_API_KEY=your_openai_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# Development Configuration
NODE_ENV=development
DEBUG=true
```

**Note**: Vercel automatically sets the Postgres variables when you create the database!

## 🧪 Test Database Connection

### Install dependencies first:
```bash
npm install
```

### Test the database:
```bash
npm run init-db
```

### Expected Output:
```
Testing Postgres connection...
Postgres connection successful
Initializing database schema...
Database schema initialized successfully
Database initialization completed successfully
✅ Database ready
```

## 🗄️ Database Schema

### Tables Created:

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,           -- Clerk user ID
  name VARCHAR(255) NOT NULL,            -- User's display name
  email VARCHAR(255) NOT NULL,           -- User's email
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Documents Table
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,                 -- Auto-incrementing ID
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,       -- Original filename
  file_url TEXT NOT NULL,                -- UploadThing URL
  file_size BIGINT DEFAULT 0,            -- File size in bytes
  file_type VARCHAR(100) DEFAULT 'unknown', -- MIME type
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'uploaded', -- Document status
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Summaries Table
```sql
CREATE TABLE summaries (
  id SERIAL PRIMARY KEY,                 -- Auto-incrementing ID
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,           -- Summary title
  content TEXT NOT NULL,                 -- Full summary text
  key_points TEXT[] DEFAULT '{}',        -- Key points array
  file_name VARCHAR(255) NOT NULL,       -- Original filename
  file_url TEXT NOT NULL,                -- Original file URL
  word_count INTEGER DEFAULT 0,          -- Word count
  document_type VARCHAR(100) DEFAULT 'PDF', -- Type of document
  estimated_pages INTEGER DEFAULT 1,     -- Estimated page count
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relationships:
- **Users** → **Documents** (one-to-many)
- **Users** → **Summaries** (one-to-many)
- **Documents** and **Summaries** are linked by `user_id`

## 🔧 Troubleshooting

### Common Issues:

#### 1. Connection Failed
```
Failed to connect to Postgres database
```
**Solutions:**
- Check if Vercel Postgres database is created
- Verify environment variables are set
- Check database status in Vercel dashboard

#### 2. Environment Variables Missing
```
POSTGRES_URL is not defined
```
**Solutions:**
- Create Vercel Postgres database first
- Check `.env.local` file exists
- Restart development server after adding variables

#### 3. Database Schema Error
```
Error initializing database schema
```
**Solutions:**
- Check database permissions
- Verify connection string format
- Check Vercel dashboard for database status

### Debug Mode:
Add to your `.env.local`:
```env
DEBUG=true
NODE_ENV=development
```

## 🚀 Development Workflow

### 1. Local Development
```bash
npm run dev
```
- Uses local `.env.local` file
- Connects to Vercel Postgres Neon
- Automatic schema creation

### 2. Testing
```bash
npm run init-db
```
- Tests database connection
- Creates tables if they don't exist
- Sets up indexes for performance

### 3. Deployment
- Push to GitHub
- Vercel automatically deploys
- Uses production Postgres database
- Environment variables automatically set

## 📊 Database Operations

### What Happens When You Upload a Document:

1. **User uploads PDF** → Stored in UploadThing
2. **Document metadata** → Stored in `documents` table
3. **PDF text extracted** → Processed by LangChain
4. **AI generates summary** → Stored in `summaries` table
5. **Everything linked** → User → Document → Summary

### API Endpoints:
- `POST /api/summarize/upload` - Upload and summarize PDF
- `GET /api/summarize/list` - Get user's summaries
- `GET /api/summarize/[id]` - Get specific summary

## 🎯 Next Steps

After successful database setup:

1. **Test the API endpoints**:
   ```bash
   npm run dev
   ```

2. **Upload a test PDF** through the application

3. **Check database** for stored data in Vercel dashboard

4. **Deploy to Vercel** - database automatically configured!

## 📚 Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Neon Database Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Vercel Postgres database is created
3. Check environment variables in Vercel dashboard
4. Test with `npm run init-db`
5. Check Vercel dashboard for database status

---

**🎉 Once your Vercel Postgres is working, you'll have a complete system for storing documents and AI-generated summaries with seamless Vercel integration!**
