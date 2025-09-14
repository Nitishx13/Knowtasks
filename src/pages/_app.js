import '../styles/globals.css';
import '../App.css';
import '../styles/main.scss';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  // Fallback publishable key for build time
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_fallback';
  
  return (
    <ClerkProvider publishableKey={publishableKey} {...pageProps}>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default MyApp;