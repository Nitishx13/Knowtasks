import '../styles/globals.css';
import '../App.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../contexts/AuthContext';

// Import layouts
import MainLayout from '../components/layout/MainLayout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Check if the current route is a dashboard route
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  
  // Authentication is now handled by Clerk and middleware.js
  // No need for manual authentication checks here
  
  // Wrap everything with ClerkProvider
  return (
    <ClerkProvider {...pageProps}>
      <AuthProvider>
        {!isDashboardRoute ? (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        ) : (
          // For dashboard routes, the layout will be handled in the dashboard pages
          <Component {...pageProps} />
        )}
        <Toaster />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default MyApp;