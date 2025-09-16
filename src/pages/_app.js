import '../styles/globals.css';
import '../App.css';
import '../styles/main.scss';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  const clerkPublishableKey = 'pk_test_d2lzZS1naWJib24tNy5jbGVyay5hY2NvdW50cy5kZXYk';
  
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPublishableKey} {...pageProps}>
        <AuthProvider>
          <Component {...pageProps} />
          <Toaster />
        </AuthProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default MyApp;