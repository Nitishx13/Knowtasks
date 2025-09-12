import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/utils/auth';

const ResearchPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [researchResults, setResearchResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchResearchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = getAuthHeaders(user);
      const response = await fetch(`/api/research?userId=${user.id}`, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch research data');
      }
      
      const data = await response.json();
      setResearchResults(data);
    } catch (err) {
      console.error('Error fetching research data:', err);
      setError('Failed to load research data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchResearchData();
    }
  }, [user, fetchResearchData]);

  const filteredResults = () => {
    if (activeFilter === 'all') return researchResults;
    return researchResults.filter(result => result.type === activeFilter);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Research</h1>
        <Button variant="outline">New Research</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div>
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'article' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('article')}
            >
              Articles
            </Button>
            <Button 
              variant={activeFilter === 'paper' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('paper')}
            >
              Papers
            </Button>
          </div>
          
          {filteredResults().length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No research results found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults().map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{result.type}</span>
                    <Button variant="link" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchPage;