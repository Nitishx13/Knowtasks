import '../styles/globals.css';
import '../App.css';
import '../styles/main.scss';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} {...pageProps}>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default MyApp;