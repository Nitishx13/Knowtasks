import '../styles/globals.css';
import '../App.css';
import '../styles/main.scss';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default MyApp;