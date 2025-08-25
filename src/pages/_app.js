import '@styles/globals.css';
import '../App.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClerkProvider } from '@clerk/nextjs';

// Import layouts
import MainLayout from '@components/layout/MainLayout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Check if the current route is a dashboard route
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  
  // Authentication is now handled by Clerk and middleware.js
  // No need for manual authentication checks here
  
  // Wrap everything with ClerkProvider
  return (
    <ClerkProvider {...pageProps}>
      {!isDashboardRoute ? (
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      ) : (
        // For dashboard routes, the layout will be handled in the dashboard pages
        <Component {...pageProps} />
      )}
    </ClerkProvider>
  );
}

export default MyApp;