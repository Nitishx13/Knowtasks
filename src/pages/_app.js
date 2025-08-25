import '@styles/globals.css';
import '../App.css';
import { ClerkProvider } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import MainLayout from '@components/layout/MainLayout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboardRoute = router.pathname.startsWith('/dashboard');

  return (
    <ClerkProvider>
      {isDashboardRoute ? (
        <Component {...pageProps} />
      ) : (
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      )}
    </ClerkProvider>
  );
}

export default MyApp;