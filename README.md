# Knowtasks

A Next.js application for task management and knowledge organization.

## Features

- Home page with feature showcase
- User authentication (login/register)
- Dashboard with summarization tools
- Research and library management
- Notes organization

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect Next.js and deploy your application

### Setting up Neo4j on Vercel

This application uses Neo4j as its database. To set up Neo4j for your Vercel deployment:

1. Create a Neo4j Aura account and database at [Neo4j Aura](https://neo4j.com/cloud/aura/)
2. Get your Neo4j connection details (URI, username, password)
3. Add these as environment variables in your Vercel project settings:
   - `NEO4J_URI`: Your Neo4j connection URI
   - `NEO4J_USERNAME`: Your Neo4j username
   - `NEO4J_PASSWORD`: Your Neo4j password

### Setting up UploadThing

For file uploads, this project uses UploadThing:

1. Create an account at [UploadThing](https://uploadthing.com/)
2. Create a new app and get your API keys
3. Add these as environment variables in your Vercel project settings:
   - `UPLOADTHING_SECRET`: Your UploadThing secret key
   - `UPLOADTHING_APP_ID`: Your UploadThing app ID

### Setting up OpenAI API

For summarization features, you need an OpenAI API key:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it as an environment variable in your Vercel project settings:
   - `OPENAI_API_KEY`: Your OpenAI API key

### Setting up Clerk Authentication

For user authentication, this project uses Clerk:

1. Create an account at [Clerk](https://clerk.dev/)
2. Create a new application and get your API keys
3. Add these as environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key

Alternatively, you can deploy using the Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```
