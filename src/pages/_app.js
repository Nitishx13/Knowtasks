import '@styles/globals.css';
import '../App.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Import layouts
import MainLayout from '@components/layout/MainLayout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if the current route is a dashboard route
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  
  // Check authentication status on component mount
  useEffect(() => {
    // This is a placeholder for your actual authentication check
    const checkAuth = () => {
      // For demo purposes, we'll consider the user authenticated
      // In a real app, you would check localStorage, cookies, or an auth service
      const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(isLoggedIn);
      
      // Redirect to login if trying to access dashboard routes without authentication
      if (isDashboardRoute && !isLoggedIn) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router, isDashboardRoute]);
  
  // Use MainLayout for non-dashboard routes
  if (!isDashboardRoute) {
    return (
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    );
  }
  
  // For dashboard routes, the layout will be handled in the dashboard pages
  return <Component {...pageProps} />;
}

export default MyApp;