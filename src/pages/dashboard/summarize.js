// This file redirects to the new upload-task route
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SummarizePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/dashboard/upload-task');
  }, [router]);
  
  return null;
}