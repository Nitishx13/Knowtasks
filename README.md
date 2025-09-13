# Knowtasks

A comprehensive educational platform for 9-12 class students with mentor content management and student learning resources.

## Features

- **Student Dashboard**: Access to organized content library, summarization tools, and learning materials
- **Mentor System**: Content upload and management for educational materials (PDFs, flashcards, notes, PYQ)
- **Admin Panel**: User and mentor management with application approval system
- **Content Library**: Searchable and filterable educational resources
- **PDF Viewer**: Built-in PDF viewing and download capabilities

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Vercel Postgres)
- **Authentication**: Custom authentication system
- **File Storage**: Local file system with API serving
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nitishx13/Knowtasks.git
cd Knowtasks
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Configure your database and other environment variables
```

4. Initialize the database:
```bash
npm run setup-db
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages and API routes
│   ├── api/            # Backend API endpoints
│   ├── admin/          # Admin dashboard pages
│   ├── mentor/         # Mentor dashboard pages
│   └── dashboard/      # Student dashboard pages
└── styles/             # Global styles and CSS

scripts/                # Database and setup scripts
uploads/                # File storage directory
```

## API Endpoints

- `/api/mentor/login` - Mentor authentication
- `/api/uploads/mentor-content` - File upload management
- `/api/uploads/get-mentor-content` - Retrieve uploaded content
- `/api/uploads/serve-pdf-by-id` - Serve PDF files
- `/api/mentors/apply` - Mentor application submission
- `/api/mentors/create-login` - Admin mentor account creation

## Deployment

The application is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
