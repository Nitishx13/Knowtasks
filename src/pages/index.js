import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page component
    router.push('/home');
  }, [router]);

  return null; // This page will redirect, so no need for content
}