# Deployment Guide for Knowtasks

This document provides step-by-step instructions for deploying the Knowtasks application to Vercel.

## Prerequisites

- A GitHub account with the Knowtasks repository
- A Vercel account (you can sign up at [vercel.com](https://vercel.com))
- Node.js and npm installed locally

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   - Ensure all changes are committed and pushed to your GitHub repository

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Project**
   - Vercel will automatically detect Next.js
   - Configure your environment variables based on `.env.example`
   - Click "Deploy"

4. **Verify Deployment**
   - Once deployment is complete, Vercel will provide a URL
   - Visit the URL to ensure your application is working correctly

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Local Directory**
   ```bash
   # Navigate to your project directory
   cd path/to/knowtasks
   
   # Deploy to Vercel
   vercel
   ```

4. **Follow the CLI Prompts**
   - Confirm project settings
   - Set up environment variables

## Environment Variables

Make sure to set up the following environment variables in your Vercel project settings:

- `NEXT_PUBLIC_API_URL`: Your API URL
- `NEXT_PUBLIC_AUTH_DOMAIN`: Authentication domain
- `NEXT_PUBLIC_AUTH_CLIENT_ID`: Authentication client ID
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key (if using Firebase)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID

## Custom Domains

To set up a custom domain:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the verification steps

## Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository:

- Each push to the main branch will trigger a production deployment
- Pull requests will generate preview deployments

## Troubleshooting

- **Build Failures**: Check the build logs in Vercel for specific errors
- **Environment Variables**: Ensure all required environment variables are set
- **API Connectivity**: Verify that your API endpoints are accessible from Vercel

## Support

If you encounter issues with deployment, refer to the [Vercel documentation](https://vercel.com/docs) or contact the project maintainers.