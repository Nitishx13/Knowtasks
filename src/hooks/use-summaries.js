import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useSummaries() {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSummaries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/summarize/list');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch summaries');
      }
      
      const data = await response.json();
      setSummaries(data.summaries);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching summaries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSummaries();
    }
  }, [user]);

  return {
    summaries,
    isLoading,
    error,
    refetch: fetchSummaries
  };
}