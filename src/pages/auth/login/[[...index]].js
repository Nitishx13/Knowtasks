import React from 'react';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignedIn>
        {() => {
          // Use useEffect to redirect after component mounts
          React.useEffect(() => {
            router.push('/dashboard');
          }, [router]);
          return (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
            </div>
          );
        }}
      </SignedIn>
      <SignedOut>
        <SignIn redirectUrl="/dashboard" afterSignInUrl="/dashboard" />
      </SignedOut>
    </div>
  );
}
